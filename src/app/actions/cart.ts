"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";

export async function addToCart(
    productId: string, 
    quantity: number = 1, 
    selectedOptions?: Record<string, string>, 
    notes?: string
) {
    try {
        const user = await getCurrentUser();
        
        if (!user) {
            throw new Error("Silakan masuk (login) terlebih dahulu");
        }

        let order = await prisma.order.findFirst({
            where: {
                userId: user.id,
                status: "pending"
            }
        });

        if (!order) {
            order = await prisma.order.create({
                data: {
                    userId: user.id,
                    totalAmount: 0,
                    status: "pending"
                }
            });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                flashSaleItems: {
                    where: {
                        flashSale: { isActive: true, startTime: { lte: new Date() }, endTime: { gte: new Date() } }
                    },
                    include: { flashSale: true }
                }
            }
        });

        if (!product) throw new Error("Produk tidak ditemukan");
        
        // Calculate price delta from selected options
        let priceDelta = 0;
        const productAny = product as any;
        if (selectedOptions && productAny.customOptions) {
            try {
                const customOptionsArr = typeof productAny.customOptions === "string" 
                    ? JSON.parse(productAny.customOptions) 
                    : productAny.customOptions;
                
                if (Array.isArray(customOptionsArr)) {
                    customOptionsArr.forEach((opt: any) => {
                        const selectedLabel = selectedOptions[opt.name];
                        if (selectedLabel && Array.isArray(opt.options)) {
                            const choice = opt.options.find((o: any) => o.label === selectedLabel);
                            if (choice) priceDelta += Number(choice.priceDelta) || 0;
                        }
                    });
                }
            } catch (e) {
                console.error("Error parsing customOptions", e);
            }
        }

        let currentPrice = product.price + priceDelta;
        const activeFlashSale = product.flashSaleItems[0];
        
        if (activeFlashSale) {
            if (activeFlashSale.stock > activeFlashSale.sold) {
                currentPrice = activeFlashSale.discountPrice + priceDelta;
                if (activeFlashSale.stock - activeFlashSale.sold < quantity) {
                    throw new Error(`Stok flash sale tidak mencukupi, sisa ${activeFlashSale.stock - activeFlashSale.sold}`);
                }
            } else if (product.stock < quantity) {
                throw new Error(`Stok tidak mencukupi, sisa ${product.stock}`);
            }
        } else if (product.stock < quantity) {
            throw new Error(`Stok tidak mencukupi, sisa ${product.stock}`);
        }

        // Find existing item with the exact same options
        const existingItems = await prisma.orderItem.findMany({
            where: {
                orderId: order.id,
                productId: productId
            }
        });

        const stringifiedOptions = selectedOptions ? JSON.stringify(selectedOptions) : null;
        
        let existingItem = null;
        for (const item of existingItems) {
            const itemAny = item as any;
            const itemOptsStr = itemAny.selectedOptions ? JSON.stringify(itemAny.selectedOptions) : null;
            if (itemOptsStr === stringifiedOptions && itemAny.notes === (notes || null)) {
                existingItem = item;
                break;
            }
        }

        if (existingItem) {
            await prisma.orderItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
        } else {
            await (prisma as any).orderItem.create({
                data: {
                    orderId: order.id,
                    productId: productId,
                    quantity: quantity,
                    price: currentPrice,
                    selectedOptions: selectedOptions || null,
                    notes: notes || null
                }
            });
        }

        await prisma.order.update({
            where: { id: order.id },
            data: {
                totalAmount: order.totalAmount + (currentPrice * quantity)
            }
        });

        revalidatePath("/keranjang");
        return { success: true, message: "Berhasil ditambahkan ke keranjang" };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
}

export async function updateCartItemQuantity(itemId: string, newQuantity: number) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Silakan masuk (login) terlebih dahulu");

        const item = await prisma.orderItem.findUnique({ where: { id: itemId }});
        if (!item) throw new Error("Item tidak ditemukan");
        
        const order = await prisma.order.findUnique({ where: { id: item.orderId }});
        if (!order || order.userId !== user.id) throw new Error("Akses ditolak");

        if (newQuantity <= 0) {
            return removeCartItem(itemId);
        }

        const priceDifference = (newQuantity - item.quantity) * item.price;

        await prisma.$transaction([
            prisma.orderItem.update({
                where: { id: itemId },
                data: { quantity: newQuantity }
            }),
            prisma.order.update({
                where: { id: order.id },
                data: { totalAmount: order.totalAmount + priceDifference }
            })
        ]);

        revalidatePath("/keranjang");
        return { success: true };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
}

export async function removeCartItem(itemId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Silakan masuk (login) terlebih dahulu");

        const item = await prisma.orderItem.findUnique({ where: { id: itemId }});
        if (!item) throw new Error("Item tidak ditemukan");

        const order = await prisma.order.findUnique({ where: { id: item.orderId }});
        if (!order || order.userId !== user.id) throw new Error("Akses ditolak");

        const priceToDeduct = item.price * item.quantity;

        await prisma.$transaction([
            prisma.orderItem.delete({ where: { id: itemId } }),
            prisma.order.update({
                where: { id: order.id },
                data: { totalAmount: order.totalAmount - priceToDeduct }
            })
        ]);

        revalidatePath("/keranjang");
        return { success: true };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
}

import { snap } from "@/lib/midtrans";

export async function checkoutCart(shippingData?: {
    shippingName: string;
    shippingPhone: string;
    shippingProvince: string;
    shippingCity: string;
    shippingAddress: string;
    shippingZipCode: string;
    courier: string;
    shippingCost: number;
    paymentMethod?: string;
    voucherCode?: string;
}) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Silakan masuk (login) terlebih dahulu");

        const order = await prisma.order.findFirst({
            where: { userId: user.id, status: "pending" },
            include: { 
                items: {
                    include: { product: true }
                } 
            }
        });

        if (!order || order.items.length === 0) throw new Error("Keranjang kosong");

        let discountProduct = 0;
        let discountShipping = 0;
        let finalVoucherId = null;

        // Validasi Voucher di Server-Side
        if (shippingData?.voucherCode) {
            const voucher = await prisma.voucher.findUnique({
                where: { code: shippingData.voucherCode.toUpperCase() }
            });

            if (voucher) {
                // Sederhana, jika valid hitung ulang
                if (voucher.type === 'percentage') {
                    discountProduct = Math.floor((order.totalAmount * voucher.value) / 100);
                    if (voucher.maxDiscount && discountProduct > voucher.maxDiscount) discountProduct = voucher.maxDiscount;
                } else if (voucher.type === 'nominal') {
                    discountProduct = voucher.value;
                } else if (voucher.type === 'free_shipping') {
                    discountShipping = shippingData.shippingCost;
                    if (voucher.maxDiscount && discountShipping > voucher.maxDiscount) discountShipping = voucher.maxDiscount;
                }
                
                if (discountProduct > order.totalAmount) discountProduct = order.totalAmount;
                if (discountShipping > shippingData.shippingCost) discountShipping = shippingData.shippingCost;
                
                finalVoucherId = voucher.id;

                // Catat penggunaan voucher
                await prisma.voucherUsage.create({
                    data: {
                        userId: user.id,
                        voucherId: voucher.id,
                        orderId: order.id
                    }
                });

                await prisma.voucher.update({
                    where: { id: voucher.id },
                    data: { usedCount: { increment: 1 } }
                });
            }
        }

        // Jika ada data pengiriman, simpan ke order
        if (shippingData) {
            const { paymentMethod, voucherCode, shippingCost, ...dbData } = shippingData;
            await (prisma as any).order.update({
                where: { id: order.id },
                data: {
                    ...dbData,
                    shippingMethod: shippingData.courier,
                    discountAmount: discountProduct, // Diskon produk
                    voucherId: finalVoucherId
                }
            });
        }

        // Jika metode pembayaran adalah COD
        if (shippingData?.paymentMethod === "COD (Bayar di Tempat)") {
            await prisma.order.update({
                where: { id: order.id },
                data: { 
                    status: "packed" // Penjual bisa langsung mulai memproses
                }
            });

            revalidatePath("/keranjang");
            revalidatePath("/profil/pesanan");
            return { success: true, redirectUrl: "/profil/pesanan" };
        }

        const finalShippingCost = (shippingData?.shippingCost || 0) - discountShipping;
        const grossAmount = (order.totalAmount - discountProduct) + finalShippingCost;

        // Generate parameter Midtrans Snap
        const itemDetails = order.items.map(item => ({
            id: item.productId,
            price: item.price,
            quantity: item.quantity,
            name: item.product.name.substring(0, 50)
        }));

        if (finalShippingCost > 0) {
            itemDetails.push({
                id: "ongkir",
                price: finalShippingCost,
                quantity: 1,
                name: "Ongkir " + (shippingData?.courier || "Reguler")
            } as any);
        }

        if (discountProduct > 0) {
            itemDetails.push({
                id: "diskon",
                price: -discountProduct,
                quantity: 1,
                name: "Diskon Produk"
            } as any);
        }

        const parameter = {
            transaction_details: {
                order_id: order.id + "-" + Date.now(),
                gross_amount: grossAmount
            },
            customer_details: {
                first_name: shippingData?.shippingName || user.name || "Customer",
                email: user.email,
                phone: shippingData?.shippingPhone || "08123456789"
            },
            item_details: itemDetails
        };

        const snapResponse = await snap.createTransaction(parameter);
        
        await prisma.order.update({
            where: { id: order.id },
            data: { 
                status: "awaiting_payment",
                paymentMethod: shippingData?.paymentMethod,
                paymentToken: snapResponse.token,
                paymentUrl: snapResponse.redirect_url
            }
        });

        revalidatePath("/keranjang");
        revalidatePath("/profil/pesanan");
        
        return { success: true, redirectUrl: `/pembayaran/${order.id}` };
    } catch (error: unknown) {
        console.error("Checkout error:", error);
        return { success: false, message: (error as Error).message || "Terjadi kesalahan sistem" };
    }
}

export async function simulatePaymentSuccess(orderId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Silakan masuk terlebih dahulu");

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order || order.userId !== user.id) {
            throw new Error("Pesanan tidak ditemukan atau akses ditolak");
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status: "packed" } // Setelah dibayar, status menjadi dikemas
        });

        await prisma.orderTracking.create({
            data: {
                orderId: orderId,
                status: "paid",
                description: "Pembayaran telah berhasil diverifikasi (Simulasi)"
            }
        });

        revalidatePath("/profil/pesanan");
        revalidatePath(`/pembayaran/${orderId}`);
        return { success: true, message: "Pembayaran berhasil disimulasikan" };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message || "Gagal menyimulasikan pembayaran" };
    }
}
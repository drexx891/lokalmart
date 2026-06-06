"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";

export async function addToCart(
    productId: string, 
    quantity: number = 1, 
    selectedOptions?: Record<string, string>, 
    notes?: string,
    variantId?: string
) {
    try {
        const user = await getCurrentUser();
        
        if (!user) {
            throw new Error("Silakan masuk (login) terlebih dahulu");
        }

        let invoice = await prisma.orderInvoice.findFirst({
            where: {
                userId: user.id,
                status: "pending"
            }
        });

        if (!invoice) {
            invoice = await prisma.orderInvoice.create({
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

        // Sub-Order by supplier
        let order = await prisma.order.findFirst({
            where: {
                invoiceId: invoice.id,
                supplierId: product.supplierId
            }
        });

        if (!order) {
            order = await prisma.order.create({
                data: {
                    invoiceId: invoice.id,
                    userId: user.id,
                    supplierId: product.supplierId,
                    totalAmount: 0,
                    status: "pending"
                }
            });
        }

        // Find existing item with the exact same options
        const existingItem = await prisma.orderItem.findFirst({
            where: {
                orderId: order.id,
                productId: productId,
                variantId: variantId || null,
                selectedOptions: selectedOptions ? { equals: selectedOptions as Prisma.InputJsonValue } : undefined,
                notes: notes || null
            }
        });

        // Transaction to ensure atomicity
        await prisma.$transaction(async (tx) => {
            if (existingItem) {
                await tx.orderItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + quantity }
                });
            } else {
                await tx.orderItem.create({
                    data: {
                        orderId: order!.id,
                        productId: productId,
                        variantId: variantId || null,
                        quantity: quantity,
                        price: currentPrice,
                        selectedOptions: selectedOptions ? (selectedOptions as Prisma.InputJsonValue) : Prisma.JsonNull,
                        notes: notes || null
                    }
                });
            }

            await tx.order.update({
                where: { id: order!.id },
                data: {
                    totalAmount: order!.totalAmount + (currentPrice * quantity)
                }
            });

            await tx.orderInvoice.update({
                where: { id: invoice!.id },
                data: {
                    totalAmount: invoice!.totalAmount + (currentPrice * quantity)
                }
            });
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
            }),
            prisma.orderInvoice.update({
                where: { id: order.invoiceId! },
                data: { totalAmount: { increment: priceDifference } }
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
            }),
            prisma.orderInvoice.update({
                where: { id: order.invoiceId! },
                data: { totalAmount: { decrement: priceToDeduct } }
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

        const invoice = await prisma.orderInvoice.findFirst({
            where: { userId: user.id, status: "pending" },
            include: { 
                orders: {
                    include: {
                        items: {
                            include: { product: true }
                        }
                    }
                } 
            }
        });

        if (!invoice || invoice.orders.length === 0) throw new Error("Keranjang kosong");

        // Verify items exist
        const hasItems = invoice.orders.some(order => order.items.length > 0);
        if (!hasItems) throw new Error("Keranjang kosong");

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
                    discountProduct = Math.floor((invoice.totalAmount * voucher.value) / 100);
                    if (voucher.maxDiscount && discountProduct > voucher.maxDiscount) discountProduct = voucher.maxDiscount;
                } else if (voucher.type === 'nominal') {
                    discountProduct = voucher.value;
                } else if (voucher.type === 'free_shipping') {
                    discountShipping = shippingData.shippingCost;
                    if (voucher.maxDiscount && discountShipping > voucher.maxDiscount) discountShipping = voucher.maxDiscount;
                }
                
                if (discountProduct > invoice.totalAmount) discountProduct = invoice.totalAmount;
                if (discountShipping > shippingData.shippingCost) discountShipping = shippingData.shippingCost;
                
                finalVoucherId = voucher.id;

                // Catat penggunaan voucher
                await prisma.voucherUsage.create({
                    data: {
                        userId: user.id,
                        voucherId: voucher.id,
                        // orderId: invoice.id // voucherUsage doesn't support invoiceId yet, so leave null or update schema. But we removed it or kept it as orderId?
                    }
                });

                await prisma.voucher.update({
                    where: { id: voucher.id },
                    data: { usedCount: { increment: 1 } }
                });
            }
        }

        // Jika ada data pengiriman, simpan ke invoice
        if (shippingData) {
            const { paymentMethod, voucherCode, shippingCost, courier, ...dbData } = shippingData;
            
            // Transaction to update invoice and all sub-orders
            await prisma.$transaction(async (tx) => {
                await tx.orderInvoice.update({
                    where: { id: invoice.id },
                    data: {
                        ...dbData,
                        discountAmount: discountProduct,
                        voucherId: finalVoucherId
                    }
                });

                // Update sub-orders with shipping info (assuming all sub-orders go to same address for now)
                for (const order of invoice.orders) {
                    await tx.order.update({
                        where: { id: order.id },
                        data: {
                            shippingMethod: courier,
                            courier: courier,
                            // Split shipping cost logic can be complex, for now we assign proportional or zero, let's just save total on Invoice
                            // Actually, schema Order has shippingMethod, courier, shippingCost
                            shippingCost: Math.floor((shippingData.shippingCost - discountShipping) / invoice.orders.length)
                        }
                    });
                }
            });
        }

        // Jika metode pembayaran adalah COD
        if (shippingData?.paymentMethod === "COD (Bayar di Tempat)") {
            await prisma.$transaction(async (tx) => {
                await tx.orderInvoice.update({
                    where: { id: invoice.id },
                    data: { status: "packed" }
                });
                
                for (const order of invoice.orders) {
                    await tx.order.update({
                        where: { id: order.id },
                        data: { status: "packed" }
                    });
                }
            });

            revalidatePath("/keranjang");
            revalidatePath("/profil/pesanan");
            return { success: true, redirectUrl: "/profil/pesanan" };
        }

        const finalShippingCost = (shippingData?.shippingCost || 0) - discountShipping;
        const grossAmount = (invoice.totalAmount - discountProduct) + finalShippingCost;

        // Generate parameter Midtrans Snap
        const itemDetails: any[] = [];
        for (const order of invoice.orders) {
            for (const item of order.items) {
                itemDetails.push({
                    id: item.productId,
                    price: item.price,
                    quantity: item.quantity,
                    name: item.product.name.substring(0, 50)
                });
            }
        }

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
                order_id: invoice.id + "-" + Date.now(),
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
        
        await prisma.$transaction(async (tx) => {
            await tx.orderInvoice.update({
                where: { id: invoice.id },
                data: { 
                    status: "awaiting_payment",
                    paymentMethod: shippingData?.paymentMethod,
                    paymentToken: snapResponse.token,
                    paymentUrl: snapResponse.redirect_url
                }
            });
            
            for (const order of invoice.orders) {
                await tx.order.update({
                    where: { id: order.id },
                    data: { status: "awaiting_payment" }
                });
            }
        });

        revalidatePath("/keranjang");
        revalidatePath("/profil/pesanan");
        
        return { success: true, redirectUrl: `/pembayaran/${invoice.id}` };
    } catch (error: unknown) {
        console.error("Checkout error:", error);
        return { success: false, message: (error as Error).message || "Terjadi kesalahan sistem" };
    }
}

export async function simulatePaymentSuccess(invoiceId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Silakan masuk terlebih dahulu");

        const invoice = await prisma.orderInvoice.findUnique({
            where: { id: invoiceId },
            include: { orders: true }
        });

        if (!invoice || invoice.userId !== user.id) {
            throw new Error("Tagihan tidak ditemukan atau akses ditolak");
        }

        await prisma.$transaction(async (tx) => {
            await tx.orderInvoice.update({
                where: { id: invoiceId },
                data: { status: "packed" } // Setelah dibayar, status menjadi dikemas
            });
            
            for (const order of invoice.orders) {
                await tx.order.update({
                    where: { id: order.id },
                    data: { status: "packed" }
                });

                await tx.orderTracking.create({
                    data: {
                        orderId: order.id,
                        status: "paid",
                        description: "Pembayaran telah berhasil diverifikasi (Simulasi)"
                    }
                });
            }
        });

        revalidatePath("/profil/pesanan");
        revalidatePath(`/pembayaran/${invoiceId}`);
        return { success: true, message: "Pembayaran berhasil disimulasikan" };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message || "Gagal menyimulasikan pembayaran" };
    }
}
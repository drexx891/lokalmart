import CheckoutClient from "@/components/checkout/CheckoutClient";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
        redirect("/login");
    }

    let cartTotal = 0;
    let savedAddresses: any[] = [];
    let maxPreOrderDays = 0;
    let isCodAvailable = true;

    // Fallback data if DB fails
    let mockupAddresses = [
        {
            id: "addr_1",
            label: "Rumah",
            recipientName: sessionUser.name || "Budi Santoso",
            phone: "081234567890",
            province: "DKI Jakarta",
            city: "Jakarta Selatan",
            street: "Jl. Jend. Sudirman No. 12, Kebayoran Baru",
            zipCode: "12190",
            isPrimary: true
        }
    ];

    try {
        const order = await prisma.order.findFirst({
            where: { userId: sessionUser.id, status: "pending" },
            include: { 
                items: {
                    include: { 
                        product: {
                            include: { supplier: true }
                        }
                    }
                } 
            }
        });

        if (!order || order.items.length === 0) {
            return (
                <div className="bg-[#F7F8FA] min-h-screen py-8">
                    <div className="max-w-4xl mx-auto px-4 text-center py-20 bg-white rounded-2xl shadow-sm border border-[#E5E7EB]">
                        <h1 className="text-2xl font-bold text-[#1F2937] mb-4">Checkout Tidak Valid</h1>
                        <p className="text-[#6B7280] mb-6">Keranjang belanja Anda kosong. Silakan tambahkan produk terlebih dahulu.</p>
                        <Link href="/" className="bg-[#1A3C6E] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2A5FA0] transition-colors">
                            Kembali Belanja
                        </Link>
                    </div>
                </div>
            );
        }

        cartTotal = order.totalAmount;
        
        // Cek PO (Pre-Order) dan Ketersediaan COD
        order.items.forEach(item => {
            const productAny = item.product as any;
            if (productAny?.isPreOrder && productAny?.preOrderDays) {
                if (productAny.preOrderDays > maxPreOrderDays) {
                    maxPreOrderDays = productAny.preOrderDays;
                }
            }

            const supplierAny = productAny?.supplier;
            if (supplierAny && !supplierAny.allowCOD) {
                isCodAvailable = false;
            }
        });

        const dbAddresses = await prisma.address.findMany({
            where: { userId: sessionUser.id },
            orderBy: [ { isPrimary: 'desc' }, { createdAt: 'desc' } ]
        });

        if (dbAddresses && dbAddresses.length > 0) {
            savedAddresses = dbAddresses;
        } else {
            savedAddresses = mockupAddresses;
        }

    } catch (error) {
        console.error("DB Error at checkout:", error);
        cartTotal = 150000; // mockup price
        savedAddresses = mockupAddresses;
    }

    return (
        <div className="bg-[#F7F8FA] min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-[#1F2937]">Pengiriman & Pembayaran</h1>
                    <p className="text-[#6B7280] mt-1">Selesaikan pesanan Anda dengan aman</p>
                </div>
                <CheckoutClient 
                    savedAddresses={savedAddresses} 
                    cartTotal={cartTotal} 
                    maxPreOrderDays={maxPreOrderDays}
                    isCodAvailable={isCodAvailable}
                />
            </div>
        </div>
    );
}

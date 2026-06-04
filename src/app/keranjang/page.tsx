import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import CartClient from "@/components/cart/CartClient";
/* eslint-disable @next/next/no-img-element */

export default async function CartPage() {
    // Cari keranjang "pending" milik user berdasarkan session
    const user = await getCurrentUser();
    
    let order = null;
    if (user) {
        order = await prisma.order.findFirst({
            where: {
                userId: user.id,
                status: "pending"
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: { supplier: true }
                        }
                    },
                    orderBy: {
                        id: 'asc'
                    }
                }
            }
        });
    }

    const cartItems = order?.items || [];
    const totalAmount = order?.totalAmount || 0;
    const discountAmount = order?.discountAmount || 0;
    const finalTotal = totalAmount - discountAmount;
    const formattedTotal = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(finalTotal);

    return (
        <div className="bg-[#F7F8FA] min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Breadcrumbs */}
                <div className="text-sm text-[#6B7280] mb-6 flex items-center gap-2">
                    <Link href="/" className="hover:text-[#1A3C6E] transition-colors">Beranda</Link>
                    <span>/</span>
                    <span className="text-[#1F2937] font-medium">Keranjang (RFQ)</span>
                </div>

                <div className="bg-white p-4 border border-[#E5E7EB] rounded-sm mb-6 shadow-sm">
                    <h1 className="text-2xl font-black text-[#1F2937]">Daftar Permintaan Penawaran (Keranjang B2B)</h1>
                </div>

                {!user ? (
                    <div className="bg-white border border-[#E5E7EB] rounded-sm py-20 flex flex-col items-center justify-center text-[#9CA3AF] shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-[#E5E7EB]"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <h3 className="text-lg font-bold text-[#6B7280] mb-2">Silakan Masuk Terlebih Dahulu</h3>
                        <p>Anda perlu akun untuk meminta penawaran B2B.</p>
                        <Link href="/login" className="mt-6 border border-[#1A3C6E] text-[#1A3C6E] px-6 py-2 font-bold rounded-sm hover:bg-[#EBF2FA] transition-colors">
                            Login ke Akun
                        </Link>
                    </div>
                ) : (
                    <CartClient 
                        initialItems={cartItems} 
                        initialDiscount={discountAmount} 
                    />
                )}
            </div>
        </div>
    );
}

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function VoucherPage() {
    const sessionUser = await getCurrentUser();
    
    // Mockup data for UI rendering if DB fails or user not logged in
    let claimedVouchers: any[] = [
        {
            id: "vch_1",
            voucher: {
                code: "BELIO50",
                type: "nominal",
                value: 50000,
                endDate: new Date(Date.now() + 86400000 * 3), // +3 days
            },
            usedAt: null
        },
        {
            id: "vch_2",
            voucher: {
                code: "ONGKIRFREE",
                type: "percentage",
                value: 100,
                maxDiscount: 20000,
                endDate: new Date(Date.now() + 86400000 * 7),
            },
            usedAt: null
        }
    ];

    if (sessionUser) {
        try {
            const dbVouchers = await (prisma as any).voucherUsage.findMany({
                where: { userId: sessionUser.id },
                include: { voucher: true },
                orderBy: { usedAt: 'asc' } // used ones at the bottom, or just sort by null first
            });
            if (dbVouchers && dbVouchers.length > 0) {
                claimedVouchers = dbVouchers;
            }
        } catch (error) {
            console.error("DB Error fetching vouchers:", error);
        }
    }

    const unusedVouchers = claimedVouchers.filter(v => !v.usedAt && !v.orderId);
    const usedVouchers = claimedVouchers.filter(v => v.usedAt || v.orderId);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            <div className="border-b border-[#E5E7EB] p-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#1F2937]">Voucher Saya</h1>
                    <p className="text-sm text-[#6B7280] mt-1">Gunakan voucher di halaman keranjang untuk mendapatkan potongan harga</p>
                </div>
                <div className="text-[#1A3C6E] bg-[#EBF2FA] px-4 py-2 rounded-lg font-bold text-sm">
                    {unusedVouchers.length} Voucher Aktif
                </div>
            </div>

            <div className="p-6">
                {unusedVouchers.length === 0 ? (
                    <div className="text-center py-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1" className="mx-auto mb-4"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <p className="text-[#6B7280] font-medium">Anda belum memiliki voucher aktif.</p>
                        <Link href="/promo" className="text-[#1A3C6E] font-bold mt-2 inline-block hover:underline">Cari Promo</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {unusedVouchers.map((item) => (
                            <div key={item.id} className="border border-[#E5E7EB] rounded-xl flex overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                                <div className="w-24 bg-gradient-to-br from-[#1A3C6E] to-[#2A5FA0] flex flex-col items-center justify-center text-white p-2 border-r border-dashed border-white/50 relative">
                                    <div className="w-4 h-4 bg-white rounded-full absolute -left-2 top-1/2 -translate-y-1/2"></div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    <span className="text-[10px] font-bold tracking-widest uppercase">BELIO</span>
                                </div>
                                <div className="flex-1 p-4 bg-white relative">
                                    <div className="w-4 h-4 bg-white border-l border-[#E5E7EB] rounded-full absolute -right-2 top-1/2 -translate-y-1/2"></div>
                                    <h3 className="font-bold text-[#1F2937] text-lg">
                                        {item.voucher.type === 'nominal' 
                                            ? `Diskon Rp ${item.voucher.value / 1000}rb` 
                                            : `Diskon ${item.voucher.value}%`}
                                    </h3>
                                    <p className="text-xs text-[#6B7280] mt-1">
                                        {item.voucher.type === 'percentage' && item.voucher.maxDiscount 
                                            ? `Maks. potongan Rp ${item.voucher.maxDiscount / 1000}rb` 
                                            : `Berlaku untuk semua produk`}
                                    </p>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="text-[10px] font-semibold text-[#E24B4A]">
                                            Berlaku s/d {new Date(item.voucher.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </div>
                                        <button className="bg-[#1A3C6E] text-white px-3 py-1 text-xs font-bold rounded hover:bg-[#2A5FA0] transition-colors">
                                            Pakai
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Riwayat Penggunaan */}
            {usedVouchers.length > 0 && (
                <div className="p-6 bg-[#F9FAFB] border-t border-[#E5E7EB]">
                    <h3 className="text-sm font-bold text-[#9CA3AF] uppercase tracking-wider mb-4">Riwayat Penggunaan</h3>
                    <div className="space-y-3">
                        {usedVouchers.map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#E5E7EB] opacity-60">
                                <div>
                                    <span className="font-bold text-[#1F2937] line-through">{item.voucher.code}</span>
                                    <span className="text-xs text-[#6B7280] ml-2">Telah digunakan pada {item.usedAt ? new Date(item.usedAt).toLocaleDateString('id-ID') : 'sebelumnya'}</span>
                                </div>
                                <span className="text-xs font-bold text-[#1A3C6E]">Selesai</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

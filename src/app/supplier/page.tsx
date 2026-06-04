import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function TopSupplierPage() {
    // Simulasi data Top Supplier karena DB belum punya banyak data toko
    const suppliers = Array.from({ length: 12 }).map((_, i) => ({
        id: `supplier-${i}`,
        name: `PT Mitra Dagang Sejahtera ${i + 1}`,
        location: ["Jakarta Pusat", "Surabaya", "Bandung", "Semarang"][i % 4],
        joinedAt: `Bergabung sejak ${2020 + (i % 4)}`,
        rating: 4.8 + (i % 3 === 0 ? 0.2 : 0),
        totalProducts: 150 + (i * 25),
        isVerified: true,
        logoUrl: `https://ui-avatars.com/api/?name=Mitra+Dagang&background=1A3C6E&color=fff&size=200`,
        bannerUrl: `https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=300&fit=crop`
    }));

    return (
        <div className="bg-[#F7F8FA] min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 opacity-20">
                        <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
                            Top Supplier
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                        </h1>
                        <p className="text-blue-100 text-lg max-w-2xl">
                            Temukan mitra bisnis dan pemasok tangan pertama yang telah diverifikasi secara ketat oleh tim LokalMart.
                        </p>
                    </div>
                </div>

                {/* Grid Supplier */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suppliers.map((supplier) => (
                        <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden group hover:shadow-md transition-shadow">
                            {/* Banner Toko */}
                            <div className="h-24 w-full relative bg-blue-100">
                                <Image src={supplier.bannerUrl} alt="Banner" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                            </div>

                            <div className="p-5 relative">
                                {/* Logo Toko (overlap dengan banner) */}
                                <div className="absolute -top-10 left-5 w-16 h-16 bg-white rounded-lg p-1 shadow-md border border-[#E5E7EB]">
                                    <div className="w-full h-full relative rounded-md overflow-hidden">
                                        <Image src={supplier.logoUrl} alt={supplier.name} fill className="object-cover" />
                                    </div>
                                </div>

                                {/* Detail Toko */}
                                <div className="pt-8">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-[#1F2937] flex items-center gap-1.5">
                                                {supplier.name}
                                                {supplier.isVerified && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6" stroke="#fff" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                                                )}
                                            </h3>
                                            <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                {supplier.location}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 mt-4 py-3 border-y border-[#F3F4F6] mb-4">
                                        <div className="text-center">
                                            <div className="text-xs text-[#6B7280]">Produk</div>
                                            <div className="font-bold text-[#1F2937]">{supplier.totalProducts}</div>
                                        </div>
                                        <div className="w-px h-6 bg-[#E5E7EB]"></div>
                                        <div className="text-center">
                                            <div className="text-xs text-[#6B7280]">Rating</div>
                                            <div className="font-bold text-amber-500 flex items-center justify-center gap-0.5">
                                                {supplier.rating}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                            </div>
                                        </div>
                                        <div className="w-px h-6 bg-[#E5E7EB]"></div>
                                        <div className="text-center">
                                            <div className="text-xs text-[#6B7280]">Status</div>
                                            <div className="font-bold text-emerald-600 text-xs mt-1">Aktif</div>
                                        </div>
                                    </div>

                                    <Link href="#" className="w-full block text-center py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-sm transition-colors">
                                        Kunjungi Toko
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

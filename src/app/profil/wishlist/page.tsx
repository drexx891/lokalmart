"use client";

import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";

export default function WishlistPage() {
    
    // Mockup produk di wishlist
    const wishlistItems = [
        { id: "1", name: "Kopi Arabika Premium", price: 75000, rating: 4.8, reviewsCount: 120, location: "Bengkulu", isLocal: true },
        { id: "2", name: "Sepatu Olahraga Hitam", price: 350000, discount: 20, originalPrice: 437500, rating: 4.9, reviewsCount: 89, location: "Jakarta" },
        { id: "3", name: "Tas Ransel Pria", price: 185000, isBestSeller: true, rating: 4.7, reviewsCount: 300, location: "Bandung" }
    ];

    return (
        <div className="flex flex-col gap-6">
            
            <div className="flex items-center gap-3">
                <Link href="/profil" className="md:hidden p-2 bg-white rounded-full shadow-sm text-[#1F2937]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </Link>
                <h1 className="text-2xl font-bold text-[#1F2937]">Wishlist Produk</h1>
            </div>

            {wishlistItems.length > 0 ? (
                <>
                    <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#E5E7EB]">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 rounded border-[#D1D5DB] text-[#1A3C6E] focus:ring-[#1A3C6E]" />
                            <span className="text-sm font-semibold text-[#4B5563]">Pilih Semua</span>
                        </label>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-sm font-bold text-[#E24B4A] hover:bg-[#FEF2F2] rounded-lg transition-colors">Hapus</button>
                            <button className="px-4 py-2 text-sm font-bold text-white bg-[#1A3C6E] rounded-lg hover:bg-[#2A5FA0] transition-colors shadow-sm hidden sm:block">Pindah ke Keranjang</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {wishlistItems.map((item, idx) => (
                            <div key={idx} className="relative group">
                                <div className="absolute top-2 left-2 z-20">
                                    <input type="checkbox" className="w-5 h-5 rounded border-[#D1D5DB] text-[#1A3C6E] focus:ring-[#1A3C6E] shadow-sm bg-white" />
                                </div>
                                <button className="absolute top-2 right-2 z-20 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-[#9CA3AF] hover:text-[#E24B4A] hover:bg-white shadow-sm transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                </button>
                                
                                <ProductCard product={item as any} />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] py-24 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-24 h-24 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-6 text-[#E24B4A]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </div>
                    <h2 className="text-xl font-bold text-[#1F2937] mb-2">Wishlist kamu masih kosong</h2>
                    <p className="text-[#6B7280] max-w-sm mb-8">Temukan barang-barang incaranmu dan simpan di sini agar tidak lupa.</p>
                    <Link href="/" className="px-6 py-2.5 bg-[#1A3C6E] text-white font-bold rounded-lg hover:bg-[#2A5FA0] transition-colors shadow-sm">Jelajahi Produk</Link>
                </div>
            )}
            
        </div>
    );
}

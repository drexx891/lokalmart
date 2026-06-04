import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = 'force-dynamic';

export default async function GratisOngkirPage() {
    // Ambil produk dari database
    let products = await prisma.product.findMany({ take: 10 });

    if (products.length === 0) {
        products = Array.from({ length: 10 }).map((_, i) => ({
            id: `gratis-ongkir-${i}`,
            name: `Produk B2B Bebas Ongkir ${i + 1}`,
            price: 75000 + (i * 20000),
            imageUrl: `https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop`,
        })) as any;
    }

    return (
        <div className="bg-[#F7F8FA] min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-2xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 opacity-20">
                        <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-4">PROGRAM SPESIAL</span>
                            <h1 className="text-3xl md:text-5xl font-black mb-4">
                                Bebas Ongkir <br/>Ke Seluruh Indonesia
                            </h1>
                            <p className="text-emerald-50 text-lg max-w-lg mb-6">
                                Belanja kebutuhan bisnis tanpa pusing mikirin biaya kirim. Nikmati subsidi ongkir hingga Rp100.000 untuk setiap transaksi.
                            </p>
                        </div>
                        
                        {/* Syarat Box */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-5 shrink-0 max-w-sm">
                            <h3 className="font-bold text-xl mb-3">Syarat & Ketentuan</h3>
                            <ul className="space-y-2 text-sm text-emerald-50">
                                <li className="flex items-start gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    Minimal belanja Rp 500.000
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    Berlaku untuk ekspedisi rekanan (LokalExpress, JNE Cargo, J&T Cargo)
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    Otomatis terpotong saat Checkout
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-xl font-bold text-[#1F2937]">Produk Mendukung Gratis Ongkir</h2>
                    <div className="h-px bg-[#E5E7EB] flex-1 ml-4"></div>
                </div>

                {/* Grid Produk */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {products.map((product: any) => {
                        const formattedPrice = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(product.price);
                        
                        return (
                            <div key={product.id} className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-shadow duration-300 overflow-hidden flex flex-col group border border-[#E5E7EB] relative">
                                
                                <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 z-10 rounded-full shadow-sm flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                                    Bebas Ongkir
                                </div>

                                <div className="relative aspect-square bg-[#F7F8FA] w-full overflow-hidden">
                                    <Link href={`/produk/${product.id}`} className="block w-full h-full">
                                        <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </Link>
                                </div>

                                <div className="p-4 flex flex-col flex-1">
                                    <Link href={`/produk/${product.id}`} className="flex-1 mb-4">
                                        <h3 className="text-[#1F2937] font-medium text-sm line-clamp-2 leading-snug mb-2 group-hover:text-emerald-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="text-[#E24B4A] font-extrabold text-lg leading-none">{formattedPrice}</div>
                                    </Link>
                                    <AddToCartButton productId={product.id} />
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

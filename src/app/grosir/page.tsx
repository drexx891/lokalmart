import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = 'force-dynamic';

export default async function GrosirPage() {
    // Ambil produk dari database
    let products = await prisma.product.findMany({
        take: 20
    });

    if (products.length === 0) {
        products = Array.from({ length: 20 }).map((_, i) => ({
            id: `grosir-${i}`,
            name: `Produk B2B Grosir Super Murah ${i + 1}`,
            price: 50000 + (i * 10000),
            imageUrl: `https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=400&h=400&fit=crop`,
            stock: 10000,
            sold: 450 + (i * 10)
        })) as any;
    }

    return (
        <div className="bg-[#F7F8FA] min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-2xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 opacity-20">
                        <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
                            Grosir LokalMart
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        </h1>
                        <p className="text-indigo-100 text-lg max-w-2xl">
                            Beli lebih banyak, bayar lebih murah! Harga khusus untuk pembelian partai besar (Bulk Order).
                        </p>
                    </div>
                </div>

                {/* Grid Produk */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product: any) => {
                        const basePrice = product.price;
                        const tier1Price = Math.floor(basePrice * 0.95); // Diskon 5% untuk beli >= 10
                        const tier2Price = Math.floor(basePrice * 0.90); // Diskon 10% untuk beli >= 100

                        return (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group border border-[#E5E7EB]">
                                
                                <div className="flex p-4 gap-4">
                                    {/* Gambar */}
                                    <div className="relative w-24 h-24 shrink-0 bg-[#F7F8FA] rounded-lg overflow-hidden border border-[#F3F4F6]">
                                        <Image src={product.imageUrl} alt={product.name} fill sizes="100px" className="object-cover" />
                                    </div>
                                    
                                    {/* Info Utama */}
                                    <div>
                                        <Link href={`/produk/${product.id}`}>
                                            <h3 className="text-[#1F2937] font-bold text-sm line-clamp-2 leading-snug mb-1 group-hover:text-indigo-600 transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <div className="text-xs text-[#6B7280] mb-2 flex items-center gap-1">
                                            Stok: <span className="font-bold text-[#1F2937]">{(product.stock).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabel Harga Grosir */}
                                <div className="px-4 pb-4">
                                    <div className="bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] overflow-hidden mb-4">
                                        <div className="flex border-b border-[#E5E7EB] bg-indigo-50/50">
                                            <div className="flex-1 p-2 text-[10px] font-bold text-[#6B7280] text-center">Satuan</div>
                                            <div className="flex-1 p-2 text-[10px] font-bold text-[#6B7280] text-center border-l border-[#E5E7EB]">&ge; 10 Pcs</div>
                                            <div className="flex-1 p-2 text-[10px] font-bold text-indigo-600 text-center border-l border-[#E5E7EB]">&ge; 100 Pcs</div>
                                        </div>
                                        <div className="flex">
                                            <div className="flex-1 p-2 text-xs font-semibold text-[#1F2937] text-center">{(basePrice/1000)}k</div>
                                            <div className="flex-1 p-2 text-xs font-semibold text-[#1F2937] text-center border-l border-[#E5E7EB]">{(tier1Price/1000)}k</div>
                                            <div className="flex-1 p-2 text-xs font-bold text-indigo-600 text-center border-l border-[#E5E7EB]">{(tier2Price/1000)}k</div>
                                        </div>
                                    </div>
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

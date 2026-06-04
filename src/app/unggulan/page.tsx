import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = 'force-dynamic';

export default async function UnggulanPage() {
    // Ambil produk dari database, fallback jika kosong
    let products = await prisma.product.findMany({
        take: 20,
        orderBy: {
            createdAt: 'desc' // Menampilkan produk terbaru sebagai unggulan
        }
    });

    if (products.length === 0) {
        products = Array.from({ length: 20 }).map((_, i) => ({
            id: `unggulan-${i}`,
            name: `Produk Unggulan B2B Kualitas Premium ${i + 1}`,
            price: 150000 + (i * 25000),
            imageUrl: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop`,
            stock: 500,
            sold: 250 + i,
            rating: 4.8 + (i % 3 === 0 ? 0.2 : 0)
        })) as any;
    }

    return (
        <div className="bg-[#F7F8FA] min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-rose-500 to-rose-400 rounded-2xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 opacity-20">
                        <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
                            Produk Unggulan
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/></svg>
                        </h1>
                        <p className="text-rose-100 text-lg max-w-2xl">
                            Koleksi produk terlaris dengan rating tertinggi dari mitra terpercaya LokalMart.
                        </p>
                    </div>
                </div>

                {/* Grid Produk */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {products.map((product: any) => {
                        const formattedPrice = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(product.price);
                        
                        return (
                            <div key={product.id} className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-shadow duration-300 overflow-hidden flex flex-col group border border-[#E5E7EB] relative">
                                
                                {/* Badge */}
                                <div className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[10px] font-bold px-2.5 py-1 z-10 rounded-full shadow-sm flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    Terlaris
                                </div>

                                {/* Gambar */}
                                <div className="relative aspect-square bg-[#F7F8FA] w-full overflow-hidden">
                                    <Link href={`/produk/${product.id}`} className="block w-full h-full">
                                        <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </Link>
                                </div>

                                {/* Info */}
                                <div className="p-4 flex flex-col flex-1">
                                    <Link href={`/produk/${product.id}`} className="flex-1">
                                        <h3 className="text-[#1F2937] font-medium text-sm line-clamp-2 leading-snug mb-2 group-hover:text-[#1A3C6E] transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="text-[#E24B4A] font-extrabold text-lg leading-none mb-3">{formattedPrice}</div>
                                    </Link>

                                    {/* Rating & Penjualan */}
                                    <div className="mt-auto mb-4 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                            {product.rating || "4.9"}
                                        </div>
                                        <div className="text-[#6B7280]">
                                            Terjual {product.sold || "1k+"}
                                        </div>
                                    </div>

                                    {/* Tombol Add To Cart */}
                                    <div className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                        <AddToCartButton productId={product.id} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

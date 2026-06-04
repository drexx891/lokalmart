import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = 'force-dynamic';

export default async function SemuaProdukPage() {
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="bg-[#F7F8FA] min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-6">
                    <Link href="/" className="hover:text-[#1A3C6E] transition-colors">Beranda</Link>
                    <span>/</span>
                    <span className="font-medium text-[#1F2937]">Semua Produk</span>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] mb-8">
                    <h1 className="text-2xl md:text-3xl font-black text-[#1F2937] mb-2">Semua Produk Belio</h1>
                    <p className="text-[#6B7280]">
                        Menampilkan semua produk dari berbagai kategori dan toko terpercaya kami.
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E7EB]">
                        <span className="text-6xl mb-4 block">🛒</span>
                        <h3 className="text-xl font-bold text-[#1F2937] mb-2">Belum ada produk</h3>
                        <p className="text-[#6B7280]">Produk belum ditambahkan oleh supplier.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-shadow duration-300 overflow-hidden flex flex-col group relative">
                                <Link href={`/produk/${product.id}`} className="block relative aspect-square bg-[#F7F8FA] overflow-hidden">
                                    {product.imageUrl ? (
                                        <Image 
                                            src={product.imageUrl} 
                                            alt={product.name} 
                                            fill 
                                            className="object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-4xl">📦</span>
                                        </div>
                                    )}
                                </Link>
                                
                                <div className="p-4 flex flex-col flex-1">
                                    <Link href={`/produk/${product.id}`} className="flex-1">
                                        <h3 className="text-[#1F2937] font-medium text-sm line-clamp-2 leading-snug mb-2 group-hover:text-[#1A3C6E] transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="text-[#1A3C6E] font-bold text-base mb-1">
                                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(product.price)}
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] text-[#6B7280]">
                                            <span className="text-[#F5A623]">★</span>
                                            <span>4.9</span>
                                            <span className="mx-1">•</span>
                                            <span>{Math.floor(Math.random() * 500) + 10} Terjual</span>
                                        </div>
                                    </Link>

                                    <div className="mt-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                        <AddToCartButton productId={product.id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

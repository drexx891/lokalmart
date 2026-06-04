import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CountdownTimer from "@/components/ui/CountdownTimer";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = 'force-dynamic';

export default async function PromoPage() {
    // Ambil Flash Sale yang sedang aktif dari database (agar bisa diedit oleh Admin nanti)
    const now = new Date();
    let activeFlashSale = await prisma.flashSale.findFirst({
        where: {
            isActive: true,
            startTime: { lte: now },
            endTime: { gte: now }
        },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    // MOCK DATA: Jika belum ada di database, kita buatkan pajangan sementara yang banyak (24 produk)
    if (!activeFlashSale || activeFlashSale.items.length === 0) {
        const nextWeek = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 Hari lagi
        
        // Ambil produk asli dari database untuk dijadikan bahan dasar
        const dbProducts = await prisma.product.findMany({ take: 24 });
        
        const dummyItems = Array.from({ length: 24 }).map((_, i) => {
            const p = dbProducts[i % dbProducts.length] || {
                id: `fallback-product-${i}`,
                name: `Produk Flash Sale Spesial ${i + 1}`,
                price: 250000 + (i * 15000),
                imageUrl: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop`
            };
            return {
                id: `dummy-fs-item-${i}`,
                flashSaleId: "dummy-flash-sale",
                productId: p.id,
                discountPrice: Math.floor(p.price * 0.4), // Diskon 60%
                stock: 100,
                sold: Math.floor(Math.random() * 90) + 5,
                product: p
            };
        });

        activeFlashSale = {
            id: "dummy-flash-sale",
            title: "Flash Deal Spesial (Semua Produk)",
            startTime: now,
            endTime: nextWeek,
            isActive: true,
            bannerUrl: null,
            createdAt: now,
            updatedAt: now,
            items: dummyItems
        } as any;
    }

    // Pastikan activeFlashSale ada (entah dari DB atau Mock)
    if (!activeFlashSale) return null;

    return (
        <div className="bg-[#F7F8FA] min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Header Promo */}
                <div className="bg-gradient-to-r from-[#E24B4A] to-[#F5A623] rounded-2xl p-8 mb-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-wider mb-2">
                            {activeFlashSale.title}
                        </h1>
                        <p className="text-red-50 text-lg">
                            Diskon gila-gilaan waktu terbatas! Segera checkout sebelum kehabisan.
                        </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-xl border border-white/30 text-center shrink-0">
                        <div className="text-sm font-bold mb-2 uppercase tracking-wider">Promo Berakhir Dalam</div>
                        <CountdownTimer targetDate={activeFlashSale.endTime} variant="box" />
                    </div>
                </div>

                {/* Grid Produk Flash Sale (Banyak Produk) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {activeFlashSale.items.map((item: any) => {
                        const product = item.product;
                        const formattedPrice = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.discountPrice);
                        const formattedOriginal = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(product.price);
                        const discountPercentage = Math.round(((product.price - item.discountPrice) / product.price) * 100);
                        const soldPercentage = Math.round((item.sold / item.stock) * 100);

                        return (
                            <div key={item.id} className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-shadow duration-300 overflow-hidden flex flex-col group border border-[#E5E7EB] relative">
                                
                                {/* Area Foto */}
                                <div className="relative aspect-square bg-[#F7F8FA] w-full overflow-hidden">
                                    <div className="absolute top-0 left-0 bg-[#E24B4A] text-white text-xs font-bold px-2 py-1.5 z-10 rounded-br-lg shadow-sm">
                                        Hemat {discountPercentage}%
                                    </div>
                                    <Link href={`/produk/${product.id}`} className="block w-full h-full">
                                        {product.imageUrl ? (
                                            <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                                            </div>
                                        )}
                                    </Link>
                                </div>

                                {/* Area Info */}
                                <div className="p-4 flex flex-col flex-1">
                                    <Link href={`/produk/${product.id}`} className="flex-1">
                                        <h3 className="text-[#1F2937] font-medium text-sm line-clamp-2 leading-snug mb-2 group-hover:text-[#1A3C6E] transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex flex-col mb-3">
                                            <span className="text-[#E24B4A] font-extrabold text-lg leading-none mb-1">{formattedPrice}</span>
                                            <span className="text-[#9CA3AF] text-xs line-through">{formattedOriginal}</span>
                                        </div>
                                    </Link>

                                    {/* Progress Bar Stok */}
                                    <div className="mt-auto mb-4">
                                        <div className="flex justify-between text-[10px] font-bold text-[#E24B4A] uppercase mb-1">
                                            <span>Terjual {item.sold}</span>
                                            <span>Sisa {item.stock - item.sold}</span>
                                        </div>
                                        <div className="w-full bg-[#FEF2F2] rounded-full h-2 overflow-hidden relative border border-[#FEE2E2]">
                                            <div className="bg-gradient-to-r from-[#E24B4A] to-[#F5A623] h-full rounded-full" style={{ width: `${Math.min(soldPercentage, 100)}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Tombol Add To Cart (Tampil saat hover di Desktop, selalu tampil di Mobile) */}
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

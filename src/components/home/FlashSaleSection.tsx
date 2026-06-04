import Link from "next/link";
import Image from "next/image";
import CountdownTimer from "@/components/ui/CountdownTimer";
import type { FlashSale, FlashSaleItem, Product } from "@/types";

interface FlashSaleWithItems extends FlashSale {
    items: (FlashSaleItem & { product: Product })[];
}

interface FlashSaleSectionProps {
    flashSale: FlashSaleWithItems | null;
}

export default function FlashSaleSection({ flashSale }: FlashSaleSectionProps) {
    if (!flashSale || flashSale.items.length === 0) return null;

    return (
        <section className="bg-[#F7F8FA] pt-8 pb-4">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Header Flash Sale */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#E24B4A" stroke="#E24B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                            <h2 className="text-2xl font-black text-[#1F2937] italic uppercase tracking-wider">{flashSale.title}</h2>
                        </div>
                        <div className="hidden sm:block w-px h-8 bg-[#E5E7EB]"></div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-[#6B7280]">Berakhir dalam</span>
                            <CountdownTimer targetDate={flashSale.endTime} variant="box" />
                        </div>
                    </div>
                    <Link href="/promo" className="text-sm font-bold text-[#1A3C6E] hover:underline flex items-center gap-1">
                        Lihat Semua <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </Link>
                </div>

                {/* Grid Produk Flash Sale */}
                <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x">
                    {flashSale.items.map((item) => {
                        const product = item.product;
                        const formattedPrice = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.discountPrice);
                        const formattedOriginal = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(product.price);
                        const discountPercentage = Math.round(((product.price - item.discountPrice) / product.price) * 100);
                        const soldPercentage = Math.round((item.sold / item.stock) * 100);

                        return (
                            <div key={item.id} className="min-w-[160px] max-w-[160px] sm:min-w-[180px] sm:max-w-[180px] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group border border-[#E5E7EB] snap-start">
                                {/* Area Foto */}
                                <div className="relative aspect-square bg-[#F7F8FA] w-full overflow-hidden">
                                    <div className="absolute top-0 left-0 bg-[#E24B4A] text-white text-[10px] font-bold px-2 py-1 z-10 rounded-br-lg">
                                        -{discountPercentage}%
                                    </div>
                                    <Link href={`/produk/${product.id}`} className="block w-full h-full">
                                        {product.imageUrl ? (
                                            <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                                            </div>
                                        )}
                                    </Link>
                                </div>

                                {/* Area Info */}
                                <div className="p-3 flex flex-col flex-1">
                                    <Link href={`/produk/${product.id}`} className="flex-1">
                                        <h3 className="text-[#1F2937] font-medium text-[13px] line-clamp-2 leading-snug mb-1 group-hover:text-[#1A3C6E] transition-colors h-10">
                                            {product.name}
                                        </h3>
                                        <div className="flex flex-col mb-2">
                                            <span className="text-[#E24B4A] font-bold text-base leading-none">{formattedPrice}</span>
                                            <span className="text-[#9CA3AF] text-[10px] line-through mt-0.5">{formattedOriginal}</span>
                                        </div>
                                    </Link>

                                    {/* Progress Bar Stok */}
                                    <div className="mt-auto">
                                        <div className="w-full bg-[#FEF2F2] rounded-full h-1.5 mb-1 overflow-hidden relative">
                                            <div className="bg-[#E24B4A] h-1.5 rounded-full" style={{ width: `${Math.min(soldPercentage, 100)}%` }}></div>
                                        </div>
                                        <div className="text-[9px] font-semibold text-[#E24B4A] text-center uppercase">
                                            {soldPercentage >= 100 ? "Habis Terjual" : `Tersisa ${item.stock - item.sold}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}

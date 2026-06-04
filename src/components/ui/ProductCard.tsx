import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

interface ProductCardProps {
    product: Product & { 
        // Ekstra field mockup untuk UI
        originalPrice?: number;
        discount?: number;
        rating?: number;
        reviewsCount?: number;
        soldCount?: number;
        location?: string;
        isLocal?: boolean;
        isNew?: boolean;
        isBestSeller?: boolean;
        supplier?: { companyName: string } | null;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    // Harga format Rupiah
    const formattedPrice = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(product.price);
    const formattedOriginal = product.originalPrice ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(product.originalPrice) : null;

    // Menentukan Badge (Hanya satu yang tampil, prioritas: Diskon > Baru > Terlaris)
    let Badge = null;
    if (product.discount) {
        Badge = <div className="absolute top-0 left-0 bg-[#E24B4A] text-white text-[10px] font-bold px-2 py-1 z-10 rounded-br-lg">DISKON -{product.discount}%</div>;
    } else if (product.isNew) {
        Badge = <div className="absolute top-0 left-0 bg-[#1A3C6E] text-white text-[10px] font-bold px-2 py-1 z-10 rounded-br-lg">BARU</div>;
    } else if (product.isBestSeller) {
        Badge = <div className="absolute top-0 left-0 bg-[#1A3C6E] text-white text-[10px] font-bold px-2 py-1 z-10 rounded-br-lg">TERLARIS</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col group border border-[#E5E7EB]">
            
            {/* Area Foto (Rasio 1:1) */}
            <div className="relative aspect-square bg-[#F7F8FA] w-full overflow-hidden">
                {Badge}
                
                {/* Tombol Wishlist */}
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm z-10 text-[#9CA3AF] hover:text-[#E24B4A] md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>

                <Link href={`/produk/${product.id}`} className="block w-full h-full">
                    {product.imageUrl ? (
                        <Image 
                            src={product.imageUrl} 
                            alt={product.name} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                        </div>
                    )}
                </Link>
                
                {/* Dot Indikator (Mock) */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A3C6E]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
                </div>
            </div>

            {/* Area Informasi */}
            <div className="p-2 md:p-3 flex flex-col flex-1">
                
                <Link href={`/produk/${product.id}`} className="flex-1">
                    {/* Nama Produk */}
                    <h3 className="text-[#1F2937] font-medium text-[12px] md:text-[13px] line-clamp-2 leading-snug mb-1 group-hover:text-[#1A3C6E] transition-colors h-9 md:h-10">
                        {product.name}
                    </h3>
                    
                    {/* Harga */}
                    <div className="flex flex-col mb-1.5">
                        <span className="text-[#1A3C6E] font-bold text-base">{formattedPrice}</span>
                        {formattedOriginal && (
                            <span className="text-[#9CA3AF] text-[11px] line-through">{formattedOriginal}</span>
                        )}
                        {!formattedOriginal && <span className="h-4"></span> /* spacer */}
                    </div>

                    {/* Nama Toko */}
                    <div className="flex items-center gap-1 text-[11px] text-[#6B7280] mb-2 truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                        <span className="truncate">{product.supplier?.companyName || "Belio Official"}</span>
                    </div>

                    {/* Baris Bawah: Rating & Lokasi */}
                    <div className="flex flex-col gap-1 text-[10px] text-[#6B7280] mt-auto">
                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            <span className="font-semibold text-[#1F2937]">{product.rating || "4.8"}</span>
                            <span>({product.reviewsCount || "120"})</span>
                            <span className="mx-1">•</span>
                            <span>{product.soldCount || "400+"} terjual</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span className="truncate">{product.location || "Jakarta Selatan"}</span>
                            {product.isLocal && (
                                <span className="ml-1 bg-[#E8F8F5] text-[#2ECC8B] text-[9px] font-bold px-1.5 py-0.5 rounded">LOKAL</span>
                            )}
                        </div>
                    </div>
                </Link>
            </div>

            {/* Tombol Aksi Bawah Kartu */}
            <button className="w-full bg-[#EAF3FB] text-[#1A3C6E] font-semibold text-[13px] md:text-sm py-1.5 md:py-2 group-hover:bg-[#1A3C6E] group-hover:text-white transition-colors duration-200">
                + Keranjang
            </button>

        </div>
    );
}

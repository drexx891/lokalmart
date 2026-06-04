"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ui/ProductCard";

interface ProductGridProps {
    products: Product[];
    initialItems?: number;
    showSeeAllButton?: boolean;
}

export default function ProductGrid({ products, initialItems = 8, showSeeAllButton = true }: ProductGridProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Jika belum di-expand, tampilkan sesuai initialItems (misal 8 item = 2 baris). 
    // Jika sudah, tampilkan semua produk yang dilempar dari parent (misal 24).
    const visibleProducts = isExpanded ? products : products.slice(0, initialItems);

    return (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                ))}
            </div>
            
            {showSeeAllButton && (
                <div className="mt-10 text-center">
                    {!isExpanded && products.length > initialItems ? (
                        <button 
                            onClick={() => setIsExpanded(true)}
                            className="inline-block border border-[#1A3C6E] text-[#1A3C6E] font-bold px-8 py-2.5 rounded-full hover:bg-[#F7F8FA] transition-colors"
                        >
                            Tampilkan Lebih Banyak
                        </button>
                    ) : (
                        <Link href="/semua-produk" className="inline-block border border-[#1A3C6E] text-[#1A3C6E] font-bold px-8 py-2.5 rounded-full hover:bg-[#F7F8FA] transition-colors">
                            Lihat Semua Produk
                        </Link>
                    )}
                </div>
            )}
        </>
    );
}

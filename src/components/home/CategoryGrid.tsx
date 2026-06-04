"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";

interface CategoryGridProps {
    categories: (Category & { icon?: string | null; slug?: string | null; imageUrl?: string | null })[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Jika belum di-expand, tampilkan 9 kategori saja. Jika sudah, tampilkan semua (19).
    const visibleCategories = isExpanded ? categories : categories.slice(0, 9);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#1F2937]">Kategori Populer</h2>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2 md:gap-3">
                {visibleCategories.map((category) => (
                    <Link 
                        key={category.id} 
                        href={`/kategori/${category.id}`} 
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-white hover:bg-[#F0F4FF] transition-all duration-200 border border-[#E5E7EB] hover:border-[#BFDBFE] text-center shadow-sm group hover:shadow-md hover:-translate-y-0.5"
                    >
                        <div className="w-11 h-11 md:w-14 md:h-14 relative overflow-hidden rounded-full mb-2 shadow-sm border border-[#E5E7EB] group-hover:shadow-md transition-all flex items-center justify-center bg-[#EBF2FA]">
                            {category.imageUrl ? (
                                <Image 
                                    src={category.imageUrl} 
                                    alt={category.name} 
                                    fill 
                                    sizes="64px"
                                    className="object-cover group-hover:scale-110 transition-transform duration-300" 
                                />
                            ) : category.icon ? (
                                <Image 
                                    src={category.icon} 
                                    alt={category.name} 
                                    fill 
                                    sizes="64px"
                                    className="object-cover group-hover:scale-110 transition-transform duration-300" 
                                />
                            ) : (
                                <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-200">📦</span>
                            )}
                        </div>
                        <span className="text-[10px] md:text-[11px] font-medium text-[#374151] leading-tight line-clamp-2 px-1">{category.name}</span>
                    </Link>
                ))}

                {/* Tombol Lihat Semua (Expander atau Link) */}
                {!isExpanded ? (
                    <button 
                        onClick={() => setIsExpanded(true)}
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-br from-[#1A3C6E] to-[#2A5FA0] hover:from-[#2A5FA0] hover:to-[#1A3C6E] transition-all duration-300 text-center shadow-sm group hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        <span className="text-[10px] md:text-[11px] font-bold text-white leading-tight">Lebih Banyak</span>
                    </button>
                ) : (
                    <Link 
                        href="/kategori" 
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-br from-[#1A3C6E] to-[#2A5FA0] hover:from-[#2A5FA0] hover:to-[#1A3C6E] transition-all duration-300 text-center shadow-sm group hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </div>
                        <span className="text-[10px] md:text-[11px] font-bold text-white leading-tight">Semua Kategori</span>
                    </Link>
                )}
            </div>
        </div>
    );
}

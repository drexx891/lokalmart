"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Definisikan interface lokal untuk menghindari error cache TS dari PrismaClient
interface Campaign {
    id: string;
    title: string;
    subtitle: string | null;
    position: string;
    imageUrl: string | null;
    colorFrom: string | null;
    colorTo: string | null;
    textColor: string | null;
    pageTitle: string | null;
    pageContent: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface HeroSliderProps {
    mainCampaigns: Campaign[];
    rightTop?: Campaign;
    rightBottom?: Campaign;
}

export default function HeroSlider({ mainCampaigns, rightTop, rightBottom }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide effect
    useEffect(() => {
        if (!mainCampaigns || mainCampaigns.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % mainCampaigns.length);
        }, 5000); // 5 seconds per slide
        
        return () => clearInterval(interval);
    }, [mainCampaigns]);

    const currentSlide = mainCampaigns && mainCampaigns.length > 0 
        ? mainCampaigns[currentIndex] 
        : {
            id: 'default',
            title: 'Pusat Grosir',
            subtitle: 'LokalMart B2B',
            colorFrom: '#1A3C6E',
            colorTo: '#2A5FA0'
        } as Campaign;

    return (
        <div className="flex flex-col lg:flex-row gap-2 md:gap-3 h-auto lg:h-[320px]">
            
            {/* Main Banner Kiri (70%) - True Slider */}
            <div className="flex-[7] rounded-xl overflow-hidden relative shadow-sm group bg-gray-100">
                {/* Slider Track */}
                <div 
                    className="flex h-full w-full transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {mainCampaigns.map((slide, idx) => (
                        <Link 
                            key={slide.id}
                            href={`/campaign/${slide.id}`} 
                            className="w-full h-full flex-shrink-0 flex flex-col justify-between relative"
                            style={{ 
                                background: `linear-gradient(to right, ${slide.colorFrom || '#1A3C6E'}, ${slide.colorTo || '#2A5FA0'})` 
                            }}
                        >
                            {/* Motif Background */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                <div className="absolute right-0 top-0 w-64 h-64 bg-white/20 rounded-full blur-3xl transform -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-700"></div>
                                <svg className="absolute left-0 bottom-0 text-white/10" width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18,97.1,-2.3C97.4,13.4,92,29.3,82.4,42.5C72.8,55.7,59,66.2,44.1,73.5C29.2,80.8,13.2,84.9,-2.4,89C-18.1,93.1,-36.2,87.2,-51.5,78.2C-66.8,69.2,-79.3,57.1,-87.3,42.4C-95.3,27.7,-98.8,10.4,-96.2,-5.8C-93.6,-22,-84.9,-37.1,-73.4,-49.2C-61.9,-61.3,-47.6,-70.4,-33.1,-77.3C-18.6,-84.2,-3.9,-88.9,10.8,-87.5C25.5,-86.1,40.2,-78.6,44.7,-76.4Z" transform="translate(100 100) scale(1.1)" />
                                </svg>
                            </div>
                            
                            <div className="relative z-10 p-5 md:p-8 flex-1 flex flex-col justify-center">
                                <h1 className="text-3xl md:text-4xl font-black text-white mb-1">
                                    {slide.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5A623] to-[#FFD175]">Belio</span>
                                </h1>
                                <p className="text-white/90 text-sm md:text-base font-medium mb-6">
                                    {slide.subtitle}
                                </p>
                                
                                {/* Grid 6 Kotak (Partner/Brand) */}
                                <div className="grid grid-cols-3 gap-2 w-fit mb-4">
                                    {["Indofood", "Mayora", "Unilever", "Wings", "Garudafood", "Sosro"].map((brand, i) => (
                                        <div key={i} className="bg-white rounded py-2 px-4 flex items-center justify-center text-xs md:text-sm font-bold text-[#1F2937] shadow-sm whitespace-nowrap min-w-[80px] hover:bg-gray-50">
                                            {brand}
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="text-white/90 text-[11px] md:text-xs font-bold tracking-wider flex items-center gap-1">
                                    <span className="text-[#F5A623] text-lg leading-none">+</span> RIBUAN BRAND LOKAL TERPERCAYA
                                </div>
                            </div>

                            {/* Bottom Bar (Trust Badges) */}
                            <div className="relative z-10 w-full bg-black/15 backdrop-blur-sm py-2 px-4 flex justify-between items-center text-white/90 border-t border-white/10">
                                <div className="flex items-center gap-2 flex-1 justify-center border-r border-white/20">
                                    <span className="text-xl">🏭</span>
                                    <div className="leading-tight">
                                        <div className="text-[10px] md:text-xs font-bold text-white">Harga Pabrik</div>
                                        <div className="text-[9px] md:text-[10px]">Tangan Pertama</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-1 justify-center border-r border-white/20">
                                    <span className="text-xl">🛡️</span>
                                    <div className="leading-tight">
                                        <div className="text-[10px] md:text-xs font-bold text-white">100% Aman</div>
                                        <div className="text-[9px] md:text-[10px]">Supplier Terverifikasi</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-1 justify-center">
                                    <span className="text-xl">📦</span>
                                    <div className="leading-tight">
                                        <div className="text-[10px] md:text-xs font-bold text-white">Grosir Besar</div>
                                        <div className="text-[9px] md:text-[10px]">Kapasitas Tonase</div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Slider Indicators */}
                {mainCampaigns && mainCampaigns.length > 1 && (
                    <div className="absolute bottom-16 md:bottom-20 right-6 flex gap-1.5 z-20">
                        {mainCampaigns.map((_, idx) => (
                            <button 
                                key={idx}
                                onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Banner Kanan (30%) - Stacked */}
            <div className="flex-[3] flex flex-row lg:flex-col gap-2 md:gap-3 shrink-0">
                
                {/* Banner Kanan Atas: Belio Premium */}
                <Link 
                    href={rightTop ? `/campaign/${rightTop.id}` : "/premium"} 
                    className="flex-1 rounded-xl overflow-hidden relative shadow-sm group p-4 md:p-5 flex flex-col justify-center transition-all duration-500"
                    style={{ 
                        background: rightTop 
                            ? `linear-gradient(to right, ${rightTop.colorFrom}, ${rightTop.colorTo})` 
                            : `linear-gradient(to right, #B91C1C, #DC2626)` 
                    }}
                >
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <h3 className="text-white text-lg md:text-xl font-medium leading-tight">
                            {rightTop?.title || 'Belio'} <span className="font-black">{rightTop?.subtitle || 'Premium'}</span>
                        </h3>
                        <div className="text-[#FFD175] text-xl md:text-3xl font-black mt-1 drop-shadow-md">
                            100% ORI
                        </div>
                    </div>
                    <div className="absolute right-2 bottom-0 w-24 h-24 md:w-32 md:h-32 opacity-70 group-hover:opacity-100 transition-opacity">
                        <svg className="w-full h-full text-white/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                </Link>

                {/* Banner Kanan Bawah: Flash Deal / Diskon */}
                <Link 
                    href={rightBottom ? `/campaign/${rightBottom.id}` : "/promo"} 
                    className="flex-1 rounded-xl overflow-hidden relative shadow-sm group p-4 md:p-5 flex flex-col justify-center transition-all duration-500"
                    style={{ 
                        background: rightBottom 
                            ? `linear-gradient(to right, ${rightBottom.colorFrom}, ${rightBottom.colorTo})` 
                            : `linear-gradient(to right, #4C1D95, #7C3AED)` 
                    }}
                >
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1 bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                                {rightBottom?.subtitle || 'PROMO BISNIS'}
                            </div>
                            <h3 className="text-white text-xs md:text-sm font-medium leading-tight opacity-90">
                                {rightBottom?.title || 'Penuhi Stok Tokomu'}
                            </h3>
                        </div>
                        <div className="mt-2 flex items-end gap-3">
                            <div>
                                <div className="text-white/80 text-[10px] font-bold uppercase tracking-wider">Diskon S.D.</div>
                                <div className="text-[#FFD175] text-xl md:text-3xl font-black leading-none drop-shadow-md">80%</div>
                            </div>
                            <div className="h-8 w-px bg-white/30 hidden md:block"></div>
                            <div className="hidden md:block">
                                <div className="text-white/80 text-[10px] font-bold uppercase tracking-wider">Voucher</div>
                                <div className="text-[#10B981] text-xl font-black leading-none bg-white px-1.5 rounded-sm inline-block">100RB</div>
                            </div>
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
}

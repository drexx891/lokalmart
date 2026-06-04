"use client";

import { useState } from "react";

export default function FilterSidebar() {
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [isRatingOpen, setIsRatingOpen] = useState(true);
    const [isLocationOpen, setIsLocationOpen] = useState(true);

    return (
        <aside className="w-full md:w-[220px] shrink-0 bg-white md:bg-transparent">
            <div className="flex items-center justify-between mb-4 md:mb-6 px-4 md:px-0 pt-4 md:pt-0">
                <h2 className="font-bold text-[#1F2937] text-lg">Filter Produk</h2>
                <button className="text-xs font-bold text-[#1A3C6E] hover:underline">Reset semua</button>
            </div>

            <div className="flex flex-col gap-1 border border-[#E5E7EB] rounded-xl bg-white overflow-hidden shadow-sm">
                
                {/* 1. Kategori */}
                <div className="border-b border-[#E5E7EB]">
                    <button 
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)} 
                        className="flex items-center justify-between w-full px-4 py-3 font-semibold text-[#1F2937] text-sm hover:bg-[#F9FAFB] transition-colors"
                    >
                        Kategori
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transform transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    {isCategoryOpen && (
                        <div className="px-4 pb-4 pt-1 flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-[#D1D5DB] text-[#1A3C6E] focus:ring-[#1A3C6E]" />
                                <span className="text-sm text-[#374151] group-hover:text-[#1A3C6E]">Sepatu Pria <span className="text-[#9CA3AF]">(312)</span></span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-[#D1D5DB] text-[#1A3C6E] focus:ring-[#1A3C6E]" />
                                <span className="text-sm text-[#374151] group-hover:text-[#1A3C6E]">Sepatu Wanita <span className="text-[#9CA3AF]">(189)</span></span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-[#D1D5DB] text-[#1A3C6E] focus:ring-[#1A3C6E]" />
                                <span className="text-sm text-[#374151] group-hover:text-[#1A3C6E]">Sandal & Slip-on <span className="text-[#9CA3AF]">(94)</span></span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-[#D1D5DB] text-[#1A3C6E] focus:ring-[#1A3C6E]" />
                                <span className="text-sm text-[#374151] group-hover:text-[#1A3C6E]">Sepatu Anak <span className="text-[#9CA3AF]">(57)</span></span>
                            </label>
                            <button className="text-left text-xs font-semibold text-[#1A3C6E] mt-1 hover:underline">Lihat semua (12+)</button>
                        </div>
                    )}
                </div>

                {/* 2. Rentang Harga */}
                <div className="border-b border-[#E5E7EB]">
                    <button 
                        onClick={() => setIsPriceOpen(!isPriceOpen)} 
                        className="flex items-center justify-between w-full px-4 py-3 font-semibold text-[#1F2937] text-sm hover:bg-[#F9FAFB] transition-colors"
                    >
                        Rentang Harga
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transform transition-transform ${isPriceOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    {isPriceOpen && (
                        <div className="px-4 pb-4 pt-1">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-[#9CA3AF] text-xs">Rp</div>
                                    <input type="text" placeholder="Min" className="w-full border border-[#D1D5DB] rounded bg-[#F9FAFB] pl-7 pr-2 py-1.5 text-xs focus:outline-none focus:border-[#1A3C6E]" />
                                </div>
                                <span className="text-[#9CA3AF]">-</span>
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-[#9CA3AF] text-xs">Rp</div>
                                    <input type="text" placeholder="Maks" className="w-full border border-[#D1D5DB] rounded bg-[#F9FAFB] pl-7 pr-2 py-1.5 text-xs focus:outline-none focus:border-[#1A3C6E]" />
                                </div>
                            </div>
                            
                            {/* Dummy Range Slider */}
                            <div className="w-full h-1 bg-[#E5E7EB] rounded-full relative mb-4 mt-2">
                                <div className="absolute left-[20%] right-[30%] h-1 bg-[#1A3C6E] rounded-full"></div>
                                <div className="absolute left-[20%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-2 border-[#1A3C6E] rounded-full shadow cursor-pointer"></div>
                                <div className="absolute right-[30%] top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 bg-white border-2 border-[#1A3C6E] rounded-full shadow cursor-pointer"></div>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                <button className="text-[10px] bg-[#F3F4F6] hover:bg-[#EBF2FA] hover:text-[#1A3C6E] text-[#4B5563] px-2 py-1 rounded-full transition-colors border border-transparent hover:border-[#BFDBFE]">&lt; Rp 50rb</button>
                                <button className="text-[10px] bg-[#F3F4F6] hover:bg-[#EBF2FA] hover:text-[#1A3C6E] text-[#4B5563] px-2 py-1 rounded-full transition-colors border border-transparent hover:border-[#BFDBFE]">Rp 50–150rb</button>
                                <button className="text-[10px] bg-[#1A3C6E] text-white px-2 py-1 rounded-full border border-[#1A3C6E]">Rp 150–500rb</button>
                                <button className="text-[10px] bg-[#F3F4F6] hover:bg-[#EBF2FA] hover:text-[#1A3C6E] text-[#4B5563] px-2 py-1 rounded-full transition-colors border border-transparent hover:border-[#BFDBFE]">&gt; Rp 500rb</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Rating Minimal */}
                <div className="border-b border-[#E5E7EB]">
                    <button 
                        onClick={() => setIsRatingOpen(!isRatingOpen)} 
                        className="flex items-center justify-between w-full px-4 py-3 font-semibold text-[#1F2937] text-sm hover:bg-[#F9FAFB] transition-colors"
                    >
                        Rating Minimal
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transform transition-transform ${isRatingOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    {isRatingOpen && (
                        <div className="px-4 pb-4 pt-1 flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="radio" name="rating" className="w-4 h-4 text-[#1A3C6E] focus:ring-[#1A3C6E] border-[#D1D5DB]" />
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                    ))}
                                </div>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="radio" name="rating" defaultChecked className="w-4 h-4 text-[#1A3C6E] focus:ring-[#1A3C6E] border-[#D1D5DB]" />
                                <div className="flex items-center gap-1">
                                    <div className="flex">
                                        {[...Array(4)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                        ))}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                    </div>
                                    <span className="text-xs font-semibold text-[#4B5563]">Ke Atas</span>
                                </div>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="radio" name="rating" className="w-4 h-4 text-[#1A3C6E] focus:ring-[#1A3C6E] border-[#D1D5DB]" />
                                <div className="flex items-center gap-1">
                                    <div className="flex">
                                        {[...Array(3)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                        ))}
                                        {[...Array(2)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                        ))}
                                    </div>
                                    <span className="text-xs font-semibold text-[#4B5563]">Ke Atas</span>
                                </div>
                            </label>
                        </div>
                    )}
                </div>

                {/* 4. Lokasi Penjual */}
                <div className="border-b border-[#E5E7EB]">
                    <button 
                        onClick={() => setIsLocationOpen(!isLocationOpen)} 
                        className="flex items-center justify-between w-full px-4 py-3 font-semibold text-[#1F2937] text-sm hover:bg-[#F9FAFB] transition-colors"
                    >
                        Lokasi
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transform transition-transform ${isLocationOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    {isLocationOpen && (
                        <div className="px-4 pb-4 pt-1 flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#D1D5DB] text-[#1A3C6E] focus:ring-[#1A3C6E]" />
                                <span className="text-sm font-semibold text-[#2ECC8B] flex items-center gap-1 group-hover:text-[#1F2937]">Bengkulu <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-[#D1D5DB] text-[#1A3C6E] focus:ring-[#1A3C6E]" />
                                <span className="text-sm text-[#374151] group-hover:text-[#1A3C6E]">Sumatera Selatan</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-[#D1D5DB] text-[#1A3C6E] focus:ring-[#1A3C6E]" />
                                <span className="text-sm text-[#374151] group-hover:text-[#1A3C6E]">DKI Jakarta</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-[#D1D5DB] text-[#1A3C6E] focus:ring-[#1A3C6E]" />
                                <span className="text-sm text-[#374151] group-hover:text-[#1A3C6E]">Jawa Barat</span>
                            </label>
                            <button className="text-left text-xs font-semibold text-[#1A3C6E] mt-1 hover:underline">Lokasi Lainnya</button>
                        </div>
                    )}
                </div>

                {/* 5. Pengiriman & Toko (Simplified) */}
                <div>
                    <div className="px-4 py-4 flex flex-col gap-3">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-[#D1D5DB] text-[#1A3C6E] focus:ring-[#1A3C6E]" />
                            <span className="text-sm text-[#374151] group-hover:text-[#1A3C6E]">Bebas Ongkir</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-[#D1D5DB] text-[#1A3C6E] focus:ring-[#1A3C6E]" />
                            <span className="text-sm text-[#374151] group-hover:text-[#1A3C6E]">Bisa COD</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group mt-2 pt-2 border-t border-[#F3F4F6]">
                            <input type="checkbox" className="w-4 h-4 rounded border-[#D1D5DB] text-[#1A3C6E] focus:ring-[#1A3C6E]" />
                            <span className="text-sm text-[#374151] group-hover:text-[#1A3C6E] font-semibold flex items-center gap-1">Toko Terverifikasi <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#1A3C6E" stroke="#1A3C6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01" stroke="white"></polyline></svg></span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Tombol Terapkan (Sticky di mobile, statis di desktop) */}
            <div className="mt-4 md:sticky md:bottom-4">
                <button className="w-full bg-[#1A3C6E] text-white font-bold py-3 rounded-xl hover:bg-[#2A5FA0] transition-colors shadow-md shadow-[#1A3C6E]/20">
                    Terapkan Filter
                </button>
            </div>
        </aside>
    );
}

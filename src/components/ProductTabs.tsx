"use client";

import { useState } from "react";

export default function ProductTabs({
    description,
    reviewsCount
}: {
    description: string | null;
    reviewsCount: number;
}) {
    const [activeTab, setActiveTab] = useState<"desc" | "spec" | "reviews">("desc");

    return (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm mb-10">
            {/* Tabs Header */}
            <div className="flex border-b border-[#E5E7EB] overflow-x-auto hide-scrollbar px-6">
                <button 
                    onClick={() => setActiveTab("desc")}
                    className={`px-6 py-4 font-bold whitespace-nowrap transition-colors ${activeTab === 'desc' ? 'text-[#1A3C6E] border-b-2 border-[#1A3C6E]' : 'text-[#6B7280] hover:text-[#1F2937]'}`}
                >
                    Deskripsi Produk
                </button>
                <button 
                    onClick={() => setActiveTab("spec")}
                    className={`px-6 py-4 font-bold whitespace-nowrap transition-colors ${activeTab === 'spec' ? 'text-[#1A3C6E] border-b-2 border-[#1A3C6E]' : 'text-[#6B7280] hover:text-[#1F2937]'}`}
                >
                    Spesifikasi
                </button>
                <button 
                    onClick={() => setActiveTab("reviews")}
                    className={`px-6 py-4 font-bold whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'reviews' ? 'text-[#1A3C6E] border-b-2 border-[#1A3C6E]' : 'text-[#6B7280] hover:text-[#1F2937]'}`}
                >
                    Ulasan Pembeli <span className="bg-[#F3F4F6] text-[#4B5563] px-1.5 py-0.5 rounded text-[10px]">{reviewsCount}</span>
                </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-6 md:p-8">
                {activeTab === "desc" && (
                    <>
                        <div className="prose prose-sm md:prose-base max-w-none text-[#4B5563]">
                            {description ? (
                                <p className="whitespace-pre-wrap">{description}</p>
                            ) : (
                                <p>Produk ini belum memiliki deskripsi dari penjual.</p>
                            )}
                            <br/>
                            <p className="font-semibold text-[#1F2937]">Syarat & Ketentuan Pengembalian (Retur):</p>
                            <ul className="list-disc pl-5">
                                <li>Komplain harus menyertakan video unboxing (tanpa jeda).</li>
                                <li>Produk masih dalam keadaan baru, belum dipakai, label masih terpasang.</li>
                                <li>Batas maksimal komplain adalah 2x24 jam sejak pesanan diterima.</li>
                            </ul>
                        </div>
                        <button className="mt-4 text-[#1A3C6E] font-bold text-sm hover:underline">Baca Selengkapnya</button>
                    </>
                )}

                {activeTab === "spec" && (
                    <div className="text-[#4B5563]">
                        <p>Spesifikasi produk belum tersedia.</p>
                    </div>
                )}

                {activeTab === "reviews" && (
                    <div className="text-[#4B5563]">
                        <p>Belum ada ulasan untuk produk ini.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

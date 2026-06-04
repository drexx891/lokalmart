"use client";

import Link from "next/link";
import { useState } from "react";

export default function NotifikasiPage() {
    const tabs = ["Semua", "Transaksi", "Promo", "Sistem"];
    const [activeTab, setActiveTab] = useState("Semua");

    const notifications = [
        {
            id: 1,
            type: "Transaksi",
            title: "Pesanan #BL-20459 Sedang Dikirim",
            desc: "Paket kamu sedang dibawa oleh kurir menuju alamat pengiriman. Pantau terus statusnya ya!",
            time: "2 jam lalu",
            isRead: false,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2A5FA0" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>,
            bg: "bg-[#EBF2FA]"
        },
        {
            id: 2,
            type: "Promo",
            title: "Promo Kilat! Diskon 50% Menunggumu ⚡",
            desc: "Spesial hari ini, dapatkan diskon 50% untuk produk kecantikan favoritmu. Cek sekarang sebelum kehabisan!",
            time: "Kemarin",
            isRead: false,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
            bg: "bg-[#FEF6E8]"
        },
        {
            id: 3,
            type: "Transaksi",
            title: "Pembayaran Berhasil Diterima",
            desc: "Pembayaran untuk pesanan #BL-20459 telah kami terima. Penjual akan segera memproses pesananmu.",
            time: "Kemarin",
            isRead: true,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2ECC8B" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
            bg: "bg-[#E8F8F5]"
        },
        {
            id: 4,
            type: "Sistem",
            title: "Selamat datang di Belio!",
            desc: "Terima kasih sudah bergabung dengan Belio. Yuk lengkapi profilmu dan nikmati belanja yang lebih cerdas dan percaya.",
            time: "3 hari lalu",
            isRead: true,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>,
            bg: "bg-[#F3F4F6]"
        }
    ];

    const filteredNotifs = activeTab === "Semua" ? notifications : notifications.filter(n => n.type === activeTab);

    return (
        <div className="flex flex-col gap-6">
            
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/profil" className="md:hidden p-2 bg-white rounded-full shadow-sm text-[#1F2937] hover:bg-[#F3F4F6]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </Link>
                    <h1 className="text-2xl font-bold text-[#1F2937]">Notifikasi</h1>
                </div>
                <button className="text-sm font-bold text-[#1A3C6E] hover:underline">Tandai Semua Sudah Dibaca</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col">
                
                {/* Tabs */}
                <div className="flex overflow-x-auto hide-scrollbar border-b border-[#E5E7EB]">
                    {tabs.map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'border-[#1A3C6E] text-[#1A3C6E]' : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* List Notifikasi */}
                <div className="flex flex-col">
                    {filteredNotifs.length > 0 ? (
                        filteredNotifs.map((notif) => (
                            <div key={notif.id} className={`p-4 md:p-5 flex items-start gap-4 border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors cursor-pointer ${notif.isRead ? 'bg-white' : 'bg-[#EAF3FB]'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${notif.bg}`}>
                                    {notif.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className={`text-sm ${notif.isRead ? 'font-semibold text-[#374151]' : 'font-bold text-[#1F2937] flex items-center gap-2'}`}>
                                            {!notif.isRead && <span className="w-2 h-2 rounded-full bg-[#1A3C6E]"></span>}
                                            {notif.title}
                                        </h3>
                                        <span className="text-[10px] text-[#9CA3AF] whitespace-nowrap shrink-0">{notif.time}</span>
                                    </div>
                                    <p className="text-sm text-[#6B7280] line-clamp-2 leading-relaxed">{notif.desc}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-4 text-[#9CA3AF]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                            </div>
                            <h3 className="font-bold text-[#1F2937] text-lg mb-1">Tidak ada notifikasi</h3>
                            <p className="text-sm text-[#6B7280]">Kamu sudah membaca semua notifikasi terbaru.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import { useState } from "react";

export default function KeamananAkunPage() {
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    return (
        <div className="flex flex-col gap-6">
            
            <div className="flex items-center gap-3">
                <Link href="/profil" className="md:hidden p-2 bg-white rounded-full shadow-sm text-[#1F2937] hover:bg-[#F3F4F6]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </Link>
                <h1 className="text-2xl font-bold text-[#1F2937]">Keamanan Akun</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Kolom Kiri */}
                <div className="flex flex-col gap-6">
                    {/* Ubah Password */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="p-4 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A3C6E" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            <h2 className="font-bold text-[#1F2937]">Password</h2>
                        </div>
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-[#374151]">Ganti Password</p>
                                <p className="text-[11px] text-[#6B7280]">Terakhir diubah 3 bulan lalu</p>
                            </div>
                            <button className="text-sm font-bold text-[#1A3C6E] border border-[#1A3C6E] px-4 py-1.5 rounded-lg hover:bg-[#EBF2FA] transition-colors">Ubah</button>
                        </div>
                    </div>

                    {/* PIN Transaksi */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="p-4 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A3C6E" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            <h2 className="font-bold text-[#1F2937]">PIN Transaksi</h2>
                        </div>
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-[#374151]">Aktifkan PIN Belio</p>
                                <p className="text-[11px] text-[#6B7280]">Amankan setiap transaksi dengan 6 digit PIN</p>
                            </div>
                            <button className="text-sm font-bold text-white bg-[#1A3C6E] px-4 py-1.5 rounded-lg hover:bg-[#2A5FA0] transition-colors">Aktifkan</button>
                        </div>
                    </div>

                    {/* 2FA */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="p-4 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A3C6E" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            <h2 className="font-bold text-[#1F2937]">Autentikasi 2 Faktor (2FA)</h2>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-[#374151]">Verifikasi 2 Langkah</p>
                                {/* Toggle Button */}
                                <button 
                                    onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                                    className={`w-11 h-6 rounded-full flex items-center transition-colors px-1 ${is2FAEnabled ? 'bg-[#2ECC8B] justify-end' : 'bg-[#D1D5DB] justify-start'}`}
                                >
                                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </button>
                            </div>
                            <p className="text-[11px] text-[#6B7280] leading-relaxed">Saat diaktifkan, kamu membutuhkan kode OTP melalui SMS selain password untuk login dari perangkat baru.</p>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan */}
                <div className="flex flex-col gap-6">
                    {/* Perangkat Aktif */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="p-4 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A3C6E" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                            <h2 className="font-bold text-[#1F2937]">Perangkat Login Aktif</h2>
                        </div>
                        <div className="flex flex-col">
                            {/* Device 1 */}
                            <div className="p-5 flex items-start justify-between border-b border-[#E5E7EB]">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg></div>
                                    <div>
                                        <p className="text-sm font-bold text-[#1F2937]">Windows PC - Chrome</p>
                                        <p className="text-[11px] text-[#6B7280] flex items-center gap-1 mt-0.5"><span className="w-2 h-2 rounded-full bg-[#2ECC8B]"></span> Sedang aktif (Bengkulu)</p>
                                    </div>
                                </div>
                            </div>
                            {/* Device 2 */}
                            <div className="p-5 flex items-start justify-between hover:bg-[#F9FAFB] transition-colors group">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg></div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#374151]">iPhone 13 - Safari</p>
                                        <p className="text-[11px] text-[#9CA3AF] mt-0.5">Kemarin 14:30 (Jakarta)</p>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-[#E24B4A] opacity-0 group-hover:opacity-100 transition-opacity">Keluarkan</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

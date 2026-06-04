"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditProfilPage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            router.push("/profil");
        }, 1000);
    };

    return (
        <div className="flex flex-col gap-6 max-w-3xl">
            
            <div className="flex items-center gap-3">
                <Link href="/profil" className="p-2 bg-white rounded-full shadow-sm text-[#1F2937] hover:bg-[#F3F4F6]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </Link>
                <h1 className="text-2xl font-bold text-[#1F2937]">Edit Profil</h1>
            </div>

            <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                
                {/* Foto Profil Area */}
                <div className="p-8 border-b border-[#E5E7EB] flex flex-col items-center justify-center bg-[#F9FAFB]">
                    <div className="relative group">
                        <div className="w-24 h-24 bg-[#F5A623] rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-md border-4 border-white mb-4 overflow-hidden">
                            B
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                        </div>
                    </div>
                    <button type="button" className="text-sm font-bold text-[#1A3C6E] border border-[#1A3C6E] px-4 py-1.5 rounded-full hover:bg-[#EBF2FA] transition-colors">
                        Pilih Foto
                    </button>
                    <p className="text-[10px] text-[#9CA3AF] mt-2">Ukuran maksimal 2MB. Format JPG, JPEG, atau PNG.</p>
                </div>

                <div className="p-6 md:p-8 flex flex-col gap-5">
                    
                    <div>
                        <label className="text-sm font-semibold text-[#374151] block mb-1">Nama Lengkap</label>
                        <input type="text" defaultValue="Budi Santoso" className="w-full border border-[#D1D5DB] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1A3C6E]/20 focus:border-[#1A3C6E] transition-all" />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-semibold text-[#374151] block mb-1">Tanggal Lahir</label>
                            <input type="date" className="w-full border border-[#D1D5DB] rounded-lg px-4 py-2.5 text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#1A3C6E]/20 focus:border-[#1A3C6E] transition-all" />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-semibold text-[#374151] block mb-1">Jenis Kelamin</label>
                            <div className="flex items-center gap-4 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="gender" defaultChecked className="w-4 h-4 text-[#1A3C6E] focus:ring-[#1A3C6E] border-[#D1D5DB]" />
                                    <span className="text-sm text-[#4B5563]">Pria</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="gender" className="w-4 h-4 text-[#1A3C6E] focus:ring-[#1A3C6E] border-[#D1D5DB]" />
                                    <span className="text-sm text-[#4B5563]">Wanita</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-[#E5E7EB] w-full my-2"></div>

                    <div>
                        <div className="flex justify-between items-end mb-1">
                            <label className="text-sm font-semibold text-[#374151] block">Nomor HP</label>
                            <Link href="#" className="text-[10px] font-bold text-[#1A3C6E] hover:underline">Ubah via CS</Link>
                        </div>
                        <input type="text" value="+62 812-xxxx-7890" disabled className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-lg px-4 py-2.5 text-[#9CA3AF] cursor-not-allowed" />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-[#374151] block mb-1">Email</label>
                        <input type="email" defaultValue="budi.santoso@email.com" className="w-full border border-[#D1D5DB] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1A3C6E]/20 focus:border-[#1A3C6E] transition-all" />
                    </div>

                </div>

                <div className="p-6 md:p-8 bg-[#F9FAFB] border-t border-[#E5E7EB] flex justify-end">
                    <button type="submit" disabled={isSaving} className="w-full md:w-auto bg-[#1A3C6E] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#2A5FA0] transition-colors shadow-sm disabled:opacity-70">
                        {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>

        </div>
    );
}

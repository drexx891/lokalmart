"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { useRouter } from "next/navigation";
import { registerAction } from "@/app/actions/auth";
import { supabasePublic } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Data Diri, 2: OTP, 3: Selesai
    
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Kalkulasi Kekuatan Password
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    
    let strengthText = "Lemah";
    let strengthColor = "bg-[#E24B4A]";
    if (strength === 2) { strengthText = "Sedang"; strengthColor = "bg-[#F5A623]"; }
    if (strength === 3) { strengthText = "Kuat"; strengthColor = "bg-[#2ECC8B]"; }
    if (password.length === 0) { strengthText = ""; strengthColor = "bg-[#E5E7EB]"; }

    const handleNextStep1 = () => {
        if (!name || !phone || !email || !password) {
            toast.error("Mohon lengkapi semua data");
            return;
        }
        if (password.length < 8) {
            toast.error("Password minimal 8 karakter");
            return;
        }
        setStep(2);
    };

    const handleVerifyOTP = async () => {
        setIsLoading(true);
        const loadingId = toast.loading("Memproses pendaftaran...");
        
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("phone", phone);

            const res = await registerAction(formData);
            
            if (res.success) {
                toast.success(res.message, { id: loadingId });
                setStep(3); // Berhasil, lanjut ke halaman sukses
            } else {
                toast.error(res.message, { id: loadingId });
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem", { id: loadingId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuth = async (provider: "google" | "facebook") => {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
            toast.error("Fitur pendaftaran dengan " + provider + " sedang dalam perbaikan (kredensial OAuth belum diatur). Silakan daftar dengan email dan password.");
            return;
        }

        try {
            const { error } = await supabasePublic.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            toast.error(`Gagal login dengan ${provider}: ` + error.message);
        }
    };

    return (
        <div className="bg-[#F7F8FA] min-h-screen flex flex-col p-4 md:items-center justify-center">
            
            {/* Header Mobile Only */}
            <div className="md:hidden flex items-center justify-between mb-6">
                <Link href="/login" className="p-2 bg-white rounded-full shadow-sm text-[#1F2937]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </Link>
                <Logo size="sm" />
                <div className="w-9"></div>
            </div>

            <div className="bg-white w-full max-w-xl rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col flex-1 md:flex-none">
                
                {/* Stepper Header */}
                <div className="bg-[#1A3C6E] text-white p-6 relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 40 40"><path d="M20 2.5L35.1554 11.25V28.75L20 37.5L4.84455 28.75V11.25L20 2.5Z" fill="white"/></svg>
                    </div>
                    
                    <div className="hidden md:flex justify-center mb-6 relative z-10"><Logo size="lg" theme="dark" /></div>
                    <h1 className="text-xl md:text-2xl font-bold text-center mb-6 relative z-10">Daftar Akun Baru</h1>

                    {/* Progress Bar */}
                    <div className="flex items-center justify-between max-w-xs mx-auto relative z-10">
                        <div className="absolute top-3.5 left-0 right-0 h-1 bg-white/20 rounded-full z-0"></div>
                        <div className="absolute top-3.5 left-0 h-1 bg-[#F5A623] rounded-full z-0 transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
                        
                        <div className="flex flex-col items-center gap-2 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-[#F5A623] text-[#1A3C6E]' : 'bg-white/20 text-white/50'}`}>1</div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= 1 ? 'text-[#F5A623]' : 'text-white/50'}`}>Data Diri</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-[#F5A623] text-[#1A3C6E]' : 'bg-white/20 text-white/50'}`}>2</div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= 2 ? 'text-[#F5A623]' : 'text-white/50'}`}>Verifikasi</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 3 ? 'bg-[#F5A623] text-[#1A3C6E]' : 'bg-white/20 text-white/50'}`}>3</div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= 3 ? 'text-[#F5A623]' : 'text-white/50'}`}>Selesai</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col">
                    
                    {/* Step 1: Data Diri */}
                    {step === 1 && (
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="text-sm font-semibold text-[#374151] block mb-1">Nama Lengkap</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sesuai KTP/Identitas" className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A3C6E]/20 focus:border-[#1A3C6E] transition-all" required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-[#374151] block mb-1">Nomor HP Aktif</label>
                                <div className="relative flex">
                                    <div className="bg-[#F3F4F6] border border-[#D1D5DB] border-r-0 rounded-l-lg px-3 flex items-center justify-center text-[#4B5563] font-semibold text-sm">
                                        +62
                                    </div>
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="812-xxxx-xxxx" className="w-full border border-[#D1D5DB] rounded-r-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A3C6E]/20 focus:border-[#1A3C6E] transition-all" required />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-[#374151] block mb-1">Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="budi@email.com" className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A3C6E]/20 focus:border-[#1A3C6E] transition-all" required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-[#374151] block mb-1">Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 8 karakter" className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A3C6E]/20 focus:border-[#1A3C6E] transition-all mb-2" required />
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 flex gap-1 h-1.5">
                                        <div className={`flex-1 rounded-full ${password.length > 0 ? strengthColor : 'bg-[#E5E7EB]'}`}></div>
                                        <div className={`flex-1 rounded-full ${strength >= 2 ? strengthColor : 'bg-[#E5E7EB]'}`}></div>
                                        <div className={`flex-1 rounded-full ${strength >= 3 ? strengthColor : 'bg-[#E5E7EB]'}`}></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-[#6B7280] w-12 text-right">{strengthText}</span>
                                </div>
                            </div>

                            <label className="flex items-start gap-3 mt-4 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-[#D1D5DB] text-[#1A3C6E] focus:ring-[#1A3C6E]" required />
                                <span className="text-xs text-[#6B7280] leading-snug">Saya menyetujui <Link href="#" className="font-bold text-[#1A3C6E]">Syarat & Ketentuan</Link> serta <Link href="#" className="font-bold text-[#1A3C6E]">Kebijakan Privasi</Link> Belio.</span>
                            </label>

                            <button type="button" onClick={handleNextStep1} className="w-full bg-[#1A3C6E] text-white font-bold h-11 rounded-lg mt-4 hover:bg-[#2A5FA0] transition-colors shadow-md shadow-[#1A3C6E]/20">
                                Lanjut
                            </button>

                            {/* Social Login */}
                            <div className="mt-8 mb-4 relative">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E7EB]"></div></div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-white px-2 text-[#9CA3AF]">Atau daftar dengan</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <button type="button" onClick={() => handleOAuth("google")} className="w-full bg-white border border-[#D1D5DB] text-[#4B5563] font-bold h-11 rounded-lg flex items-center justify-center gap-3 hover:bg-[#F9FAFB] transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                                    Lanjutkan dengan Google
                                </button>

                            </div>
                        </div>
                    )}

                    {/* Step 2: Verifikasi HP (OTP) */}
                    {step === 2 && (
                        <div className="flex flex-col gap-4 text-center items-center py-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-16 h-16 bg-[#EBF2FA] text-[#1A3C6E] rounded-full flex items-center justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <h2 className="text-xl font-bold text-[#1F2937]">Cek SMS Kamu</h2>
                            <p className="text-sm text-[#4B5563]">Kami telah mengirimkan 6 digit kode OTP ke nomor <br/><strong className="text-[#1F2937]">+62 {phone}</strong></p>
                            
                            <div className="flex justify-center gap-2 my-4">
                                {[1,2,3,4,5,6].map((idx) => (
                                    <input key={idx} type="text" maxLength={1} className="w-10 h-12 md:w-12 md:h-14 border-2 border-[#D1D5DB] rounded-xl text-center text-xl font-bold text-[#1A3C6E] focus:outline-none focus:border-[#1A3C6E] focus:bg-[#EBF2FA] transition-colors" />
                                ))}
                            </div>
                            
                            <p className="text-xs text-[#6B7280]">
                                Belum menerima kode? <span className="font-bold text-[#1A3C6E]">Kirim ulang (00:59)</span>
                            </p>
                            
                            <button type="button" onClick={handleVerifyOTP} disabled={isLoading} className="w-full bg-[#1A3C6E] text-white font-bold h-11 rounded-lg mt-6 hover:bg-[#2A5FA0] transition-colors shadow-md shadow-[#1A3C6E]/20 disabled:opacity-70">
                                {isLoading ? "Memverifikasi..." : "Verifikasi"}
                            </button>
                            <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-[#1A3C6E] mt-2 hover:underline">Ganti Nomor HP</button>
                        </div>
                    )}

                    {/* Step 3: Selesai */}
                    {step === 3 && (
                        <div className="flex flex-col gap-4 text-center items-center py-8 animate-in zoom-in-95 duration-500">
                            <div className="w-24 h-24 bg-[#E8F8F5] text-[#2ECC8B] rounded-full flex items-center justify-center mb-2 shadow-inner border-[8px] border-white ring-4 ring-[#E8F8F5]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <h2 className="text-2xl font-bold text-[#1F2937]">Pendaftaran Berhasil!</h2>
                            <p className="text-sm text-[#4B5563] mb-6 max-w-sm">Selamat bergabung di Belio! Akun kamu sudah aktif. Nikmati promo gratis ongkir untuk pesanan pertamamu hari ini.</p>
                            
                            <button type="button" onClick={() => window.location.href = '/'} className="w-full bg-[#1A3C6E] text-white font-bold h-12 rounded-xl hover:bg-[#2A5FA0] transition-colors shadow-md shadow-[#1A3C6E]/20 text-lg">
                                Mulai Belanja Sekarang
                            </button>
                            <button type="button" onClick={() => window.location.href = '/profil'} className="w-full bg-white border-2 border-[#1A3C6E] text-[#1A3C6E] font-bold h-12 rounded-xl hover:bg-[#EBF2FA] transition-colors mt-2 text-lg">
                                Lengkapi Profil Dulu
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

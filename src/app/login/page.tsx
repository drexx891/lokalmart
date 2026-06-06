"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { supabasePublic } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
    const [showPassword, setShowPassword] = useState(false);
    const [otpStep, setOtpStep] = useState<"inputPhone" | "inputOtp">("inputPhone");
    const [isLoading, setIsLoading] = useState(false);

    const handleOAuth = async (provider: "google" | "facebook") => {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
            toast.error("Fitur login dengan " + provider + " sedang dalam perbaikan (kredensial OAuth belum diatur). Silakan login dengan password.");
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
            toast.error(`Gagal masuk dengan ${provider}: ` + error.message);
        }
    };

    return (
        <div className="bg-[#F7F8FA] min-h-screen flex items-center justify-center p-4">
            
            {/* Tombol Kembali Tersembunyi di Desktop, Muncul di Mobile */}
            <Link href="/" className="md:hidden absolute top-4 left-4 p-2 bg-white rounded-full shadow-sm text-[#1F2937]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </Link>

            <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col min-h-[100dvh] md:min-h-0 md:h-auto">
                
                {/* Header Logo */}
                <div className="px-8 pt-10 pb-6 text-center">
                    <div className="flex justify-center mb-2"><Logo size="lg" /></div>
                    <p className="text-[#6B7280] text-sm">Belanja lebih cerdas, lebih percaya.</p>
                </div>

                {/* Login Form Area */}
                <div className="px-8 pb-8 flex-1 flex flex-col">
                    <h1 className="text-2xl font-bold text-[#1F2937] mb-6">Masuk ke Akun</h1>

                    {/* Tabs */}
                    <div className="flex bg-[#F3F4F6] p-1 rounded-lg mb-6">
                        <button 
                            onClick={() => setLoginMethod("password")}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${loginMethod === "password" ? "bg-white text-[#1A3C6E] shadow-sm" : "text-[#6B7280] hover:text-[#1F2937]"}`}
                        >
                            Dengan Password
                        </button>
                        <button 
                            onClick={() => setLoginMethod("otp")}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${loginMethod === "otp" ? "bg-white text-[#1A3C6E] shadow-sm" : "text-[#6B7280] hover:text-[#1F2937]"}`}
                        >
                            Dengan OTP
                        </button>
                    </div>

                    {loginMethod === "password" && (
                        <form action={async (formData) => {
                            setIsLoading(true);
                            const loadingId = toast.loading("Memproses login...");
                            try {
                                const { loginAction } = await import("@/app/actions/auth");
                                const res = await loginAction(formData);
                                if (res.success) {
                                    toast.success(res.message, { id: loadingId });
                                    window.location.href = "/"; // redirect manual agar session terefleksi
                                } else {
                                    toast.error(res.message, { id: loadingId });
                                }
                            } catch {
                                toast.error("Terjadi kesalahan sistem", { id: loadingId });
                            } finally {
                                setIsLoading(false);
                            }
                        }} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-semibold text-[#374151] block mb-1">Nomor HP atau Email</label>
                                <input name="email" type="text" placeholder="Contoh: budi@email.com" className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A3C6E]/20 focus:border-[#1A3C6E] transition-all" required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-[#374151] block mb-1">Password</label>
                                <div className="relative">
                                    <input name="password" type={showPassword ? "text" : "password"} placeholder="Masukkan password" className="w-full border border-[#D1D5DB] rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A3C6E]/20 focus:border-[#1A3C6E] transition-all" required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563]">
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        )}
                                    </button>
                                </div>
                                <div className="text-right mt-1.5">
                                    <Link href="#" className="text-xs font-bold text-[#1A3C6E] hover:underline">Lupa password?</Link>
                                </div>
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full bg-[#1A3C6E] text-white font-bold h-11 rounded-lg mt-2 hover:bg-[#2A5FA0] transition-colors shadow-md shadow-[#1A3C6E]/20 disabled:opacity-70">
                                {isLoading ? "Memproses..." : "Masuk"}
                            </button>
                        </form>
                    )}

                    {loginMethod === "otp" && otpStep === "inputPhone" && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-semibold text-[#374151] block mb-1">Nomor HP</label>
                                <div className="relative flex">
                                    <div className="bg-[#F3F4F6] border border-[#D1D5DB] border-r-0 rounded-l-lg px-3 flex items-center justify-center text-[#4B5563] font-semibold text-sm">
                                        +62
                                    </div>
                                    <input type="tel" placeholder="812-xxxx-xxxx" className="w-full border border-[#D1D5DB] rounded-r-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A3C6E]/20 focus:border-[#1A3C6E] transition-all" />
                                </div>
                            </div>
                            <button type="button" onClick={() => setOtpStep("inputOtp")} className="w-full bg-[#1A3C6E] text-white font-bold h-11 rounded-lg mt-2 hover:bg-[#2A5FA0] transition-colors shadow-md shadow-[#1A3C6E]/20">
                                Kirim Kode OTP
                            </button>
                        </div>
                    )}

                    {loginMethod === "otp" && otpStep === "inputOtp" && (
                        <div className="flex flex-col gap-4 text-center items-center">
                            <p className="text-sm text-[#4B5563]">Kode OTP telah dikirim ke <strong className="text-[#1F2937]">+62 812-xxxx-7890</strong></p>
                            
                            <div className="flex justify-center gap-2 my-2">
                                {[1,2,3,4,5,6].map((idx) => (
                                    <input key={idx} type="text" maxLength={1} className="w-12 h-14 border-2 border-[#D1D5DB] rounded-xl text-center text-xl font-bold text-[#1A3C6E] focus:outline-none focus:border-[#1A3C6E] focus:bg-[#EBF2FA] transition-colors" />
                                ))}
                            </div>
                            
                            <p className="text-xs text-[#6B7280]">
                                Belum menerima kode? <span className="font-bold text-[#1A3C6E]">Kirim ulang dalam 59 detik</span>
                            </p>
                            
                            <button type="button" onClick={() => setOtpStep("inputPhone")} className="text-sm font-bold text-[#1A3C6E] mt-4 hover:underline">Ganti Nomor HP</button>
                        </div>
                    )}

                    {/* Social Login */}
                    <div className="mt-8 mb-6 relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E7EB]"></div></div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-2 text-[#9CA3AF]">Atau masuk dengan</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <button type="button" onClick={() => handleOAuth("google")} className="w-full bg-white border border-[#D1D5DB] text-[#4B5563] font-bold h-11 rounded-lg flex items-center justify-center gap-3 hover:bg-[#F9FAFB] transition-colors">
                            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                            Lanjutkan dengan Google
                        </button>

                    </div>

                    <div className="mt-auto pt-8 text-center text-sm text-[#4B5563]">
                        Belum punya akun? <Link href="/register" className="font-bold text-[#1A3C6E] hover:underline">Daftar sekarang</Link>
                    </div>
                </div>

                <div className="bg-[#F9FAFB] p-4 text-center border-t border-[#E5E7EB]">
                    <p className="text-[10px] text-[#9CA3AF]">Dengan masuk, kamu menyetujui <Link href="#" className="underline">Syarat & Ketentuan</Link> serta <Link href="#" className="underline">Kebijakan Privasi</Link> Belio.</p>
                </div>
            </div>
        </div>
    );
}

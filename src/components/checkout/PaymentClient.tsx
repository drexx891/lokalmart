"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

declare global {
    interface Window {
        snap: any;
    }
}

export default function PaymentClient({ order }: { order: any }) {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

    // Simulasi countdown timer 24 jam
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Load Midtrans Script
    useEffect(() => {
        const scriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        // Ganti dengan Client Key Sandbox Anda
        const clientKey = "SB-Mid-client-0z0B0h_mB2bN7D1T";

        let scriptTag = document.createElement("script");
        scriptTag.src = scriptUrl;
        scriptTag.setAttribute("data-client-key", clientKey);

        document.body.appendChild(scriptTag);

        return () => {
            document.body.removeChild(scriptTag);
        };
    }, []);

    const handlePay = () => {
        if (!order.paymentToken) {
            toast.error("Token pembayaran tidak ditemukan. Silakan checkout ulang.");
            return;
        }

        window.snap.pay(order.paymentToken, {
            onSuccess: function(result: any) {
                toast.success("Pembayaran berhasil!");
                router.push("/profil/pesanan");
                router.refresh();
            },
            onPending: function(result: any) {
                toast.success("Menunggu pembayaran Anda!");
            },
            onError: function(result: any) {
                toast.error("Pembayaran gagal!");
            },
            onClose: function() {
                toast.error("Anda menutup popup tanpa menyelesaikan pembayaran");
            }
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            {/* Header / Countdown */}
            <div className="bg-[#FFF9F0] p-6 border-b border-[#F5A623] flex flex-col items-center text-center">
                <h2 className="text-[#1F2937] font-bold text-lg mb-2">Selesaikan Pembayaran Dalam</h2>
                <div className="flex gap-3 text-[#E24B4A] font-black text-3xl font-mono">
                    <div className="flex flex-col items-center">
                        <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span className="text-[10px] text-[#6B7280] font-sans font-bold uppercase mt-1">Jam</span>
                    </div>
                    <span>:</span>
                    <div className="flex flex-col items-center">
                        <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                        <span className="text-[10px] text-[#6B7280] font-sans font-bold uppercase mt-1">Menit</span>
                    </div>
                    <span>:</span>
                    <div className="flex flex-col items-center">
                        <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                        <span className="text-[10px] text-[#6B7280] font-sans font-bold uppercase mt-1">Detik</span>
                    </div>
                </div>
                <p className="text-sm text-[#6B7280] mt-3">Jatuh tempo: Besok, pukul {new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, '0')} WIB</p>
            </div>

            <div className="p-6 md:p-8 space-y-8 flex flex-col items-center">
                
                <div className="text-center">
                    <h3 className="font-bold text-xl text-[#1F2937] mb-2">Lanjutkan ke Midtrans</h3>
                    <p className="text-[#6B7280] text-sm max-w-md mx-auto">
                        Klik tombol di bawah ini untuk membuka popup pembayaran yang aman dari Midtrans. Anda bisa melihat nomor Rekening/VA atau QRIS di sana.
                    </p>
                </div>

                {/* Ringkasan Nominal */}
                <div className="w-full max-w-md bg-[#F7F9FC] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[#6B7280]">Metode Dipilih</span>
                        <span className="font-medium text-[#1F2937]">{order.paymentMethod || "Pilih di Midtrans"}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#E5E7EB] pt-3 mt-3">
                        <span className="font-bold text-[#1F2937]">Total Tagihan</span>
                        <span className="text-2xl font-black text-[#E24B4A]">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(order.totalAmount + 25000)}
                        </span>
                    </div>
                </div>

                <div className="w-full max-w-md pt-4">
                    <button 
                        onClick={handlePay}
                        className="w-full py-4 rounded-xl font-bold text-white bg-[#2ECC8B] hover:bg-[#25B178] shadow-md transition-all transform hover:scale-[1.02]"
                    >
                        Buka Halaman Pembayaran
                    </button>
                    <button 
                        onClick={() => router.push("/profil/pesanan")} 
                        className="w-full py-3 mt-3 rounded-xl font-bold text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-colors"
                    >
                        Cek Status Pembayaran
                    </button>
                </div>

            </div>
        </div>
    );
}

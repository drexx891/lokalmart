"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import * as Switch from "@radix-ui/react-switch";

export default function NotifikasiPage() {
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState({
    emailOrder: true,
    emailPromo: true,
    emailSecurity: true,
    pushNotification: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/akun/notifikasi");
        const data = await res.json();
        if (data.success && data.data) {
          setPrefs({
            emailOrder: data.data.emailOrder,
            emailPromo: data.data.emailPromo,
            emailSecurity: data.data.emailSecurity,
            pushNotification: data.data.pushNotification,
          });
        }
      } catch {
        toast.error("Gagal memuat preferensi");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleToggle = async (key: keyof typeof prefs, value: boolean) => {
    if (key === 'emailSecurity') return; // Cannot change
    
    // Optimistic update
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);

    try {
      const res = await fetch("/api/akun/notifikasi", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
    } catch {
      // Revert on failure
      setPrefs(prefs);
      toast.error("Gagal memperbarui preferensi");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-[#F3F4F6] rounded-lg animate-pulse w-48" />
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-[#F3F4F6] rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-black text-[#1F2937]">Notifikasi</h1>
          <p className="text-sm text-[#6B7280] mt-1">Atur preferensi komunikasi dan pemberitahuan untuk akun Anda.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          
          <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#1F2937]">Email Pesanan & Transaksi</h3>
              <p className="text-sm text-[#6B7280] mt-1 max-w-md">Kirim struk, update status pengiriman, dan konfirmasi pembayaran ke email.</p>
            </div>
            <Switch.Root 
              checked={prefs.emailOrder} 
              onCheckedChange={(v) => handleToggle('emailOrder', v)}
              className="w-[42px] h-[24px] bg-gray-200 rounded-full relative data-[state=checked]:bg-[#1A3C6E] outline-none cursor-pointer"
            >
              <Switch.Thumb className="block w-[20px] h-[20px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
          </div>

          <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#1F2937]">Email Promo & Penawaran</h3>
              <p className="text-sm text-[#6B7280] mt-1 max-w-md">Dapatkan info flash sale, voucher diskon, dan produk rekomendasi khusus.</p>
            </div>
            <Switch.Root 
              checked={prefs.emailPromo} 
              onCheckedChange={(v) => handleToggle('emailPromo', v)}
              className="w-[42px] h-[24px] bg-gray-200 rounded-full relative data-[state=checked]:bg-[#1A3C6E] outline-none cursor-pointer"
            >
              <Switch.Thumb className="block w-[20px] h-[20px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
          </div>

          <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between opacity-80">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#1F2937]">Keamanan Akun</h3>
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded uppercase">Wajib</span>
              </div>
              <p className="text-sm text-[#6B7280] mt-1 max-w-md">Peringatan login dari perangkat baru dan pembaruan password.</p>
            </div>
            <Switch.Root 
              disabled
              checked={prefs.emailSecurity} 
              className="w-[42px] h-[24px] bg-gray-200 rounded-full relative data-[state=checked]:bg-gray-400 outline-none cursor-not-allowed"
            >
              <Switch.Thumb className="block w-[20px] h-[20px] bg-white rounded-full transition-transform duration-100 translate-x-[19px]" />
            </Switch.Root>
          </div>

          <div className="p-6 flex items-center justify-between bg-[#F9FAFB]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#1F2937]">Push Notifications</h3>
                <span className="px-2 py-0.5 bg-[#EBF2FA] text-[#1A3C6E] text-[10px] font-bold rounded uppercase">Web/Mobile</span>
              </div>
              <p className="text-sm text-[#6B7280] mt-1 max-w-md">Terima notifikasi instan langsung di perangkat ini (membutuhkan izin browser).</p>
            </div>
            <Switch.Root 
              checked={prefs.pushNotification} 
              onCheckedChange={(v) => {
                if (v && "Notification" in window && Notification.permission !== "granted") {
                  Notification.requestPermission().then(perm => {
                    if (perm === "granted") handleToggle('pushNotification', true);
                    else toast.error("Izin notifikasi ditolak oleh browser");
                  });
                } else {
                  handleToggle('pushNotification', v);
                }
              }}
              className="w-[42px] h-[24px] bg-gray-200 rounded-full relative data-[state=checked]:bg-[#1A3C6E] outline-none cursor-pointer"
            >
              <Switch.Thumb className="block w-[20px] h-[20px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
          </div>

        </div>
      </div>
    </>
  );
}

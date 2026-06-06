"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";

export default function KeamananPage() {
  const [loading, setLoading] = useState(true);
  const [savingPass, setSavingPass] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/akun/profil");
        const data = await res.json();
        if (data.success && data.data.user) {
          setUser(data.data.user);
        }
      } catch {
        toast.error("Gagal memuat info keamanan");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const calculateStrength = (pass: string) => {
    if (!pass) return { text: "Kosong", color: "bg-gray-200", percent: 0 };
    let score = 0;
    if (pass.length > 7) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { text: "Lemah", color: "bg-red-500", percent: 25 };
    if (score === 2) return { text: "Sedang", color: "bg-yellow-500", percent: 50 };
    if (score >= 3) return { text: "Kuat", color: "bg-green-500", percent: 100 };
    return { text: "Kosong", color: "bg-gray-200", percent: 0 };
  };

  const strength = calculateStrength(newPassword);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Konfirmasi password tidak cocok!");
    }
    if (newPassword.length < 8) {
      return toast.error("Password baru minimal 8 karakter!");
    }

    setSavingPass(true);
    try {
      const res = await fetch("/api/akun/keamanan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password berhasil diubah!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setSavingPass(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-[#F3F4F6] rounded-lg animate-pulse w-48" />
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-[#F3F4F6] rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="space-y-6">
        <h1 className="text-xl font-black text-[#1F2937]">Keamanan Akun</h1>

        {/* Verifikasi Akun */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${user?.isVerified ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
              {user?.isVerified ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              )}
            </div>
            <div>
              <h2 className="font-bold text-[#1F2937]">{user?.isVerified ? "Akun Terverifikasi" : "Akun Belum Diverifikasi"}</h2>
              <p className="text-sm text-[#6B7280] mt-1">
                {user?.isVerified 
                  ? "Akun Anda sudah diverifikasi. Fitur penuh tersedia." 
                  : "Verifikasi email Anda untuk keamanan ekstra dan akses penuh."}
              </p>
            </div>
          </div>
          {!user?.isVerified && (
            <button className="px-4 py-2 border border-[#D1D5DB] text-[#4B5563] text-sm font-bold rounded-xl hover:bg-[#F9FAFB] transition-colors whitespace-nowrap">
              Kirim Ulang Email
            </button>
          )}
        </div>

        {/* Email & Info Auth */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-5">
          <h2 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider">Email Utama</h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-[#F3F4F6] rounded-xl bg-[#F9FAFB]">
            <div>
              <p className="text-sm font-semibold text-[#1F2937]">{user?.email}</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Digunakan untuk login dan notifikasi</p>
            </div>
            <button className="px-4 py-2 bg-white border border-[#D1D5DB] text-[#4B5563] text-sm font-bold rounded-xl hover:bg-[#F3F4F6] transition-colors whitespace-nowrap">
              Ubah Email
            </button>
          </div>
        </div>

        {/* Ubah Password */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <h2 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider mb-5">Ubah Kata Sandi</h2>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Kata Sandi Saat Ini</label>
              <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E]" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Kata Sandi Baru</label>
              <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E]" />
              
              {newPassword.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.percent}%` }} />
                  </div>
                  <span className={`text-[11px] font-bold ${strength.percent < 50 ? 'text-red-500' : strength.percent === 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {strength.text}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Konfirmasi Kata Sandi Baru</label>
              <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E]" />
            </div>

            <div className="pt-2">
              <button type="submit" disabled={savingPass}
                className="w-full bg-[#1A3C6E] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#153256] transition-colors disabled:opacity-60">
                {savingPass ? "Memperbarui..." : "Simpan Kata Sandi"}
              </button>
            </div>
          </form>
        </div>

        {/* Sesi Aktif */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <h2 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider mb-5">Sesi Aktif & Perangkat</h2>
          
          <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#F3F4F6] rounded-lg text-[#4B5563] mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1F2937]">Windows PC · Chrome</p>
                <p className="text-xs text-[#6B7280]">Jakarta, Indonesia · Saat ini aktif</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-md uppercase tracking-wide">Device Ini</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1F2937]">Keluar dari semua perangkat</p>
              <p className="text-xs text-[#6B7280] mt-0.5">Sesi di perangkat lain akan diakhiri seketika.</p>
            </div>
            <button className="px-4 py-2 border border-red-200 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors">
              Keluar Semua
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

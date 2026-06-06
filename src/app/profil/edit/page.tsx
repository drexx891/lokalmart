"use client";

import { useState, useEffect, useCallback } from "react";
import { toast, Toaster } from "sonner";

const PROVINCES = [
  "Aceh","Sumatera Utara","Sumatera Barat","Riau","Jambi","Sumatera Selatan","Bengkulu","Lampung",
  "Kepulauan Bangka Belitung","Kepulauan Riau","DKI Jakarta","Jawa Barat","Jawa Tengah","DI Yogyakarta",
  "Jawa Timur","Banten","Bali","Nusa Tenggara Barat","Nusa Tenggara Timur","Kalimantan Barat",
  "Kalimantan Tengah","Kalimantan Selatan","Kalimantan Timur","Kalimantan Utara","Sulawesi Utara",
  "Sulawesi Tengah","Sulawesi Selatan","Sulawesi Tenggara","Gorontalo","Sulawesi Barat","Maluku",
  "Maluku Utara","Papua","Papua Barat"
];

interface UserProfile {
  id: string; name: string | null; username: string | null; email: string;
  phone: string | null; avatarUrl: string | null; gender: string | null;
  birthDate: string | null; bio: string | null; isVerified: boolean;
}

export default function EditProfilPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  // Form fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [bio, setBio] = useState("");

  // Address fields
  const [addrLabel, setAddrLabel] = useState("Rumah");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrProvince, setAddrProvince] = useState("");
  const [addrZip, setAddrZip] = useState("");

  // Load profil
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/akun/profil");
        const data = await res.json();
        if (data.success && data.data.user) {
          const u = data.data.user;
          setUser(u);
          setName(u.name || "");
          setUsername(u.username || "");
          setPhone(u.phone || "");
          setGender(u.gender || "");
          setBirthDate(u.birthDate ? u.birthDate.split("T")[0] : "");
          setBio(u.bio || "");

          if (data.data.primaryAddress) {
            const a = data.data.primaryAddress;
            setAddrLabel(a.label || "Rumah");
            setAddrStreet(a.street || "");
            setAddrCity(a.city || "");
            setAddrProvince(a.province || "");
            setAddrZip(a.zipCode || "");
          }
        }
      } catch { toast.error("Gagal memuat profil"); }
      finally { setLoading(false); }
    })();
  }, []);

  // Username check dengan debounce
  const checkUsername = useCallback(async (val: string) => {
    if (!val || val.length < 3) { setUsernameStatus('idle'); return; }
    setUsernameStatus('checking');
    try {
      const res = await fetch(`/api/akun/username-check?username=${val}`);
      const data = await res.json();
      setUsernameStatus(data.available ? 'available' : 'taken');
    } catch { setUsernameStatus('idle'); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username && username !== user?.username) checkUsername(username);
      else setUsernameStatus('idle');
    }, 500);
    return () => clearTimeout(timer);
  }, [username, user?.username, checkUsername]);

  // Hitung usia
  const age = birthDate ? Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/akun/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, phone, gender, birthDate: birthDate || null, bio }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Profil berhasil diperbarui!");
        setUser(data.data);
      } else {
        toast.error(data.message);
      }
    } catch { toast.error("Gagal menyimpan perubahan"); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-[#F3F4F6] rounded-lg animate-pulse w-48" />
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-12 bg-[#F3F4F6] rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-xl font-black text-[#1F2937]">Biodata Diri</h1>

        {/* Avatar Section */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <h2 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider mb-4">Foto Profil</h2>
          <div className="flex items-center gap-6">
            <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#F5A623] to-[#E09612] flex items-center justify-center text-white font-bold text-4xl overflow-hidden border-4 border-white shadow-lg relative">
              {user?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                (user?.name || "U").charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <button type="button" className="px-4 py-2 bg-[#1A3C6E] text-white text-sm font-bold rounded-xl hover:bg-[#153256] transition-colors">
                Ubah Foto
              </button>
              <p className="text-[11px] text-[#9CA3AF] mt-2">Maks. 2MB · JPG, PNG, atau WebP</p>
            </div>
          </div>
        </div>

        {/* Informasi Diri */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-5">
          <h2 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider">Informasi Diri</h2>

          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)}
              className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E]" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Username</label>
            <div className="relative">
              <input type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                placeholder="contoh: beliouser123"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 ${
                  usernameStatus === 'available' ? 'border-green-400 focus:border-green-500 focus:ring-green-500' :
                  usernameStatus === 'taken' ? 'border-red-400 focus:border-red-500 focus:ring-red-500' :
                  'border-[#D1D5DB] focus:border-[#1A3C6E] focus:ring-[#1A3C6E]'
                }`} />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameStatus === 'checking' && <span className="text-[#6B7280] text-xs animate-pulse">Mengecek...</span>}
                {usernameStatus === 'available' && <span className="text-green-600 text-xs font-bold">✓ Tersedia</span>}
                {usernameStatus === 'taken' && <span className="text-red-600 text-xs font-bold">✕ Sudah dipakai</span>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Email</label>
            <input type="email" value={user?.email || ""} disabled
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm bg-[#F9FAFB] text-[#6B7280] cursor-not-allowed" />
            <p className="text-[11px] text-[#9CA3AF] mt-1">Email tidak bisa diubah langsung. Gunakan menu Keamanan.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">No. HP</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-[#F3F4F6] border border-r-0 border-[#D1D5DB] rounded-l-xl text-sm text-[#6B7280] font-semibold">+62</span>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="81234567890"
                className="flex-1 border border-[#D1D5DB] rounded-r-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Jenis Kelamin</label>
              <select value={gender} onChange={e => setGender(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] bg-white">
                <option value="">Pilih</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Tanggal Lahir</label>
              <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E]" />
              {age !== null && age >= 0 && <p className="text-[11px] text-[#9CA3AF] mt-1">{age} tahun</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Bio Singkat</label>
            <textarea rows={2} maxLength={150} value={bio} onChange={e => setBio(e.target.value)}
              placeholder="Ceritakan sedikit tentang diri Anda..."
              className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] resize-none" />
            <p className="text-[11px] text-[#9CA3AF] text-right mt-1">{bio.length}/150</p>
          </div>
        </div>

        {/* Alamat Utama */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-5">
          <h2 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider">Alamat Utama</h2>

          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Label</label>
            <div className="flex gap-2">
              {['Rumah', 'Kantor', 'Lainnya'].map(l => (
                <button key={l} type="button" onClick={() => setAddrLabel(l)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${addrLabel === l ? 'bg-[#1A3C6E] text-white' : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Jalan & No. Rumah</label>
            <input type="text" value={addrStreet} onChange={e => setAddrStreet(e.target.value)}
              placeholder="Jl. Sudirman No. 123"
              className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Kota</label>
              <input type="text" value={addrCity} onChange={e => setAddrCity(e.target.value)}
                placeholder="Jakarta Selatan"
                className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Provinsi</label>
              <select value={addrProvince} onChange={e => setAddrProvince(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] bg-white">
                <option value="">Pilih Provinsi</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Kode Pos</label>
              <input type="text" maxLength={5} value={addrZip} onChange={e => setAddrZip(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="12345"
                className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E]" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={saving || usernameStatus === 'taken'}
          className="w-full bg-gradient-to-r from-[#1A3C6E] to-[#2A5FA0] text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
          {saving ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
          ) : (
            'Simpan Perubahan'
          )}
        </button>
      </form>
    </>
  );
}

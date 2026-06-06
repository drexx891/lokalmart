"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";

const PROVINCES = [
  "Aceh","Sumatera Utara","Sumatera Barat","Riau","Jambi","Sumatera Selatan","Bengkulu","Lampung",
  "Kepulauan Bangka Belitung","Kepulauan Riau","DKI Jakarta","Jawa Barat","Jawa Tengah","DI Yogyakarta",
  "Jawa Timur","Banten","Bali","Nusa Tenggara Barat","Nusa Tenggara Timur","Kalimantan Barat",
  "Kalimantan Tengah","Kalimantan Selatan","Kalimantan Timur","Kalimantan Utara","Sulawesi Utara",
  "Sulawesi Tengah","Sulawesi Selatan","Sulawesi Tenggara","Gorontalo","Sulawesi Barat","Maluku",
  "Maluku Utara","Papua","Papua Barat"
];

export default function AlamatPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [label, setLabel] = useState("Rumah");
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/akun/alamat");
      const data = await res.json();
      if (data.success) {
        setAddresses(data.data);
      }
    } catch {
      toast.error("Gagal memuat alamat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setLabel("Rumah");
    setRecipientName("");
    setPhone("");
    setStreet("");
    setCity("");
    setProvince("");
    setZipCode("");
    setIsPrimary(false);
  };

  const handleOpenAdd = () => {
    if (addresses.length >= 5) {
      return toast.error("Maksimal 5 alamat tersimpan!");
    }
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: any) => {
    setEditingId(addr.id);
    setLabel(addr.label);
    setRecipientName(addr.recipientName);
    setPhone(addr.phone);
    setStreet(addr.street);
    setCity(addr.city);
    setProvince(addr.province);
    setZipCode(addr.zipCode);
    setIsPrimary(addr.isPrimary);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = { id: editingId, label, recipientName, phone, street, city, province, zipCode, isPrimary };
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch("/api/akun/alamat", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message);
        setIsModalOpen(false);
        fetchAddresses();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus alamat ini?")) return;
    try {
      const res = await fetch(`/api/akun/alamat?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchAddresses();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Gagal menghapus alamat");
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      const res = await fetch("/api/akun/alamat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPrimary: true }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Alamat utama diubah!");
        fetchAddresses();
      }
    } catch {
      toast.error("Gagal mengubah alamat utama");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-[#F3F4F6] rounded-lg animate-pulse w-48" />
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4">
          {[1, 2].map(i => <div key={i} className="h-32 bg-[#F3F4F6] rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-[#1F2937]">Daftar Alamat</h1>
            <p className="text-sm text-[#6B7280] mt-1">{addresses.length}/5 alamat tersimpan</p>
          </div>
          <button 
            onClick={handleOpenAdd}
            disabled={addresses.length >= 5}
            className="bg-[#1A3C6E] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#153256] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Tambah Alamat Baru
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] border-dashed p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-4 text-[#9CA3AF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <h3 className="font-bold text-[#1F2937] text-lg mb-1">Belum ada alamat</h3>
            <p className="text-[#6B7280] text-sm max-w-sm mb-6">Tambahkan alamat pengiriman untuk mempermudah proses checkout pesanan Anda.</p>
            <button onClick={handleOpenAdd} className="bg-white border border-[#D1D5DB] text-[#4B5563] px-5 py-2 rounded-xl font-bold text-sm hover:bg-[#F9FAFB]">
              Tambah Alamat
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className={`bg-white rounded-2xl border p-5 ${addr.isPrimary ? 'border-[#1A3C6E] shadow-[0_0_0_1px_#1A3C6E]' : 'border-[#E5E7EB]'}`}>
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-[#6B7280]">{addr.label}</span>
                      {addr.isPrimary && (
                        <span className="px-2 py-0.5 bg-[#EBF2FA] text-[#1A3C6E] text-[10px] font-bold rounded uppercase">Utama</span>
                      )}
                    </div>
                    <h3 className="font-bold text-[#1F2937] text-lg">{addr.recipientName}</h3>
                    <p className="text-[#4B5563] text-sm mt-1">{addr.phone}</p>
                    <p className="text-[#6B7280] text-sm mt-2 max-w-xl">
                      {addr.street}, {addr.city}, {addr.province} {addr.zipCode}
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-end gap-2 shrink-0">
                    <button onClick={() => handleOpenEdit(addr)} className="text-sm font-bold text-[#2A5FA0] hover:text-[#1A3C6E]">Ubah</button>
                    {!addr.isPrimary && (
                      <button onClick={() => handleSetPrimary(addr.id)} className="text-sm font-bold text-[#6B7280] hover:text-[#1F2937]">Set Utama</button>
                    )}
                    <button onClick={() => handleDelete(addr.id)} className="text-sm font-bold text-red-500 hover:text-red-700">Hapus</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal / Dialog Form */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl z-50 p-6">
            <Dialog.Title className="text-xl font-black text-[#1F2937] mb-6">
              {editingId ? "Ubah Alamat" : "Tambah Alamat Baru"}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Label</label>
                <div className="flex gap-2">
                  {['Rumah', 'Kantor', 'Lainnya'].map(l => (
                    <button key={l} type="button" onClick={() => setLabel(l)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${label === l ? 'bg-[#1A3C6E] text-white' : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Nama Penerima <span className="text-red-500">*</span></label>
                  <input type="text" required value={recipientName} onChange={e => setRecipientName(e.target.value)}
                    className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">No. HP <span className="text-red-500">*</span></label>
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Jalan & No. Rumah <span className="text-red-500">*</span></label>
                <input type="text" required value={street} onChange={e => setStreet(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Kota <span className="text-red-500">*</span></label>
                  <input type="text" required value={city} onChange={e => setCity(e.target.value)}
                    className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Kode Pos</label>
                  <input type="text" maxLength={5} value={zipCode} onChange={e => setZipCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Provinsi <span className="text-red-500">*</span></label>
                <select required value={province} onChange={e => setProvince(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] bg-white">
                  <option value="">Pilih Provinsi</option>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {!isPrimary && (
                <label className="flex items-center gap-3 py-2 cursor-pointer mt-2">
                  <input type="checkbox" checked={isPrimary} onChange={e => setIsPrimary(e.target.checked)}
                    className="w-5 h-5 rounded border-[#D1D5DB] text-[#1A3C6E] focus:ring-[#1A3C6E]" />
                  <span className="text-sm font-semibold text-[#1F2937]">Jadikan sebagai alamat utama</span>
                </label>
              )}

              <div className="flex gap-3 pt-4">
                <Dialog.Close asChild>
                  <button type="button" className="flex-1 py-3 bg-white border border-[#D1D5DB] rounded-xl font-bold text-sm text-[#4B5563] hover:bg-[#F9FAFB]">
                    Batal
                  </button>
                </Dialog.Close>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-[#1A3C6E] rounded-xl font-bold text-sm text-white hover:bg-[#153256] disabled:opacity-60">
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

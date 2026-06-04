"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface Address {
    id: string;
    label: string;
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    street: string;
    zipCode: string;
    isPrimary: boolean;
}

export default function AddressClient({ initialAddresses }: { initialAddresses: Address[] }) {
    const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [formData, setFormData] = useState<Partial<Address>>({});
    const [isSaving, setIsSaving] = useState(false);

    const handleOpenModal = (address?: Address) => {
        if (address) {
            setEditingAddress(address);
            setFormData(address);
        } else {
            setEditingAddress(null);
            setFormData({
                label: "Rumah",
                recipientName: "",
                phone: "",
                province: "",
                city: "",
                street: "",
                zipCode: "",
                isPrimary: addresses.length === 0
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAddress(null);
        setFormData({});
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Simulasi API Save karena DB Push saat ini terhalang network (mockup mode)
        setTimeout(() => {
            if (editingAddress) {
                // Edit
                setAddresses(addresses.map(a => a.id === editingAddress.id ? { ...a, ...formData } as Address : a));
                toast.success("Alamat berhasil diperbarui!");
            } else {
                // Tambah baru
                const newAddress: Address = {
                    ...formData as Address,
                    id: `addr_${Date.now()}`,
                };
                
                if (newAddress.isPrimary) {
                    // Jadikan yang lain bukan primary
                    setAddresses([newAddress, ...addresses.map(a => ({ ...a, isPrimary: false }))]);
                } else {
                    setAddresses([...addresses, newAddress]);
                }
                toast.success("Alamat baru berhasil ditambahkan!");
            }
            
            setIsSaving(false);
            handleCloseModal();
        }, 800);
    };

    const handleDelete = (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus alamat ini?")) return;
        
        const addrToDelete = addresses.find(a => a.id === id);
        if (addrToDelete?.isPrimary) {
            toast.error("Alamat utama tidak dapat dihapus. Jadikan alamat lain sebagai utama terlebih dahulu.");
            return;
        }

        setAddresses(addresses.filter(a => a.id !== id));
        toast.success("Alamat berhasil dihapus");
    };

    const handleSetPrimary = (id: string) => {
        setAddresses(addresses.map(a => ({
            ...a,
            isPrimary: a.id === id
        })));
        toast.success("Alamat utama berhasil diubah");
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            <div className="border-b border-[#E5E7EB] p-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#1F2937]">Daftar Alamat</h1>
                    <p className="text-sm text-[#6B7280] mt-1">Kelola alamat pengiriman Anda untuk mempermudah saat berbelanja</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-[#1A3C6E] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#2A5FA0] transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Tambah Alamat
                </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
                {addresses.length === 0 ? (
                    <div className="text-center py-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1" className="mx-auto mb-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <p className="text-[#6B7280] font-medium mb-4">Anda belum menyimpan alamat pengiriman.</p>
                        <button onClick={() => handleOpenModal()} className="border border-[#1A3C6E] text-[#1A3C6E] px-6 py-2 rounded-lg font-bold hover:bg-[#EBF2FA] transition-colors">
                            Tambah Alamat Baru
                        </button>
                    </div>
                ) : (
                    addresses.map((addr) => (
                        <div key={addr.id} className={`border ${addr.isPrimary ? 'border-[#1A3C6E] bg-[#F7F9FC]' : 'border-[#E5E7EB]'} rounded-xl p-5 relative group transition-colors hover:border-[#1A3C6E]`}>
                            {addr.isPrimary && (
                                <div className="absolute top-0 right-0 bg-[#1A3C6E] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                                    UTAMA
                                </div>
                            )}
                            
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-[#1F2937] text-lg">{addr.recipientName}</h3>
                                        <span className="bg-[#E5E7EB] text-[#4B5563] text-[10px] px-2 py-0.5 rounded font-semibold">{addr.label}</span>
                                    </div>
                                    <p className="text-[#1F2937] font-medium mb-1">{addr.phone}</p>
                                    <p className="text-[#6B7280] text-sm max-w-2xl leading-relaxed">
                                        {addr.street}<br/>
                                        {addr.city}, {addr.province} {addr.zipCode}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-3 mt-1 mr-4">
                                    <div className="flex gap-4 text-sm">
                                        <button onClick={() => handleOpenModal(addr)} className="text-[#1A3C6E] font-bold hover:underline">Ubah</button>
                                        <button onClick={() => handleDelete(addr.id)} className="text-[#E24B4A] font-bold hover:underline">Hapus</button>
                                    </div>
                                    {!addr.isPrimary && (
                                        <button onClick={() => handleSetPrimary(addr.id)} className="text-xs border border-[#D1D5DB] text-[#4B5563] px-3 py-1 rounded hover:bg-[#F3F4F6] font-semibold transition-colors mt-2">
                                            Jadikan Utama
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Tambah/Edit Alamat */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
                            <h2 className="text-xl font-bold text-[#1F2937]">
                                {editingAddress ? "Ubah Alamat" : "Tambah Alamat Baru"}
                            </h2>
                            <button onClick={handleCloseModal} className="text-[#9CA3AF] hover:text-[#4B5563] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto p-6">
                            <form id="addressForm" onSubmit={handleSave} className="space-y-5">
                                
                                <div>
                                    <label className="block text-sm font-semibold text-[#1F2937] mb-2">Label Alamat</label>
                                    <div className="flex gap-3">
                                        {['Rumah', 'Kantor', 'Toko'].map(label => (
                                            <button 
                                                key={label}
                                                type="button"
                                                onClick={() => setFormData({...formData, label})}
                                                className={`px-4 py-2 rounded-lg font-semibold text-sm border transition-colors ${formData.label === label ? 'border-[#1A3C6E] bg-[#EBF2FA] text-[#1A3C6E]' : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'}`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#1F2937] mb-1">Nama Penerima</label>
                                        <input required type="text" value={formData.recipientName || ""} onChange={e => setFormData({...formData, recipientName: e.target.value})} className="w-full border border-[#D1D5DB] rounded-lg px-4 py-2.5 outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E] text-sm" placeholder="Contoh: Budi Santoso" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#1F2937] mb-1">Nomor Telepon</label>
                                        <input required type="text" value={formData.phone || ""} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-[#D1D5DB] rounded-lg px-4 py-2.5 outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E] text-sm" placeholder="Contoh: 081234567890" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#1F2937] mb-1">Provinsi</label>
                                        <input required type="text" value={formData.province || ""} onChange={e => setFormData({...formData, province: e.target.value})} className="w-full border border-[#D1D5DB] rounded-lg px-4 py-2.5 outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E] text-sm" placeholder="Contoh: DKI Jakarta" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#1F2937] mb-1">Kota / Kabupaten</label>
                                        <input required type="text" value={formData.city || ""} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border border-[#D1D5DB] rounded-lg px-4 py-2.5 outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E] text-sm" placeholder="Contoh: Jakarta Selatan" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#1F2937] mb-1">Alamat Lengkap</label>
                                    <textarea required value={formData.street || ""} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E] text-sm min-h-[100px] resize-none" placeholder="Nama Jalan, Gedung, No. Rumah, RT/RW, Patokan..."></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#1F2937] mb-1">Kode Pos</label>
                                    <input required type="text" value={formData.zipCode || ""} onChange={e => setFormData({...formData, zipCode: e.target.value})} className="w-full md:w-1/3 border border-[#D1D5DB] rounded-lg px-4 py-2.5 outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E] text-sm" placeholder="Contoh: 12345" />
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer mt-4 group">
                                    <input type="checkbox" checked={formData.isPrimary || false} onChange={e => setFormData({...formData, isPrimary: e.target.checked})} className="w-5 h-5 text-[#1A3C6E] rounded border-gray-300 focus:ring-[#1A3C6E]" />
                                    <span className="text-sm font-semibold text-[#4B5563] group-hover:text-[#1F2937]">Jadikan sebagai alamat utama</span>
                                </label>
                            </form>
                        </div>
                        
                        <div className="p-6 border-t border-[#E5E7EB] flex justify-end gap-3 bg-white">
                            <button onClick={handleCloseModal} type="button" className="px-6 py-2.5 font-bold text-[#4B5563] hover:bg-[#F3F4F6] rounded-lg transition-colors">Batal</button>
                            <button type="submit" form="addressForm" disabled={isSaving} className="px-8 py-2.5 font-bold text-white bg-[#1A3C6E] hover:bg-[#2A5FA0] rounded-lg transition-colors disabled:opacity-50">
                                {isSaving ? "Menyimpan..." : "Simpan Alamat"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

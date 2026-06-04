"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";

interface UserProfile {
    id: string;
    name: string | null;
    email: string;
    phone?: string;
    gender?: string;
    birthDate?: string;
    avatarUrl: string | null;
}

export default function ProfilFormClient({ initialUser }: { initialUser: UserProfile }) {
    const [user, setUser] = useState<UserProfile>(initialUser);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "user" } // Memprioritaskan kamera depan/laptop
            });
            streamRef.current = stream;
            setIsCameraOpen(true);
            
            // Tunggu sedikit sampai elemen video dirender oleh React
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 100);
        } catch (err) {
            console.error("Gagal mengakses kamera:", err);
            toast.error("Tidak dapat mengakses kamera. Pastikan browser memiliki izin.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            // Atur ukuran canvas sesuai dengan video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Membalikkan gambar secara horizontal agar tidak seperti cermin (opsional)
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                
                // Gambar video ke canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Ambil gambar dari canvas sebagai base64/blob
                canvas.toBlob(async (blob) => {
                    if (!blob) {
                        toast.error("Gagal mengambil gambar");
                        return;
                    }
                    
                    // Buat file dari blob
                    const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
                    
                    // Matikan kamera dan tutup modal
                    stopCamera();
                    
                    // Unggah file yang baru saja difoto
                    await uploadFile(file);
                    
                }, 'image/jpeg', 0.9);
            }
        }
    };

    const uploadFile = async (file: File) => {
        // Validasi tipe file
        if (!file.type.startsWith('image/')) {
            toast.error("Format file tidak didukung. Pilih gambar.");
            return;
        }

        // Validasi ukuran (maks 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Ukuran gambar terlalu besar. Maksimal 2MB.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            
            if (data.success) {
                setUser(prev => ({ ...prev, avatarUrl: data.url }));
                toast.success("Foto profil berhasil diubah");
                
                // Refresh halaman
                setTimeout(() => window.location.reload(), 1500);
            } else {
                toast.error(data.message || "Gagal mengunggah foto");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan jaringan");
        } finally {
            setIsUploading(false);
            if (galleryInputRef.current) galleryInputRef.current.value = "";
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulasi save ke API
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Profil berhasil diperbarui!");
        }, 1000);
    };

    const handleDeletePhoto = async () => {
        if (!confirm("Hapus foto profil saat ini?")) return;
        
        setIsUploading(true);
        try {
            const res = await fetch('/api/upload', {
                method: 'DELETE'
            });
            const data = await res.json();
            
            if (data.success) {
                setUser(prev => ({ ...prev, avatarUrl: null }));
                toast.success("Foto profil dihapus");
                
                // Refresh halaman
                setTimeout(() => window.location.reload(), 1500);
            } else {
                toast.error(data.message || "Gagal menghapus foto");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan jaringan");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            <div className="border-b border-[#E5E7EB] p-6">
                <h1 className="text-xl font-bold text-[#1F2937]">Profil Saya</h1>
                <p className="text-sm text-[#6B7280] mt-1">Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun</p>
            </div>

            <div className="p-8 flex flex-col-reverse md:flex-row gap-12">
                
                {/* Bagian Kiri: Form Data Diri */}
                <form onSubmit={handleSave} className="flex-1 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="w-40 text-sm font-semibold text-[#6B7280] md:text-right">Username</label>
                        <div className="flex-1">
                            <input type="text" disabled value={user.email.split('@')[0]} className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg px-4 py-2 text-[#6B7280] cursor-not-allowed text-sm" />
                            <p className="text-[11px] text-[#9CA3AF] mt-1">Username tidak dapat diubah.</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="w-40 text-sm font-semibold text-[#6B7280] md:text-right">Nama Lengkap</label>
                        <div className="flex-1">
                            <input 
                                type="text" 
                                value={user.name || ""} 
                                onChange={e => setUser({...user, name: e.target.value})}
                                className="w-full border border-[#D1D5DB] focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E] rounded-lg px-4 py-2 text-[#1F2937] text-sm outline-none transition-all" 
                                placeholder="Masukkan nama lengkap"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="w-40 text-sm font-semibold text-[#6B7280] md:text-right">Email</label>
                        <div className="flex-1 flex items-center gap-3">
                            <span className="text-[#1F2937] text-sm">{user.email.replace(/(.{2})(.*)(?=@)/, '$1***')}</span>
                            <button type="button" className="text-xs font-bold text-[#1A3C6E] hover:underline">Ubah</button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="w-40 text-sm font-semibold text-[#6B7280] md:text-right">Nomor Telepon</label>
                        <div className="flex-1 flex items-center gap-3">
                            <span className="text-[#1F2937] text-sm">{user.phone ? user.phone.replace(/(.{3})(.*)(.{2})/, '$1***$3') : "Belum diatur"}</span>
                            <button type="button" className="text-xs font-bold text-[#1A3C6E] hover:underline">Ubah</button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="w-40 text-sm font-semibold text-[#6B7280] md:text-right">Jenis Kelamin</label>
                        <div className="flex-1 flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="radio" name="gender" value="Laki-laki" checked={user.gender === 'Laki-laki'} onChange={e => setUser({...user, gender: e.target.value})} className="w-4 h-4 text-[#1A3C6E] border-gray-300 focus:ring-[#1A3C6E]" />
                                <span className="text-sm text-[#4B5563] group-hover:text-[#1F2937]">Laki-laki</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="radio" name="gender" value="Perempuan" checked={user.gender === 'Perempuan'} onChange={e => setUser({...user, gender: e.target.value})} className="w-4 h-4 text-[#1A3C6E] border-gray-300 focus:ring-[#1A3C6E]" />
                                <span className="text-sm text-[#4B5563] group-hover:text-[#1F2937]">Perempuan</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="radio" name="gender" value="Lainnya" checked={user.gender === 'Lainnya'} onChange={e => setUser({...user, gender: e.target.value})} className="w-4 h-4 text-[#1A3C6E] border-gray-300 focus:ring-[#1A3C6E]" />
                                <span className="text-sm text-[#4B5563] group-hover:text-[#1F2937]">Lainnya</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="w-40 text-sm font-semibold text-[#6B7280] md:text-right">Tanggal Lahir</label>
                        <div className="flex-1">
                            <input 
                                type="date" 
                                value={user.birthDate || ""} 
                                onChange={e => setUser({...user, birthDate: e.target.value})}
                                className="border border-[#D1D5DB] focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E] rounded-lg px-4 py-2 text-[#1F2937] text-sm outline-none transition-all" 
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 pt-4">
                        <div className="w-40 hidden md:block"></div>
                        <div className="flex-1">
                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="bg-[#1A3C6E] text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-[#2A5FA0] transition-colors disabled:opacity-50"
                            >
                                {isSaving ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Bagian Kanan: Upload Avatar */}
                <div className="w-full md:w-64 flex flex-col items-center border-b md:border-b-0 md:border-l border-[#E5E7EB] pb-8 md:pb-0 md:pl-8">
                    <div className="w-32 h-32 rounded-full border-4 border-[#F3F4F6] overflow-hidden mb-5 bg-[#EBF2FA] flex items-center justify-center relative group">
                        {user.avatarUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl text-[#1A3C6E] font-bold">{user.name?.charAt(0) || "U"}</span>
                        )}
                        
                        {/* Overlay Upload saat hover (Desktop) */}
                        <div onClick={() => galleryInputRef.current?.click()} className="absolute inset-0 bg-black/40 flex-col items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                            <span className="text-xs font-bold mt-1">Ubah</span>
                        </div>
                    </div>
                    
                    {/* Hidden File Inputs */}
                    <input 
                        type="file" 
                        ref={galleryInputRef} 
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden" 
                    />

                    <div className="flex flex-col gap-2 w-full max-w-[200px]">
                        <button 
                            type="button"
                            onClick={startCamera}
                            disabled={isUploading}
                            className="bg-white border border-[#D1D5DB] text-[#4B5563] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#F9FAFB] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                            {isUploading ? "..." : "Ambil Kamera"}
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            disabled={isUploading}
                            className="bg-white border border-[#D1D5DB] text-[#4B5563] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#F9FAFB] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            {isUploading ? "..." : "Pilih dari Galeri"}
                        </button>
                        
                        {user.avatarUrl && (
                            <button 
                                type="button"
                                onClick={handleDeletePhoto}
                                disabled={isUploading}
                                className="bg-white border border-[#FCA5A5] text-[#E24B4A] px-6 py-2 rounded-lg font-bold text-sm hover:bg-[#FEF2F2] transition-colors disabled:opacity-50 mt-2"
                            >
                                Hapus Foto
                            </button>
                        )}
                    </div>

                    <div className="text-center space-y-1 mt-4">
                        <p className="text-[11px] text-[#9CA3AF]">Ukuran gambar: maks. 2 MB</p>
                        <p className="text-[11px] text-[#9CA3AF]">Format gambar: .JPEG, .PNG</p>
                    </div>
                </div>

            </div>

            {/* Modal Kamera WebRTC */}
            {isCameraOpen && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
                        <h2 className="text-xl font-bold text-[#1F2937] mb-4">Ambil Foto Langsung</h2>
                        
                        <div className="relative bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                className="w-full h-full object-cover transform -scale-x-100" 
                            />
                            {/* Garis bantu (opsional) */}
                            <div className="absolute inset-0 border-2 border-white/20 pointer-events-none rounded-xl border-dashed m-8"></div>
                        </div>

                        <div className="flex justify-between items-center mt-6 gap-4">
                            <button 
                                onClick={stopCamera}
                                className="px-6 py-2.5 rounded-lg border border-[#D1D5DB] text-[#4B5563] font-bold text-sm hover:bg-[#F3F4F6] transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={capturePhoto}
                                className="flex-1 bg-[#1A3C6E] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#2A5FA0] transition-colors flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19 4h-2l-1-2H8L7 4H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"></path></svg>
                                Jepret!
                            </button>
                        </div>
                        
                        {/* Canvas tersembunyi untuk mengambil gambar dari video stream */}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>
                </div>
            )}
        </div>
    );
}

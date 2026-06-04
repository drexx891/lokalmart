import { ReactNode } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilLayout({ children }: { children: ReactNode }) {
    const sessionUser = await getCurrentUser();
    
    // Default fallback mock
    let user: any = { name: "Pengguna", email: "", isVerified: true, avatarUrl: null };

    if (sessionUser) {
        // Ambil data terbaru dari database
        try {
            const { prisma } = await import("@/lib/prisma");
            const dbUser = await (prisma as any).user.findUnique({
                where: { id: sessionUser.id }
            });
            if (dbUser) {
                user = { ...sessionUser, ...dbUser, isVerified: true };
            }
        } catch (e) {
            user = { ...sessionUser, isVerified: true, avatarUrl: null };
        }
    }

    const menuBelanja = [
        { name: "Pesanan Saya", href: "/profil/pesanan", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2A5FA0" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
        { name: "Wishlist", href: "/profil/wishlist", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E24B4A" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> },
        { name: "Voucher & Promo", href: "/profil/voucher", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
    ];

    const menuPengaturan = [
        { name: "Daftar Alamat", href: "/profil/alamat", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> },
        { name: "Notifikasi", href: "/profil/notifikasi", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> },
        { name: "Keamanan Akun", href: "/profil/keamanan", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> },
    ];

    return (
        <div className="bg-[#F7F8FA] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* Sidebar Navigasi Desktop (Hidden di Mobile, diganti layout Profil Utama) */}
                    <aside className="hidden md:block w-72 shrink-0">
                        {/* Mini Profil Card */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E7EB] mb-6 flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#F5A623] rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden relative">
                                {user.avatarUrl ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    user.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-[#1F2937] truncate">{user.name}</h3>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="text-[11px] text-[#6B7280] font-semibold">{user.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Menu Navigasi */}
                        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                            <div className="p-4 bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Aktivitas Belanja</h4>
                            </div>
                            <div className="flex flex-col p-2">
                                {menuBelanja.map((item, idx) => (
                                    <Link key={idx} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#EBF2FA] text-[#4B5563] hover:text-[#1A3C6E] transition-colors group">
                                        <div className="w-8 h-8 rounded-full bg-[#F3F4F6] group-hover:bg-white flex items-center justify-center transition-colors">
                                            {item.icon}
                                        </div>
                                        <span className="font-semibold text-sm">{item.name}</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="p-4 bg-[#F9FAFB] border-y border-[#E5E7EB]">
                                <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Pengaturan Akun</h4>
                            </div>
                            <div className="flex flex-col p-2">
                                <Link href="/profil/edit" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#EBF2FA] text-[#4B5563] hover:text-[#1A3C6E] transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-[#F3F4F6] group-hover:bg-white flex items-center justify-center transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    </div>
                                    <span className="font-semibold text-sm">Biodata Diri</span>
                                </Link>
                                {menuPengaturan.map((item, idx) => (
                                    <Link key={idx} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#EBF2FA] text-[#4B5563] hover:text-[#1A3C6E] transition-colors group">
                                        <div className="w-8 h-8 rounded-full bg-[#F3F4F6] group-hover:bg-white flex items-center justify-center transition-colors">
                                            {item.icon}
                                        </div>
                                        <span className="font-semibold text-sm">{item.name}</span>
                                    </Link>
                                ))}
                                <a href="/api/auth/logout" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#FEF2F2] text-[#E24B4A] transition-colors group mt-2 border-t border-[#F3F4F6] w-full text-left">
                                    <div className="w-8 h-8 rounded-full bg-[#F3F4F6] group-hover:bg-white flex items-center justify-center transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                    </div>
                                    <span className="font-semibold text-sm">Keluar</span>
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Area Konten Utama */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>

                </div>
            </div>
        </div>
    );
}

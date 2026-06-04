import Link from "next/link";
import Logo from "@/components/ui/Logo";
import type { Category, User } from "@/types";

interface NavbarProps {
  categories: Category[];
  cartCount?: number;
  user?: User | null;
}

export default function Navbar({ categories, cartCount = 0, user }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Kiri: Logo */}
        <div className="flex-shrink-0">
          <Logo size="md" />
        </div>

        {/* Tengah: Search Bar (Lebar) */}
        <div className="flex-1 max-w-3xl hidden md:block">
          <form className="relative w-full" action="/search" method="GET">
            <input 
              type="text" 
              name="q"
              placeholder="Cari produk di Belio..." 
              className="w-full bg-[#F7F8FA] border border-[#E5E7EB] text-[#1F2937] text-sm rounded-full pl-5 pr-12 py-2.5 focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E] transition-all"
            />
            <button type="submit" className="absolute right-1 top-1 bottom-1 bg-[#1A3C6E] text-white px-3.5 rounded-full flex items-center justify-center hover:bg-[#2A5FA0] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </form>
        </div>

        {/* Kanan: Ikon Aksi & Profil */}
        <div className="flex items-center gap-6 shrink-0 text-[#1F2937]">
          
          <Link href="/keranjang" className="relative hover:text-[#1A3C6E] transition-colors hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#F5A623] text-[#1A3C6E] text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          <Link href="/pesan" className="relative hover:text-[#1A3C6E] transition-colors hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </Link>

          <div className="flex items-center gap-3 border-l border-[#E5E7EB] pl-6 ml-2">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profil" className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-8 h-8 bg-[#EBF2FA] text-[#1A3C6E] rounded-full flex items-center justify-center font-bold text-sm border border-[#BFDBFE] group-hover:bg-[#1A3C6E] group-hover:text-white transition-colors overflow-hidden relative">
                    {(user as any).avatarUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={(user as any).avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        user.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <div className="hidden md:flex flex-col">
                    <span className="text-xs text-[#6B7280]">Halo,</span>
                    <span className="text-sm font-semibold text-[#1F2937] line-clamp-1 max-w-[100px]">{user.name}</span>
                  </div>
                </Link>
                {user.role !== "supplier" ? (
                    <Link href="/buka-toko" className="hidden md:block text-xs font-semibold text-[#1A3C6E] hover:underline ml-2 bg-[#F5A623]/10 px-3 py-1.5 rounded-full border border-[#F5A623]/20">
                      Buka Toko Gratis
                    </Link>
                ) : (
                    <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-1.5 text-xs font-bold text-white bg-[#2ECC8B] hover:bg-[#27AE60] transition-colors px-3.5 py-1.5 rounded-full ml-2 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                      Seller Center
                    </a>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm font-semibold">
                <Link href="/login" className="px-4 py-2 border border-[#1A3C6E] text-[#1A3C6E] rounded-full hover:bg-[#F7F8FA] transition-colors">
                  Masuk
                </Link>
                <Link href="/register" className="px-4 py-2 bg-[#1A3C6E] text-white rounded-full hover:bg-[#2A5FA0] transition-colors">
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
      
      {/* Mobile Search Bar (Only visible on small screens) */}
      <div className="px-4 pb-3 md:hidden">
        <form className="relative w-full" action="/search" method="GET">
            <input 
              type="text" 
              name="q"
              placeholder="Cari produk di Belio..." 
              className="w-full bg-[#F7F8FA] border border-[#E5E7EB] text-[#1F2937] text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-[#1A3C6E] transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </form>
      </div>
    </nav>
  );
}

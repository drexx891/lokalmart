"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import type { Category, User } from "@/types";

interface NavbarProps {
  categories: Category[];
  cartCount?: number;
  user?: User | null;
}

export default function Navbar({ categories, cartCount = 0, user }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerClosing, setDrawerClosing] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const pathname = usePathname();
  const catDropdownRef = useRef<HTMLDivElement>(null);

  // Close drawer on route change
  useEffect(() => {
    closeDrawer();
  }, [pathname]);

  // Close category dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target as Node)) {
        setCatDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const closeDrawer = () => {
    if (!drawerOpen) return;
    setDrawerClosing(true);
    setTimeout(() => {
      setDrawerOpen(false);
      setDrawerClosing(false);
    }, 250);
  };

  const openDrawer = () => {
    setDrawerOpen(true);
    setDrawerClosing(false);
  };

  return (
    <>
      <nav className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 md:gap-8">
          
          {/* Kiri: Hamburger (Mobile) + Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Hamburger Button - Mobile Only */}
            <button 
              onClick={openDrawer}
              className="lg:hidden p-1.5 -ml-1.5 text-[#1F2937] hover:text-[#1A3C6E] transition-colors"
              aria-label="Buka menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <Logo size="md" />
          </div>

          {/* Tengah: Search Bar (Desktop) */}
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
          <div className="flex items-center gap-4 md:gap-6 shrink-0 text-[#1F2937]">
            
            {/* Chat Icon */}
            <Link href="/pesan" className="relative hover:text-[#1A3C6E] transition-colors hidden md:block" aria-label="Pesan">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </Link>

            {/* Cart Icon */}
            <Link href="/keranjang" className="relative hover:text-[#1A3C6E] transition-colors" aria-label="Keranjang">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-[#E24B4A] text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold px-1 animate-badge-pulse">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Desktop: User Area */}
            <div className="hidden md:flex items-center gap-3 border-l border-[#E5E7EB] pl-6 ml-2">
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
                    <div className="hidden lg:flex flex-col">
                      <span className="text-xs text-[#6B7280]">Halo,</span>
                      <span className="text-sm font-semibold text-[#1F2937] line-clamp-1 max-w-[100px]">{user.name}</span>
                    </div>
                  </Link>
                  {user.role !== "supplier" ? (
                      <Link href="/buka-toko" className="hidden lg:block text-xs font-semibold text-[#1A3C6E] hover:underline ml-2 bg-[#F5A623]/10 px-3 py-1.5 rounded-full border border-[#F5A623]/20">
                        Buka Toko Gratis
                      </Link>
                  ) : (
                      <a href={process.env.NEXT_PUBLIC_SELLER_CENTER_URL || "http://localhost:3001"} target="_blank" rel="noopener noreferrer" className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-white bg-[#2ECC8B] hover:bg-[#27AE60] transition-colors px-3.5 py-1.5 rounded-full ml-2 shadow-sm">
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
        
        {/* Mobile Search Bar */}
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

        {/* Desktop: Category Navigation Bar */}
        <div className="hidden lg:block border-t border-[#E5E7EB]" ref={catDropdownRef}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1 h-10">
              {/* Kategori Dropdown Trigger */}
              <button 
                onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                className="flex items-center gap-1.5 px-3 h-full text-sm font-semibold text-[#1F2937] hover:text-[#1A3C6E] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                Semua Kategori
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-200 ${catDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>

              <div className="w-px h-5 bg-[#E5E7EB]"></div>

              {/* Quick Category Links */}
              <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar flex-1">
                {categories.slice(0, 8).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/kategori/${cat.id}`}
                    className="px-3 h-full flex items-center text-xs font-medium text-[#6B7280] hover:text-[#1A3C6E] hover:bg-[#EBF2FA] transition-colors whitespace-nowrap rounded"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Category Dropdown Panel */}
          {catDropdownOpen && (
            <div className="absolute left-0 right-0 bg-white border-t border-b border-[#E5E7EB] shadow-lg z-40 animate-slide-up">
              <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-4 gap-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/kategori/${cat.id}`}
                      onClick={() => setCatDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#EBF2FA] transition-colors group"
                    >
                      <div className="w-10 h-10 bg-[#F7F8FA] rounded-lg flex items-center justify-center text-lg group-hover:bg-[#1A3C6E] group-hover:text-white transition-colors">
                        {cat.icon || "📦"}
                      </div>
                      <span className="text-sm font-medium text-[#1F2937] group-hover:text-[#1A3C6E]">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ===== Mobile Slide-Out Drawer ===== */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Overlay */}
          <div 
            className={`absolute inset-0 bg-black/50 ${drawerClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
            onClick={closeDrawer}
          />
          
          {/* Drawer Panel */}
          <div className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-[340px] bg-white flex flex-col shadow-2xl ${drawerClosing ? 'animate-slide-out-left' : 'animate-slide-in-left'}`}>
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
              <Logo size="md" />
              <button 
                onClick={closeDrawer}
                className="p-1.5 text-[#6B7280] hover:text-[#1F2937] transition-colors"
                aria-label="Tutup menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* User Info Area */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#1A3C6E] to-[#2A5FA0]">
              {user ? (
                <Link href="/profil" onClick={closeDrawer} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white font-bold text-lg border border-white/30 overflow-hidden">
                    {(user as any).avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={(user as any).avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <div>
                    <div className="text-white font-bold text-base">{user.name || "Pengguna"}</div>
                    <div className="text-blue-100 text-xs">{user.email}</div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/login" onClick={closeDrawer} className="px-4 py-1.5 bg-white text-[#1A3C6E] rounded-full text-sm font-bold hover:bg-gray-100 transition-colors">
                      Masuk
                    </Link>
                    <Link href="/register" onClick={closeDrawer} className="px-4 py-1.5 border border-white/50 text-white rounded-full text-sm font-bold hover:bg-white/10 transition-colors">
                      Daftar
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Menu Items */}
            <nav className="flex-1 overflow-y-auto py-2">
              <DrawerMenuItem href="/" label="Beranda" onClick={closeDrawer} isActive={pathname === "/"} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>} />

              <DrawerMenuItem href="/kategori" label="Kategori" onClick={closeDrawer} isActive={pathname.startsWith("/kategori")} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>} />

              <DrawerMenuItem href="/promo" label="Promo & Voucher" onClick={closeDrawer} isActive={pathname.startsWith("/promo") || pathname.startsWith("/voucher")} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>} badge="HOT" badgeColor="bg-[#E24B4A]" />

              <DrawerMenuItem href="/pesan" label="Pesan" onClick={closeDrawer} isActive={pathname.startsWith("/pesan")} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>} />

              <DrawerMenuItem href="/keranjang" label="Keranjang" onClick={closeDrawer} isActive={pathname.startsWith("/keranjang")} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>} badge={cartCount > 0 ? String(cartCount) : undefined} badgeColor="bg-[#E24B4A]" />

              <div className="border-t border-[#E5E7EB] my-2 mx-5"></div>

              <DrawerMenuItem href="/profil/pesanan" label="Pesanan Saya" onClick={closeDrawer} isActive={pathname.startsWith("/profil/pesanan")} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>} />

              <DrawerMenuItem href="/profil/wishlist" label="Wishlist" onClick={closeDrawer} isActive={pathname.startsWith("/profil/wishlist")} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>} />

              <DrawerMenuItem href="/profil/voucher" label="Voucher Saya" onClick={closeDrawer} isActive={pathname.startsWith("/profil/voucher")} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>} />

              <div className="border-t border-[#E5E7EB] my-2 mx-5"></div>

              {/* Seller Section */}
              {user && user.role === "supplier" ? (
                <DrawerMenuItem href={process.env.NEXT_PUBLIC_SELLER_CENTER_URL || "http://localhost:3001"} label="Seller Center" onClick={closeDrawer} isActive={false} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>} badge="PRO" badgeColor="bg-[#2ECC8B]" external />
              ) : (
                <DrawerMenuItem href="/buka-toko" label="Mulai Berjualan" onClick={closeDrawer} isActive={pathname.startsWith("/buka-toko")} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>} badge="GRATIS" badgeColor="bg-[#F5A623]" />
              )}

              <DrawerMenuItem href="/info/faq" label="Bantuan" onClick={closeDrawer} isActive={pathname.startsWith("/info")} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>} />
            </nav>

            {/* Drawer Footer */}
            {user && (
              <div className="px-5 py-4 border-t border-[#E5E7EB]">
                <a 
                  href="/api/auth/logout"
                  className="flex items-center gap-3 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Keluar
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ===== Drawer Menu Item Component ===== */
function DrawerMenuItem({ href, label, onClick, isActive, icon, badge, badgeColor, external }: {
  href: string;
  label: string;
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  external?: boolean;
}) {
  const Tag = external ? 'a' : Link;
  const extraProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Tag
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
        isActive 
          ? 'text-[#1A3C6E] bg-[#EBF2FA] font-bold border-r-3 border-[#1A3C6E]' 
          : 'text-[#4B5563] hover:bg-[#F7F8FA] hover:text-[#1A3C6E]'
      }`}
      {...extraProps}
    >
      <span className={isActive ? 'text-[#1A3C6E]' : 'text-[#9CA3AF]'}>{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className={`${badgeColor || 'bg-[#E24B4A]'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
          {badge}
        </span>
      )}
      {external && (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#9CA3AF]"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      )}
    </Tag>
  );
}

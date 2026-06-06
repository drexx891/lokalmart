"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNav({ cartCount = 0 }: { cartCount?: number }) {
    const pathname = usePathname();
    
    // Hide bottom nav on specific routes
    if (pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/buka-toko') || pathname.includes('/checkout')) {
        return null;
    }

    const navItems = [
        {
            name: "Beranda",
            href: "/",
            icon: (active: boolean) => (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            )
        },
        {
            name: "Kategori",
            href: "/kategori",
            icon: (active: boolean) => (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
            )
        },
        {
            name: "Promo",
            href: "/promo",
            icon: (active: boolean) => (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
            )
        },
        {
            name: "Pesan",
            href: "/pesan",
            icon: (active: boolean) => (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            )
        },
        {
            name: "Akun",
            href: "/profil",
            icon: (active: boolean) => (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            )
        }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] h-16 flex items-center justify-around z-50 lg:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-safe">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                    <Link 
                        key={item.name} 
                        href={item.href}
                        className={`relative flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${isActive ? 'text-[#1A3C6E]' : 'text-[#9CA3AF]'}`}
                    >
                        {/* Active Indicator Dot */}
                        {isActive && (
                            <div className="absolute top-1 w-1 h-1 rounded-full bg-[#1A3C6E] animate-bounce-in"></div>
                        )}
                        
                        <div className={`relative ${isActive ? 'opacity-100' : 'opacity-60'} transition-opacity`}>
                            {item.icon(isActive)}
                            
                            {/* Badge for Cart */}
                            {item.name === "Pesan" && cartCount > 0 && (
                                <span className="absolute -top-1 -right-1.5 bg-[#E24B4A] text-white text-[8px] min-w-[14px] h-[14px] flex items-center justify-center rounded-full font-bold px-0.5">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </div>
                        
                        <span className={`text-[10px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}

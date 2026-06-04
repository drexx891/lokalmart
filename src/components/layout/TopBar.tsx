import Link from "next/link";

export default function TopBar() {
  return (
    <div className="bg-[#F7F8FA] text-[#6B7280] text-xs py-1.5 px-4 hidden md:flex justify-between items-center border-b border-[#E5E7EB]">
      {/* Kiri */}
      <div className="flex items-center gap-4">
        <span>Platform Perdagangan Aman dengan Produk Berkualitas</span>
      </div>

      {/* Kanan */}
      <div className="flex items-center gap-4">
        <Link href="/info/cara-belanja" className="hover:text-[#1A3C6E] transition-colors">
          Panduan Pembeli
        </Link>
        <span className="text-[#E5E7EB]">|</span>
        <Link href="/info/faq" className="hover:text-[#1A3C6E] transition-colors flex items-center gap-1">
          Cara Kerja
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </Link>
        <span className="text-[#E5E7EB]">|</span>
        <Link href="/info/keamanan-dana" className="hover:text-[#1A3C6E] transition-colors flex items-center gap-1">
          Keamanan Dana
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="bg-[#1A3C6E] text-white pt-16 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-[#2A5FA0] pb-10">
        
        {/* Kolom 1: Tentang Belio */}
        <div className="flex flex-col items-start gap-4">
          <Logo size="lg" theme="dark" />
          <p className="text-sm text-gray-300 leading-relaxed mt-2">
            Belio adalah marketplace terpercaya di Indonesia yang menghubungkan pembeli retail dan grosir dengan supplier terbaik secara langsung. Belanja lebih cerdas, lebih percaya.
          </p>
        </div>

        {/* Kolom 2: Layanan Pembeli */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-[#F5A623]">Layanan Pembeli</h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-300">
            <li><Link href="#" className="hover:text-[#F5A623] transition-colors">Bantuan Pelanggan</Link></li>
            <li><Link href="#" className="hover:text-[#F5A623] transition-colors">Metode Pembayaran</Link></li>
            <li><Link href="#" className="hover:text-[#F5A623] transition-colors">Pelacakan Pesanan</Link></li>
            <li><Link href="#" className="hover:text-[#F5A623] transition-colors">Kebijakan Pengembalian</Link></li>
            <li><Link href="#" className="hover:text-[#F5A623] transition-colors">Garansi Belio</Link></li>
          </ul>
        </div>

        {/* Kolom 3: Jual di Belio */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-[#F5A623]">Jual di Belio</h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-300">
            <li><Link href="/buka-toko" className="hover:text-[#F5A623] transition-colors">Pusat Edukasi Seller</Link></li>
            <li><Link href="/buka-toko" className="hover:text-[#F5A623] transition-colors">Mulai Berjualan (Gratis)</Link></li>
            <li><Link href="#" className="hover:text-[#F5A623] transition-colors">Mitra Logistik</Link></li>
            <li><Link href="#" className="hover:text-[#F5A623] transition-colors">Kebijakan Komisi</Link></li>
          </ul>
        </div>

        {/* Kolom 4: Ikuti Kami */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-[#F5A623]">Ikuti Kami</h3>
          <div className="flex gap-4">
            <Link href="#" className="w-10 h-10 bg-[#2A5FA0] rounded-full flex items-center justify-center hover:bg-[#F5A623] hover:text-[#1A3C6E] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </Link>
            <Link href="#" className="w-10 h-10 bg-[#2A5FA0] rounded-full flex items-center justify-center hover:bg-[#F5A623] hover:text-[#1A3C6E] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </Link>
            <Link href="#" className="w-10 h-10 bg-[#2A5FA0] rounded-full flex items-center justify-center hover:bg-[#F5A623] hover:text-[#1A3C6E] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </Link>
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2 text-gray-300">Pembayaran Aman</h4>
            <div className="flex gap-2">
                <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center text-[8px] font-bold text-[#1A3C6E]">BCA</div>
                <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center text-[8px] font-bold text-[#1A3C6E]">GOPAY</div>
                <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center text-[8px] font-bold text-[#1A3C6E]">QRIS</div>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 text-center text-sm text-gray-400">
        © 2025 Belio. Hak cipta dilindungi.
      </div>
    </footer>
  );
}

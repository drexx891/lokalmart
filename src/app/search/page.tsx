import { prisma } from "@/lib/prisma";
import FilterSidebar from "@/components/search/FilterSidebar";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "Sepatu Sneaker";

  // Ambil data produk (Mock atau Real)
  const products = await prisma.product.findMany({
    where: {
      name: { contains: query, mode: "insensitive" }
    },
    include: { supplier: true },
    take: 12
  });

  // Data produk yang dimodifikasi untuk UI mockup (rating, diskon, dll)
  const enrichedProducts = products.map((p, index) => {
    // Menambahkan field dummy untuk kebutuhan tampilan UI saja
    const isMockLocal = index % 3 === 0;
    const mockRating = (4 + Math.random()).toFixed(1);
    const mockDiscount = index === 0 ? 30 : index === 3 ? 15 : null;
    const mockOriginalPrice = mockDiscount ? p.price * (100 / (100 - mockDiscount)) : null;

    return {
        ...p,
        originalPrice: mockOriginalPrice || undefined,
        discount: mockDiscount || undefined,
        rating: parseFloat(mockRating),
        reviewsCount: Math.floor(Math.random() * 200) + 10,
        soldCount: Math.floor(Math.random() * 500) + 50,
        location: isMockLocal ? "Bengkulu" : "Jakarta Selatan",
        isLocal: isMockLocal,
        isNew: index === 1,
        isBestSeller: index === 2,
    };
  });

  return (
    <div className="bg-[#F7F8FA] min-h-screen pb-20">
      
      {/* Sticky Search Bar Khusus Halaman Pencarian */}
      <div className="bg-[#1A3C6E] text-white sticky top-0 z-40 border-b border-[#2A5FA0] shadow-md hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
            <div className="flex-1 relative">
                <input 
                    type="text" 
                    defaultValue={query}
                    placeholder="Cari produk di Belio..." 
                    className="w-full bg-white text-[#1F2937] text-sm rounded-full pl-5 pr-14 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F5A623] transition-all"
                />
                <button className="absolute right-1 top-1 bottom-1 bg-[#F5A623] text-[#1A3C6E] px-4 rounded-full flex items-center justify-center font-bold hover:bg-[#e09612] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
            </div>
            
            {/* Chip Kategori Populer */}
            <div className="hidden lg:flex items-center gap-3 shrink-0 text-[11px] font-medium">
                <span className="text-blue-200">Populer:</span>
                <Link href="#" className="bg-[#2A5FA0] hover:bg-white hover:text-[#1A3C6E] px-3 py-1 rounded-full transition-colors border border-transparent hover:border-[#1A3C6E]">Kopi Bubuk</Link>
                <Link href="#" className="bg-[#2A5FA0] hover:bg-white hover:text-[#1A3C6E] px-3 py-1 rounded-full transition-colors border border-transparent hover:border-[#1A3C6E]">Seragam</Link>
                <Link href="#" className="bg-[#2A5FA0] hover:bg-white hover:text-[#1A3C6E] px-3 py-1 rounded-full transition-colors border border-transparent hover:border-[#1A3C6E]">Plastik Kemasan</Link>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        
        {/* Breadcrumb & Title */}
        <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <nav className="flex items-center gap-2 text-[11px] font-medium text-[#6B7280] mb-2">
                    <Link href="/" className="hover:text-[#1A3C6E]">Beranda</Link>
                    <span>›</span>
                    <Link href="/kategori" className="hover:text-[#1A3C6E]">Kategori</Link>
                    <span>›</span>
                    <span className="text-[#1A3C6E] capitalize">{query}</span>
                </nav>
                <h1 className="text-sm text-[#4B5563]">
                    Menampilkan 1–{enrichedProducts.length} dari {enrichedProducts.length + 120} produk untuk <span className="font-bold text-[#1A3C6E]">"{query}"</span>
                </h1>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
            
            {/* Sidebar Filter (Kiri) */}
            <FilterSidebar />

            {/* Area Kanan (Produk) */}
            <div className="flex-1 w-full min-w-0">
                
                {/* Active Filters Bar */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                    <span className="text-xs font-semibold text-[#6B7280] mr-2">Filter Aktif:</span>
                    <div className="bg-[#EBF2FA] text-[#1A3C6E] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 border border-[#BFDBFE]">
                        Rp 150rb – 500rb 
                        <button className="hover:text-[#E24B4A]"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                    </div>
                    <div className="bg-[#EBF2FA] text-[#1A3C6E] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 border border-[#BFDBFE]">
                        Bengkulu
                        <button className="hover:text-[#E24B4A]"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                    </div>
                    <button className="text-xs font-bold text-[#E24B4A] hover:underline ml-2">Reset semua filter</button>
                </div>

                {/* Sort Bar */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-2 mb-6 flex items-center justify-between shadow-sm overflow-x-auto hide-scrollbar">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#6B7280] ml-2 mr-1">Urutkan:</span>
                        <button className="bg-[#1A3C6E] text-white text-xs font-bold px-4 py-2 rounded-lg shrink-0">Paling Relevan</button>
                        <button className="bg-white text-[#4B5563] text-xs font-semibold px-4 py-2 rounded-lg border border-[#D1D5DB] hover:border-[#1A3C6E] hover:text-[#1A3C6E] shrink-0 transition-colors">Terbaru</button>
                        <button className="bg-white text-[#4B5563] text-xs font-semibold px-4 py-2 rounded-lg border border-[#D1D5DB] hover:border-[#1A3C6E] hover:text-[#1A3C6E] shrink-0 transition-colors">Terlaris</button>
                        <button className="bg-white text-[#4B5563] text-xs font-semibold px-4 py-2 rounded-lg border border-[#D1D5DB] hover:border-[#1A3C6E] hover:text-[#1A3C6E] shrink-0 transition-colors">Harga Termurah</button>
                    </div>
                    
                    {/* View Toggle (Grid/List) */}
                    <div className="hidden lg:flex items-center gap-1 border-l border-[#E5E7EB] pl-3 ml-3 shrink-0">
                        <button className="p-1.5 bg-[#EBF2FA] text-[#1A3C6E] rounded-md"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg></button>
                        <button className="p-1.5 text-[#9CA3AF] hover:text-[#1A3C6E] rounded-md transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></button>
                    </div>
                </div>

                {/* Grid Produk */}
                {enrichedProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                            {enrichedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-12 flex justify-center">
                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 rounded-xl border border-[#D1D5DB] flex items-center justify-center text-[#9CA3AF] disabled:opacity-50 bg-white" disabled><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                                <button className="w-10 h-10 rounded-xl bg-[#1A3C6E] flex items-center justify-center text-white font-bold shadow-md shadow-[#1A3C6E]/20">1</button>
                                <button className="w-10 h-10 rounded-xl border border-[#D1D5DB] flex items-center justify-center text-[#4B5563] font-semibold hover:border-[#1A3C6E] hover:text-[#1A3C6E] transition-colors bg-white">2</button>
                                <button className="w-10 h-10 rounded-xl border border-[#D1D5DB] flex items-center justify-center text-[#4B5563] font-semibold hover:border-[#1A3C6E] hover:text-[#1A3C6E] transition-colors bg-white">3</button>
                                <span className="text-[#9CA3AF] mx-1">...</span>
                                <button className="w-10 h-10 rounded-xl border border-[#D1D5DB] flex items-center justify-center text-[#4B5563] font-semibold hover:border-[#1A3C6E] hover:text-[#1A3C6E] transition-colors bg-white">42</button>
                                <button className="w-10 h-10 rounded-xl border border-[#D1D5DB] flex items-center justify-center text-[#4B5563] hover:border-[#1A3C6E] hover:text-[#1A3C6E] transition-colors bg-white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-2xl border border-[#E5E7EB] py-24 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-24 h-24 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
                        </div>
                        <h2 className="text-xl font-bold text-[#1F2937] mb-2">Produk tidak ditemukan</h2>
                        <p className="text-[#6B7280] max-w-sm mb-8">Kami tidak dapat menemukan produk yang sesuai dengan filter atau kata kunci pencarian Anda. Coba ubah kata kunci atau hapus beberapa filter.</p>
                        <div className="flex gap-4">
                            <button className="px-6 py-2.5 bg-[#1A3C6E] text-white font-bold rounded-lg hover:bg-[#2A5FA0] transition-colors">Hapus Semua Filter</button>
                            <button className="px-6 py-2.5 border border-[#1A3C6E] text-[#1A3C6E] font-bold rounded-lg hover:bg-[#EBF2FA] transition-colors">Coba Pencarian Lain</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
}

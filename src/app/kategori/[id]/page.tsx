import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Ambil kategori yang sedang dibuka
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          supplier: true
        }
      }
    }
  });

  // Jika kategori tidak ditemukan, return 404
  if (!category) {
    notFound();
  }

  // Ambil juga daftar kategori lain untuk sidebar (limit 5)
  const otherCategories = await prisma.category.findMany({
    where: { id: { not: id } },
    take: 5
  });

  return (
    <div className="bg-[#F7F8FA] min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumbs */}
        <div className="text-sm text-[#6B7280] mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#1A3C6E] transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-[#9CA3AF]">Kategori</span>
          <span>/</span>
          <span className="text-[#1F2937] font-medium">{category.name}</span>
        </div>

        {/* Header Kategori */}
        <div className="bg-white p-6 border border-[#E5E7EB] rounded-sm mb-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-[#EBF2FA] text-[#1A3C6E] rounded-full flex items-center justify-center shrink-0">
            {/* Default Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#1F2937] mb-1">{category.name}</h1>
            <p className="text-sm text-[#6B7280]">
              Menampilkan {category.products.length} produk terverifikasi dari pabrik dan supplier tangan pertama.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar Kiri - Filter (B2B Style) */}
          <div className="w-full lg:w-[260px] shrink-0">
            <div className="bg-white border border-[#E5E7EB] rounded-sm">
              
              {/* Filter: Kategori Terkait */}
              <div className="p-4 border-b border-[#E5E7EB]">
                <h3 className="font-bold text-[#1F2937] mb-3">Kategori Terkait</h3>
                <ul className="flex flex-col gap-2 text-sm text-[#6B7280]">
                  {otherCategories.map(cat => (
                    <li key={cat.id}>
                      <Link href={`/kategori/${cat.id}`} className="hover:text-[#1A3C6E] transition-colors">
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Filter: Tipe Pemasok */}
              <div className="p-4 border-b border-[#E5E7EB]">
                <h3 className="font-bold text-[#1F2937] mb-3">Tipe Pemasok</h3>
                <label className="flex items-center gap-2 text-sm text-[#6B7280] cursor-pointer mb-2">
                  <input type="checkbox" className="accent-[#1A3C6E] w-4 h-4" defaultChecked />
                  Verified Supplier
                </label>
                <label className="flex items-center gap-2 text-sm text-[#6B7280] cursor-pointer">
                  <input type="checkbox" className="accent-[#1A3C6E] w-4 h-4" />
                  OEM / ODM Pabrik
                </label>
              </div>

              {/* Filter: Minimum Order */}
              <div className="p-4 border-b border-[#E5E7EB]">
                <h3 className="font-bold text-[#1F2937] mb-3">Minimum Order (MOQ)</h3>
                <select className="w-full border border-[#E5E7EB] rounded-sm px-3 py-2 text-sm text-[#1F2937] outline-none focus:border-[#1A3C6E]">
                  <option>Semua MOQ</option>
                  <option>&lt; 100 Pcs</option>
                  <option>100 - 500 Pcs</option>
                  <option>&gt; 500 Pcs</option>
                </select>
              </div>

              {/* Filter: Harga */}
              <div className="p-4 border-b border-[#E5E7EB]">
                <h3 className="font-bold text-[#1F2937] mb-3">Rentang Harga (Rp)</h3>
                <div className="flex items-center gap-2 mb-3">
                  <input type="number" placeholder="Min" className="w-full border border-[#E5E7EB] rounded-sm px-2 py-1.5 text-sm outline-none focus:border-[#1A3C6E]" />
                  <span className="text-[#9CA3AF]">-</span>
                  <input type="number" placeholder="Max" className="w-full border border-[#E5E7EB] rounded-sm px-2 py-1.5 text-sm outline-none focus:border-[#1A3C6E]" />
                </div>
                <button className="w-full bg-[#F7F8FA] text-[#1F2937] text-sm font-bold py-2 rounded-sm hover:bg-[#E5E7EB] transition-colors border border-[#E5E7EB]">
                  Terapkan
                </button>
              </div>
            </div>
          </div>

          {/* Area Kanan - Produk */}
          <div className="flex-1">
            
            {/* Toolbar: Sorting & View Options */}
            <div className="bg-white border border-[#E5E7EB] rounded-sm p-3 mb-4 flex justify-between items-center text-sm">
              <div className="flex items-center gap-4 text-[#6B7280]">
                <span className="font-medium text-[#1F2937]">Urutkan:</span>
                <button className="text-[#1A3C6E] font-bold">Relevansi</button>
                <button className="hover:text-[#1A3C6E] transition-colors">Terbaru</button>
                <button className="hover:text-[#1A3C6E] transition-colors">Harga</button>
              </div>
              <div className="text-[#9CA3AF] hidden sm:block">
                Menampilkan hasil pencarian untuk &ldquo;{category.name}&rdquo;
              </div>
            </div>

            {/* Grid Produk */}
            {category.products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.products.map((product) => (
                  <Link href={`/produk/${product.id}`} key={product.id} className="group">
                    <div className="bg-white border border-[#E5E7EB] rounded-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all h-full flex flex-col hover:border-[#1A3C6E]/50">
                      
                      {/* Image Container */}
                      <div className="aspect-square relative overflow-hidden bg-[#F7F8FA] flex items-center justify-center p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={product.imageUrl || "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&q=80"} 
                          alt={product.name}
                          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Info Container */}
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-sm text-[#1F2937] font-medium line-clamp-2 mb-2 group-hover:text-[#1A3C6E] transition-colors leading-snug h-10">
                          {product.name}
                        </h3>
                        
                        <div className="text-[#1A3C6E] font-bold text-lg leading-none mb-1">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
                        </div>
                        <div className="text-xs text-[#9CA3AF] mb-3">
                          / {product.unit.toLowerCase()}
                        </div>

                        <div className="text-xs text-[#6B7280] font-medium mb-4 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3C6E]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                          Min. {product.minOrder} {product.unit}
                        </div>

                        {/* Footer Card */}
                        <div className="mt-auto pt-3 border-t border-[#f0f0f0]">
                          <div className="text-xs text-[#9CA3AF] truncate mb-3 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            {product.supplier?.companyName || "Verified Supplier"}
                          </div>
                          <button className="w-full border border-[#1A3C6E] text-[#1A3C6E] bg-white hover:bg-[#EBF2FA] text-sm font-bold py-1.5 rounded-sm transition-colors">
                            Pesan Sekarang
                          </button>
                        </div>
                      </div>

                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white border border-[#E5E7EB] py-16 text-[#9CA3AF]">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <p>Belum ada produk di kategori ini.</p>
              </div>
            )}

            {/* Pagination B2B Style */}
            {category.products.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex border border-[#E5E7EB] rounded-sm overflow-hidden bg-white">
                  <button className="px-4 py-2 text-sm text-[#9CA3AF] hover:bg-[#F7F8FA] transition-colors border-r border-[#E5E7EB] disabled:opacity-50" disabled>
                    Prev
                  </button>
                  <button className="px-4 py-2 text-sm font-bold bg-[#1A3C6E] text-white">1</button>
                  <button className="px-4 py-2 text-sm text-[#6B7280] hover:bg-[#F7F8FA] transition-colors border-l border-[#E5E7EB]">2</button>
                  <button className="px-4 py-2 text-sm text-[#6B7280] hover:bg-[#F7F8FA] transition-colors border-l border-[#E5E7EB]">3</button>
                  <span className="px-4 py-2 text-sm text-[#9CA3AF] border-l border-[#E5E7EB]">...</span>
                  <button className="px-4 py-2 text-sm text-[#6B7280] hover:bg-[#F7F8FA] transition-colors border-l border-[#E5E7EB]">
                    Next
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductActions from "@/components/ProductActions";
import ProductDetails from "@/components/ProductDetails";
import ProductShopCard from "@/components/ProductShopCard";
import ProductCard from "@/components/ui/ProductCard";
import ProductViewTracker from "@/components/ProductViewTracker";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      supplier: true,
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Related products for cross-selling
  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } },
    include: { supplier: true },
    take: 4,
  });

  const sameStoreProducts = await prisma.product.findMany({
    where: { supplierId: product.supplierId, NOT: { id: product.id } },
    include: { supplier: true },
    take: 4,
  });

  // Data Mockup untuk UI
  const mockOriginalPrice = product.price * 1.3;
  const mockRating = 4.8;
  const mockReviewsCount = 156;
  const mockSoldCount = 842;
  const mockLocation = "Jakarta Selatan";

  return (
    <div className="bg-[#F7F8FA] min-h-screen pb-20">
      {/* Tracking: catat view produk */}
      <ProductViewTracker productId={product.id} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] font-medium text-[#6B7280] mb-6">
            <Link href="/" className="hover:text-[#1A3C6E]">Beranda</Link>
            <span>›</span>
            <Link href="/kategori" className="hover:text-[#1A3C6E]">Kategori</Link>
            <span>›</span>
            {product.category && (
                <>
                    <Link href={`/kategori/${product.category.id}`} className="hover:text-[#1A3C6E]">{product.category.name}</Link>
                    <span>›</span>
                </>
            )}
            <span className="text-[#1F2937] truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm mb-8">
            
            {/* Kolom Kiri: Galeri Foto */}
            <div className="w-full lg:w-[40%] shrink-0">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F7F8FA] border border-[#E5E7EB] mb-4">
                    {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                        </div>
                    )}
                    <button className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors text-[#1A3C6E]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    </button>
                </div>
                
                {/* Thumbnails */}
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                    <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 border-[#1A3C6E] relative">
                        {product.imageUrl ? <Image src={product.imageUrl} alt="thumb" fill sizes="64px" className="object-cover" /> : <div className="w-full h-full bg-[#F3F4F6]"></div>}
                    </div>
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-[#D1D5DB] hover:border-[#9CA3AF] cursor-pointer transition-colors relative">
                            {product.imageUrl ? <Image src={product.imageUrl} alt="thumb" fill sizes="64px" className="object-cover opacity-50 hover:opacity-100 transition-opacity" /> : <div className="w-full h-full bg-[#F3F4F6]"></div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Kolom Kanan: Info Produk */}
            <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-[#1F2937] leading-snug mb-3">{product.name}</h1>
                
                <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <span className="font-bold text-[#1F2937]">{mockRating}</span>
                        <span className="text-[#6B7280]">({mockReviewsCount} ulasan)</span>
                    </div>
                    <div className="w-px h-4 bg-[#D1D5DB]"></div>
                    <div className="text-[#6B7280]"><strong className="text-[#1F2937]">{mockSoldCount}</strong> terjual</div>
                </div>

                {/* Harga dan Opsi kini dihandle oleh ProductActions */}

                {/* Pengiriman (Shipping) */}
                <div className="mb-6 flex gap-4 items-start pb-6 border-b border-[#E8E8E8]">
                    <span className="w-24 shrink-0 text-sm font-medium text-[#757575] mt-1">Pengiriman</span>
                    <div className="flex-1">
                        <div className="flex items-start gap-2 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2ECC8B" strokeWidth="2"><path d="M5 13l4 4L19 7"></path></svg>
                            <div>
                                <div className="text-sm font-semibold text-[#333333] flex items-center gap-1">
                                    Garansi tiba Besok <span className="text-xs text-[#757575] font-normal">{'>'}</span>
                                </div>
                                <div className="text-[11px] text-[#757575]">Dapatkan Voucher s/d Rp10.000 jika pesanan terlambat.</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EE4D2D" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
                            <span className="text-sm text-[#333333]">Proteksi Kerusakan +</span>
                        </div>
                    </div>
                </div>

                {/* Atur Jumlah, Variasi, & Actions */}
                <ProductActions 
                    productId={product.id} 
                    stock={product.stock} 
                    minOrder={product.minOrder} 
                    unit={product.unit} 
                    basePrice={product.price}
                    originalPrice={mockOriginalPrice}
                    isPreOrder={product.isPreOrder}
                    preOrderDays={product.preOrderDays}
                    customOptionsRaw={product.customOptions}
                    variants={product.variants}
                />

            </div>
        </div>

        {/* Info Toko Lengkap */}
        <ProductShopCard supplier={product.supplier} />

        {/* Tab & Info Lengkap */}
        <ProductDetails product={product} />

        {/* Cross Selling 1: Dari Toko yang Sama */}
        {sameStoreProducts.length > 0 && (
            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#1F2937]">Lainnya dari Toko Ini</h2>
                    <Link href="#" className="text-sm font-bold text-[#1A3C6E] hover:underline">Lihat Semua</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {sameStoreProducts.map(p => {
                        const mockP = {
                            ...p,
                            rating: 4.9,
                            reviewsCount: 45,
                            soldCount: 120,
                            location: mockLocation,
                            isLocal: true,
                        };
                        return <ProductCard key={mockP.id} product={mockP} />;
                    })}
                </div>
            </div>
        )}

        {/* Cross Selling 2: Produk Serupa */}
        {relatedProducts.length > 0 && (
            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#1F2937]">Pilihan Produk Serupa</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {relatedProducts.map((p, idx) => {
                        const mockP = {
                            ...p,
                            rating: 4.7,
                            reviewsCount: 89,
                            soldCount: 300,
                            location: idx % 2 === 0 ? "Jakarta" : "Bandung",
                            discount: idx === 1 ? 10 : undefined,
                            originalPrice: idx === 1 ? p.price * 1.1 : undefined
                        };
                        return <ProductCard key={mockP.id} product={mockP} />;
                    })}
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

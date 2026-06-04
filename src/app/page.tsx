import HeroSection from "@/components/home/HeroSection";
import ProductSection from "@/components/home/ProductSection";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import DirectoryFooter from "@/components/home/DirectoryFooter";
import QuickActions from "@/components/home/QuickActions";
import { prisma } from "@/lib/prisma";
import type { FlashSale, FlashSaleItem, Product } from "@/types";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Ambil 8 kategori utama untuk tampilan homepage
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    take: 19
  });

  // Ambil Flash Sale yang sedang aktif
  const now = new Date();
  let activeFlashSale = await prisma.flashSale.findFirst({
    where: {
      isActive: true,
      startTime: { lte: now },
      endTime: { gte: now }
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  // Ambil semua produk untuk grid produk unggulan
  const products = await prisma.product.findMany({
    include: {
      supplier: true
    },
    take: 24, // 24 produk untuk unggulan
    orderBy: {
      createdAt: 'desc'
    }
  });

  // MOCK DATA: Jika tidak ada flash sale aktif di database, tampilkan data dummy untuk keperluan showcase UI
  if (!activeFlashSale) {
    // Gunakan target waktu tetap (akhir minggu ini) agar tidak reset saat di-refresh
    const endOfWeek = new Date();
    const daysUntilSunday = 7 - endOfWeek.getDay();
    endOfWeek.setDate(endOfWeek.getDate() + (daysUntilSunday === 0 ? 0 : daysUntilSunday));
    endOfWeek.setHours(23, 59, 59, 999);
    
    // Gunakan produk dari database jika ada, jika tidak buat hardcoded dummy
    const sourceProducts = products.length > 0 ? [...products, ...products, ...products] : Array(8).fill(null).map((_, i) => ({
      id: `fallback-product-${i}`,
      name: `Produk Promo Spesial ${i+1}`,
      price: 150000 + (i * 25000),
      imageUrl: `https://loremflickr.com/500/500/product?random=${i}`
    }));

    activeFlashSale = {
      id: "dummy-flash-sale",
      title: "Flash Deal Spesial",
      startTime: now,
      endTime: endOfWeek,
      isActive: true,
      bannerUrl: null,
      createdAt: now,
      updatedAt: now,
      items: sourceProducts.slice(0, 8).map((p, index) => ({
        id: `dummy-fs-item-${index}`,
        flashSaleId: "dummy-flash-sale",
        productId: p.id,
        discountPrice: Math.floor(p.price * 0.4), // Diskon 60%
        stock: 50,
        sold: Math.floor(Math.random() * 40) + 5,
        product: p
      }))
    } as any;
  }

  // Ambil produk rekomendasi (skip 24 pertama agar berbeda dari produk unggulan)
  const recommendedProducts = await prisma.product.findMany({
    include: {
      supplier: true
    },
    take: 24, // 24 produk untuk rekomendasi
    skip: 24, // Melewati 24 produk unggulan
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="bg-[#F7F8FA] min-h-screen">
      
      {/* Area Atas: Hero (Promo) & Menu Akses Cepat */}
      <HeroSection />
      <QuickActions />

      {/* Banner Flash Sale (Jika Ada) */}
      <FlashSaleSection flashSale={activeFlashSale as any} />

      {/* Grid Kategori & Produk Unggulan */}
      <ProductSection 
        categories={categories}
        products={products}
        recommendedProducts={recommendedProducts}
      />

      {/* Direktori Kategori Raksasa (SEO Footer) */}
      <DirectoryFooter />

    </div>
  );
}
import HeroSection from "@/components/home/HeroSection";
import ProductSection from "@/components/home/ProductSection";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import DirectoryFooter from "@/components/home/DirectoryFooter";
import QuickActions from "@/components/home/QuickActions";
import EventBanner from "@/components/home/EventBanner";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Ambil kategori untuk navigasi
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    take: 19
  });

  // === PRODUK RANKING DINAMIS (dari metrics) ===
  const products = await prisma.product.findMany({
    where: { status: 'active', stock: { gt: 0 } },
    include: {
      supplier: true,
      metrics: true,
    },
    take: 24,
  });

  // Sort berdasarkan ranking score
  const rankedProducts = products
    .map(p => {
      const m = p.metrics;
      let score = m
        ? (m.views * 0.1) + (m.clicks * 0.3) + (m.purchases * 5) + (m.avgRating * 20) + (m.conversionRate * 100)
        : 0;
      
      if ((p as any).isSponsored) score += 1000000; // Boost roket untuk sponsor
        
      return { ...p, rankScore: score };
    })
    .sort((a, b) => b.rankScore - a.rankScore);

  // === FLASH SALE ===
  const now = new Date();
  let activeFlashSale = await prisma.flashSale.findFirst({
    where: {
      isActive: true,
      startTime: { lte: now },
      endTime: { gte: now }
    },
    include: {
      items: { include: { product: true } }
    }
  });

  // Fallback flash sale dari Event system
  if (!activeFlashSale) {
    const flashEvent = await prisma.event.findFirst({
      where: {
        type: 'flash_sale',
        isActive: true,
        startTime: { lte: now },
        endTime: { gte: now },
      },
      include: {
        products: {
          include: { product: true },
          orderBy: { featuredPosition: 'asc' },
        }
      }
    });

    if (flashEvent) {
      activeFlashSale = {
        id: flashEvent.id,
        title: flashEvent.aiTitle || flashEvent.name,
        startTime: flashEvent.startTime,
        endTime: flashEvent.endTime,
        isActive: true,
        bannerUrl: null,
        createdAt: flashEvent.createdAt,
        updatedAt: flashEvent.updatedAt,
        items: flashEvent.products.map((ep, i) => ({
          id: ep.id,
          flashSaleId: flashEvent.id,
          productId: ep.productId,
          discountPrice: Math.round(ep.product.price * (1 - ep.discountPercent / 100)),
          stock: ep.product.stock,
          sold: Math.floor(Math.random() * 40) + 5,
          product: ep.product,
        })),
      } as any;
    }
  }

  // Fallback mock data jika tidak ada flash sale sama sekali
  if (!activeFlashSale || (activeFlashSale.items && activeFlashSale.items.length === 0)) {
    const endOfWeek = new Date();
    const daysUntilSunday = 7 - endOfWeek.getDay();
    endOfWeek.setDate(endOfWeek.getDate() + (daysUntilSunday === 0 ? 0 : daysUntilSunday));
    endOfWeek.setHours(23, 59, 59, 999);
    
    const sourceProducts = products.length > 0 ? products : Array(8).fill(null).map((_, i) => ({
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
        discountPrice: Math.floor(p.price * 0.4),
        stock: 50,
        sold: Math.floor(Math.random() * 40) + 5,
        product: p
      }))
    } as any;
  }

  // === EVENTS AKTIF (untuk banner) ===
  const activeEvents = await prisma.event.findMany({
    where: {
      isActive: true,
      startTime: { lte: now },
      endTime: { gte: now },
      type: { not: 'flash_sale' }, // flash_sale sudah ditampilkan di atas
    },
    include: {
      products: {
        include: { product: { select: { id: true, name: true, price: true, imageUrl: true } } },
        orderBy: { featuredPosition: 'asc' },
        take: 4,
      }
    },
    take: 3,
  });

  // === PRODUK REKOMENDASI (skip ranking, ambil yang lain) ===
  const recommendedProducts = await prisma.product.findMany({
    where: { status: 'active', stock: { gt: 0 } },
    include: { supplier: true, metrics: true },
    take: 24,
    skip: 24,
    orderBy: [
      { isSponsored: 'desc' },
      { metrics: { purchases: 'desc' } }
    ],
  });

  return (
    <div className="bg-[#F7F8FA] min-h-screen">
      
      {/* Area Atas: Hero (Promo) & Menu Akses Cepat */}
      <HeroSection />
      <QuickActions />

      {/* Event Banners (Campaign, Seasonal) */}
      {activeEvents.length > 0 && (
        <EventBanner events={activeEvents as any} />
      )}

      {/* Banner Flash Sale */}
      <FlashSaleSection flashSale={activeFlashSale as any} />

      {/* Grid Kategori & Produk Unggulan (Ranked) */}
      <ProductSection 
        categories={categories}
        products={rankedProducts}
        recommendedProducts={recommendedProducts.length > 0 ? recommendedProducts : rankedProducts.slice(12)}
      />

      {/* Direktori Kategori Raksasa (SEO Footer) */}
      <DirectoryFooter />

    </div>
  );
}
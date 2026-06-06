// POST /api/ai/recommend
// Kirim data user ke Claude AI, terima rekomendasi produk yang dipersonalisasi
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getPersonalizedProducts, rankProductsForHomepage } from '@/lib/ai-engine';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const mode = body.mode || 'personalize'; // 'personalize' atau 'rank'
    const limit = Math.min(body.limit || 20, 50);

    // === MODE 1: Personalisasi per user ===
    if (mode === 'personalize' && user) {
      // Ambil behavior history user (30 hari terakhir)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const behaviorHistory = await prisma.userBehavior.findMany({
        where: {
          userId: user.id,
          timestamp: { gte: thirtyDaysAgo },
        },
        orderBy: { timestamp: 'desc' },
        take: 50,
        select: {
          productId: true,
          actionType: true,
          timestamp: true,
        }
      });

      // Ambil produk yang tersedia
      const availableProducts = await prisma.product.findMany({
        where: { status: 'active', stock: { gt: 0 } },
        select: { id: true, name: true, price: true, categoryId: true, description: true },
        take: 100,
      });

      // Kirim ke Claude AI
      const result = await getPersonalizedProducts(
        user.id,
        behaviorHistory.map(b => ({
          productId: b.productId || '',
          actionType: b.actionType,
          timestamp: b.timestamp,
        })),
        availableProducts
      );

      // Ambil produk berdasarkan urutan dari AI
      let personalizedProducts;
      if (result.productIds.length > 0) {
        const productsMap = new Map();
        const products = await prisma.product.findMany({
          where: { id: { in: result.productIds } },
          include: {
            supplier: { select: { companyName: true, verified: true } },
            category: { select: { name: true } },
            metrics: true,
          }
        });
        products.forEach(p => productsMap.set(p.id, p));
        
        // Urutkan sesuai rekomendasi AI
        personalizedProducts = result.productIds
          .map(id => productsMap.get(id))
          .filter(Boolean)
          .slice(0, limit);
      } else {
        // Fallback: produk terpopuler
        personalizedProducts = await prisma.product.findMany({
          where: { status: 'active', stock: { gt: 0 } },
          include: {
            supplier: { select: { companyName: true, verified: true } },
            category: { select: { name: true } },
            metrics: true,
          },
          orderBy: { metrics: { purchases: 'desc' } },
          take: limit,
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          products: personalizedProducts,
          reasoning: result.reasoning,
          source: result.productIds.length > 0 ? 'ai_personalized' : 'fallback_popular',
        }
      });
    }

    // === MODE 2: Ranking global produk ===
    if (mode === 'rank') {
      const products = await prisma.product.findMany({
        where: { status: 'active', stock: { gt: 0 } },
        select: { id: true, name: true, price: true, categoryId: true },
        take: 50,
      });

      const metrics = await prisma.productMetrics.findMany({
        where: { productId: { in: products.map(p => p.id) } },
        select: {
          productId: true,
          views: true,
          clicks: true,
          purchases: true,
          avgRating: true,
          conversionRate: true,
        }
      });

      const result = await rankProductsForHomepage(products, metrics);

      return NextResponse.json({
        success: true,
        data: {
          rankings: result.rankings.slice(0, limit),
          source: 'ai_ranked',
        }
      });
    }

    // === Guest user tanpa personalisasi ===
    const popularProducts = await prisma.product.findMany({
      where: { status: 'active', stock: { gt: 0 } },
      include: {
        supplier: { select: { companyName: true, verified: true } },
        category: { select: { name: true } },
        metrics: true,
      },
      orderBy: { metrics: { purchases: 'desc' } },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: {
        products: popularProducts,
        reasoning: 'Guest user — menampilkan produk terpopuler',
        source: 'popular_default',
      }
    });

  } catch (error) {
    console.error('[API] /api/ai/recommend error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mendapatkan rekomendasi' },
      { status: 500 }
    );
  }
}

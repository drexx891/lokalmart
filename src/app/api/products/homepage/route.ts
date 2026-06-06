// GET /api/products/homepage
// Ambil produk untuk homepage dengan ranking otomatis berdasarkan metrics
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || undefined;
    const sort = searchParams.get('sort') || 'ranking'; // ranking, newest, price_asc, price_desc, best_seller
    const skip = (page - 1) * limit;

    // Base filter: hanya produk aktif dengan stok > 0
    const where: Record<string, unknown> = {
      status: 'active',
      stock: { gt: 0 },
    };

    if (category) {
      where.categoryId = category;
    }

    // Tentukan sorting berdasarkan parameter
    let orderBy: Record<string, unknown>[] = [];

    switch (sort) {
      case 'newest':
        orderBy = [{ createdAt: 'desc' }];
        break;
      case 'price_asc':
        orderBy = [{ price: 'asc' }];
        break;
      case 'price_desc':
        orderBy = [{ price: 'desc' }];
        break;
      case 'best_seller':
        // Urutkan berdasarkan purchases di metrics
        orderBy = [{ metrics: { purchases: 'desc' } }];
        break;
      case 'ranking':
      default:
        // Ranking gabungan: views + purchases + rating
        // Prisma tidak support computed sort, jadi kita query lalu sort di memori
        break;
    }

    // Ambil produk dengan metrics
    const products = await prisma.product.findMany({
      where,
      include: {
        supplier: {
          select: { id: true, companyName: true, verified: true, rating: true, city: true }
        },
        category: {
          select: { id: true, name: true, slug: true }
        },
        metrics: true,
      },
      orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
      skip,
      take: limit,
    });

    // Jika sort = ranking, hitung score dan urutkan
    let rankedProducts = products;
    if (sort === 'ranking') {
      rankedProducts = products
        .map(product => {
          const m = product.metrics;
          // Formula ranking: (views * 0.1) + (clicks * 0.3) + (purchases * 5) + (rating * 20)
          const score = m
            ? (m.views * 0.1) + (m.clicks * 0.3) + (m.purchases * 5) + (m.avgRating * 20) + (m.conversionRate * 100)
            : 0;

          return { ...product, rankScore: Math.round(score * 100) / 100 };
        })
        .sort((a, b) => b.rankScore - a.rankScore);
    }

    // Total count untuk pagination
    const totalCount = await prisma.product.count({ where });

    return NextResponse.json({
      success: true,
      data: {
        products: rankedProducts,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: skip + limit < totalCount,
        },
      },
    });
  } catch (error) {
    console.error('[API] /api/products/homepage error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat produk homepage' },
      { status: 500 }
    );
  }
}

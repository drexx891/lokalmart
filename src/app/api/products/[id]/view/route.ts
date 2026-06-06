// POST /api/products/[id]/view
// Catat view/klik/interaksi user untuk update metrics produk
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const body = await request.json().catch(() => ({}));
    const actionType = body.actionType || 'view'; // "view", "click", "add_to_cart"
    const metadata = body.metadata || null;

    // Validasi: produk harus ada
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Produk tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update ProductMetrics (atomic increment)
    const updateData: Record<string, unknown> = {};
    if (actionType === 'view') {
      updateData.views = { increment: 1 };
    } else if (actionType === 'click') {
      updateData.clicks = { increment: 1 };
    } else if (actionType === 'purchase') {
      updateData.purchases = { increment: 1 };
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.productMetrics.upsert({
        where: { productId },
        update: updateData,
        create: {
          productId,
          views: actionType === 'view' ? 1 : 0,
          clicks: actionType === 'click' ? 1 : 0,
          purchases: actionType === 'purchase' ? 1 : 0,
          conversionRate: 0,
          avgRating: 0,
          totalRevenue: 0,
        }
      });
    }

    // Catat user behavior (jika user terautentikasi)
    const user = await getCurrentUser().catch(() => null);
    if (user) {
      await prisma.userBehavior.create({
        data: {
          userId: user.id,
          productId,
          actionType,
          metadata,
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] /api/products/[id]/view error:', error);
    // Jangan error ke client untuk tracking — silent fail
    return NextResponse.json({ success: true });
  }
}

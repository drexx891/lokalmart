// GET /api/events/active
// Ambil semua event yang sedang aktif (waktu sekarang berada di antara startTime dan endTime)
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();

    const activeEvents = await prisma.event.findMany({
      where: {
        isActive: true,
        startTime: { lte: now },
        endTime: { gte: now },
      },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                stock: true,
                supplier: {
                  select: { companyName: true }
                },
              }
            }
          },
          orderBy: { featuredPosition: 'asc' },
        },
      },
      orderBy: [
        { type: 'asc' }, // flash_sale first
        { startTime: 'desc' },
      ],
    });

    // Hitung harga diskon untuk setiap produk dalam event
    const eventsWithPricing = activeEvents.map(event => ({
      ...event,
      products: event.products.map(ep => ({
        ...ep,
        discountedPrice: Math.round(ep.product.price * (1 - ep.discountPercent / 100)),
        savings: Math.round(ep.product.price * ep.discountPercent / 100),
      })),
    }));

    return NextResponse.json({
      success: true,
      data: eventsWithPricing,
      count: eventsWithPricing.length,
    });
  } catch (error) {
    console.error('[API] /api/events/active error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat event aktif' },
      { status: 500 }
    );
  }
}

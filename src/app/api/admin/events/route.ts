// POST /api/admin/events — Buat event baru
// PUT /api/admin/events — Update event
// DELETE /api/admin/events — Hapus event
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { generateEventBanner } from '@/lib/ai-engine';

async function verifyAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return null;
  return user;
}

export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { name, type, startTime, endTime, configJson, productIds, discounts } = body;

    if (!name || !type || !startTime || !endTime) {
      return NextResponse.json({ success: false, message: 'Nama, tipe, dan tanggal wajib diisi.' }, { status: 400 });
    }

    // Generate AI banner content (opsional — jika ANTHROPIC_API_KEY tersedia)
    let aiContent: { title: string; subtitle: string; cta: string } | null = null;
    if (process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes('ISI_DENGAN')) {
      try {
        aiContent = await generateEventBanner({
          name, type,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          maxDiscount: configJson?.maxDiscount,
          description: configJson?.description,
          productCount: productIds?.length,
        });
      } catch {
        // Abaikan jika AI gagal
      }
    }

    // Buat event
    const event = await prisma.event.create({
      data: {
        name,
        type,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        isActive: true,
        configJson: configJson || null,
        aiTitle: aiContent?.title || null,
        aiSubtitle: aiContent?.subtitle || null,
        aiCta: aiContent?.cta || null,
      }
    });

    // Tambahkan produk ke event
    if (productIds && Array.isArray(productIds)) {
      for (let i = 0; i < productIds.length; i++) {
        await prisma.eventProduct.create({
          data: {
            eventId: event.id,
            productId: productIds[i],
            discountPercent: discounts?.[i] || 10,
            featuredPosition: i + 1,
          }
        });
      }
    }

    // Ambil event lengkap
    const fullEvent = await prisma.event.findUnique({
      where: { id: event.id },
      include: {
        products: {
          include: { product: { select: { id: true, name: true, price: true, imageUrl: true } } },
          orderBy: { featuredPosition: 'asc' },
        },
      },
    });

    return NextResponse.json({ success: true, data: fullEvent }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/admin/events error:', error);
    return NextResponse.json({ success: false, message: 'Gagal membuat event' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, isActive, name, type, startTime, endTime, configJson } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID event wajib.' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (configJson) updateData.configJson = configJson;

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        products: {
          include: { product: { select: { id: true, name: true, price: true, imageUrl: true } } },
        },
      },
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error('[API] PUT /api/admin/events error:', error);
    return NextResponse.json({ success: false, message: 'Gagal update event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID event wajib.' }, { status: 400 });
    }

    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Event berhasil dihapus' });
  } catch (error) {
    console.error('[API] DELETE /api/admin/events error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus event' }, { status: 500 });
  }
}

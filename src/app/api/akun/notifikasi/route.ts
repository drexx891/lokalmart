// API Route: /api/akun/notifikasi
// GET: Ambil preferensi notifikasi
// PUT: Update preferensi (optimistic update dari client)
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: 'Belum login' }, { status: 401 });

    let prefs = await prisma.userNotificationPrefs.findUnique({ where: { userId: user.id } });

    // Auto-create jika belum ada
    if (!prefs) {
      prefs = await prisma.userNotificationPrefs.create({
        data: { userId: user.id }
      });
    }

    return NextResponse.json({ success: true, data: prefs });
  } catch (error) {
    console.error('[API] GET /api/akun/notifikasi error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memuat preferensi' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: 'Belum login' }, { status: 401 });

    const body = await request.json();
    const { emailOrder, emailPromo, pushNotification } = body;

    const prefs = await prisma.userNotificationPrefs.upsert({
      where: { userId: user.id },
      update: {
        ...(typeof emailOrder === 'boolean' && { emailOrder }),
        ...(typeof emailPromo === 'boolean' && { emailPromo }),
        // emailSecurity selalu true, tidak bisa diubah
        ...(typeof pushNotification === 'boolean' && { pushNotification }),
      },
      create: {
        userId: user.id,
        emailOrder: emailOrder ?? true,
        emailPromo: emailPromo ?? true,
        pushNotification: pushNotification ?? false,
      }
    });

    return NextResponse.json({ success: true, data: prefs });
  } catch (error) {
    console.error('[API] PUT /api/akun/notifikasi error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memperbarui preferensi' }, { status: 500 });
  }
}

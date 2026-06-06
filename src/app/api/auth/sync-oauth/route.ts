import { NextResponse } from 'next/server';
import { supabasePublic } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, avatarUrl } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email missing' }, { status: 400 });
    }

    // Sinkronisasi dengan database lokal Prisma
    let localUser = await prisma.user.findUnique({
      where: { email },
    });

    if (localUser && (localUser.role === 'admin' || localUser.role === 'supplier')) {
      return NextResponse.json({ success: false, message: `Akses ditolak: Akun ${localUser.role} tidak dapat masuk menggunakan Google/Facebook di portal utama.` }, { status: 403 });
    }

    if (!localUser) {
      // Buat user baru jika belum ada
      localUser = await prisma.user.create({
        data: {
          email,
          name,
          avatarUrl,
          role: 'user',
        },
      });
    } else if (!localUser.avatarUrl && avatarUrl) {
      // Update avatar jika sebelumnya kosong
      localUser = await prisma.user.update({
        where: { email },
        data: { avatarUrl },
      });
    }

    // Buat Iron Session agar aplikasi utama mengenali user ini
    const ironSession = await getSession();
    ironSession.userId = localUser.id;
    ironSession.role = localUser.role;
    ironSession.isLoggedIn = true;
    await ironSession.save();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Sync OAuth Error:", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

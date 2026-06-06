// API Route: /api/akun/keamanan
// PUT: Ubah password
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import bcrypt from 'bcrypt';

export async function PUT(request: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ success: false, message: 'Belum login' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ success: false, message: 'Semua field wajib diisi.' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ success: false, message: 'Konfirmasi password tidak cocok.' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, message: 'Password baru minimal 8 karakter.' }, { status: 400 });
    }

    // Ambil user dengan password
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { password: true },
    });

    if (!user?.password) {
      return NextResponse.json({ success: false, message: 'Akun ini tidak menggunakan password.' }, { status: 400 });
    }

    // Verifikasi password saat ini
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Password saat ini salah.' }, { status: 403 });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: sessionUser.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true, message: 'Password berhasil diubah!' });
  } catch (error) {
    console.error('[API] PUT /api/akun/keamanan error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengubah password' }, { status: 500 });
  }
}

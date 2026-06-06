// API Route: /api/akun/username-check
// GET: Cek ketersediaan username real-time
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username')?.toLowerCase().replace(/\s/g, '');

  if (!username || username.length < 3) {
    return NextResponse.json({ available: false, message: 'Username minimal 3 karakter' });
  }

  const sessionUser = await getCurrentUser();
  const existing = await prisma.user.findFirst({
    where: { username, NOT: sessionUser ? { id: sessionUser.id } : undefined }
  });

  return NextResponse.json({
    available: !existing,
    message: existing ? 'Username sudah digunakan' : 'Username tersedia!',
  });
}

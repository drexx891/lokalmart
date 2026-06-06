// API Route: /api/akun/profil
// GET: Ambil data profil lengkap
// PUT: Update profil (nama, username, phone, gender, birthDate, bio)
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ success: false, message: 'Belum login' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true, name: true, username: true, email: true, phone: true,
        role: true, avatarUrl: true, gender: true, birthDate: true,
        bio: true, isVerified: true, lastLoginAt: true, createdAt: true,
      }
    });

    const primaryAddress = await prisma.address.findFirst({
      where: { userId: sessionUser.id, isPrimary: true },
    });

    return NextResponse.json({ success: true, data: { user, primaryAddress } });
  } catch (error) {
    console.error('[API] GET /api/akun/profil error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memuat profil' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ success: false, message: 'Belum login' }, { status: 401 });
    }

    const body = await request.json();
    const { name, username, phone, gender, birthDate, bio } = body;

    // Validasi username (unique, lowercase, no spaces)
    if (username) {
      const cleanUsername = username.toLowerCase().replace(/\s/g, '');
      if (cleanUsername.length < 3 || cleanUsername.length > 30) {
        return NextResponse.json({ success: false, message: 'Username harus 3-30 karakter.' }, { status: 400 });
      }
      if (!/^[a-z0-9._]+$/.test(cleanUsername)) {
        return NextResponse.json({ success: false, message: 'Username hanya boleh huruf kecil, angka, titik, dan underscore.' }, { status: 400 });
      }
      const existing = await prisma.user.findFirst({
        where: { username: cleanUsername, NOT: { id: sessionUser.id } }
      });
      if (existing) {
        return NextResponse.json({ success: false, message: 'Username sudah digunakan.' }, { status: 409 });
      }
    }

    // Validasi bio
    if (bio && bio.length > 150) {
      return NextResponse.json({ success: false, message: 'Bio maksimal 150 karakter.' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (username !== undefined) updateData.username = username.toLowerCase().replace(/\s/g, '');
    if (phone !== undefined) updateData.phone = phone;
    if (gender !== undefined) updateData.gender = gender;
    if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null;
    if (bio !== undefined) updateData.bio = bio;

    const updatedUser = await prisma.user.update({
      where: { id: sessionUser.id },
      data: updateData,
      select: {
        id: true, name: true, username: true, email: true, phone: true,
        avatarUrl: true, gender: true, birthDate: true, bio: true,
      }
    });

    return NextResponse.json({ success: true, data: updatedUser, message: 'Profil berhasil diperbarui!' });
  } catch (error) {
    console.error('[API] PUT /api/akun/profil error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memperbarui profil' }, { status: 500 });
  }
}

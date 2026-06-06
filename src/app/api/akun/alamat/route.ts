// API Route: /api/akun/alamat
// GET: Ambil semua alamat user
// POST: Tambah alamat baru
// PUT: Update alamat
// DELETE: Hapus alamat
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: 'Belum login' }, { status: 401 });

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, data: addresses });
  } catch (error) {
    console.error('[API] GET /api/akun/alamat error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memuat alamat' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: 'Belum login' }, { status: 401 });

    // Cek limit 5 alamat
    const count = await prisma.address.count({ where: { userId: user.id } });
    if (count >= 5) {
      return NextResponse.json({ success: false, message: 'Maksimal 5 alamat tersimpan.' }, { status: 400 });
    }

    const body = await request.json();
    const { label, recipientName, phone, street, city, province, zipCode, isPrimary } = body;

    if (!recipientName || !phone || !street || !city || !province) {
      return NextResponse.json({ success: false, message: 'Data alamat tidak lengkap.' }, { status: 400 });
    }

    // Jika set primary, unset semua yang lain
    if (isPrimary) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isPrimary: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        label: label || 'Rumah',
        recipientName,
        phone,
        street,
        city,
        province,
        zipCode: zipCode || '',
        isPrimary: isPrimary || count === 0, // Alamat pertama otomatis primary
      }
    });

    return NextResponse.json({ success: true, data: address, message: 'Alamat berhasil ditambahkan!' }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/akun/alamat error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menambah alamat' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: 'Belum login' }, { status: 401 });

    const body = await request.json();
    const { id, label, recipientName, phone, street, city, province, zipCode, isPrimary } = body;

    if (!id) return NextResponse.json({ success: false, message: 'ID alamat wajib.' }, { status: 400 });

    // Verifikasi ownership
    const existing = await prisma.address.findFirst({ where: { id, userId: user.id } });
    if (!existing) return NextResponse.json({ success: false, message: 'Alamat tidak ditemukan.' }, { status: 404 });

    // Jika set primary, unset semua yang lain
    if (isPrimary) {
      await prisma.address.updateMany({
        where: { userId: user.id, NOT: { id } },
        data: { isPrimary: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        ...(label !== undefined && { label }),
        ...(recipientName !== undefined && { recipientName }),
        ...(phone !== undefined && { phone }),
        ...(street !== undefined && { street }),
        ...(city !== undefined && { city }),
        ...(province !== undefined && { province }),
        ...(zipCode !== undefined && { zipCode }),
        ...(isPrimary !== undefined && { isPrimary }),
      }
    });

    return NextResponse.json({ success: true, data: address, message: 'Alamat berhasil diperbarui!' });
  } catch (error) {
    console.error('[API] PUT /api/akun/alamat error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memperbarui alamat' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: 'Belum login' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID alamat wajib.' }, { status: 400 });

    const existing = await prisma.address.findFirst({ where: { id, userId: user.id } });
    if (!existing) return NextResponse.json({ success: false, message: 'Alamat tidak ditemukan.' }, { status: 404 });

    await prisma.address.delete({ where: { id } });

    // Jika yang dihapus primary, set alamat pertama sebagai primary
    if (existing.isPrimary) {
      const firstAddress = await prisma.address.findFirst({ where: { userId: user.id }, orderBy: { createdAt: 'asc' } });
      if (firstAddress) {
        await prisma.address.update({ where: { id: firstAddress.id }, data: { isPrimary: true } });
      }
    }

    return NextResponse.json({ success: true, message: 'Alamat berhasil dihapus!' });
  } catch (error) {
    console.error('[API] DELETE /api/akun/alamat error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus alamat' }, { status: 500 });
  }
}

// POST /api/products/upload
// Seller upload produk baru
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 1. Verifikasi autentikasi
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Silakan login terlebih dahulu.' },
        { status: 401 }
      );
    }

    // 2. Verifikasi role supplier
    if (user.role !== 'supplier' && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Hanya seller yang bisa upload produk.' },
        { status: 403 }
      );
    }

    // 3. Ambil supplier profile
    const supplier = await prisma.supplier.findUnique({
      where: { userId: user.id }
    });

    if (!supplier) {
      return NextResponse.json(
        { success: false, message: 'Profil toko tidak ditemukan. Silakan daftar sebagai seller.' },
        { status: 404 }
      );
    }

    // 4. Parse request body
    const body = await request.json();
    const { name, description, price, stock, imageUrl, categoryId, unit, minOrder, customOptions } = body;

    // 5. Validasi input
    if (!name || !description || !price || price <= 0) {
      return NextResponse.json(
        { success: false, message: 'Nama, deskripsi, dan harga wajib diisi.' },
        { status: 400 }
      );
    }

    if (name.length < 5 || name.length > 200) {
      return NextResponse.json(
        { success: false, message: 'Nama produk harus antara 5-200 karakter.' },
        { status: 400 }
      );
    }

    // 6. Buat produk baru
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: Math.round(Number(price)),
        stock: Math.max(0, parseInt(stock) || 0),
        imageUrl: imageUrl || null,
        categoryId: categoryId || null,
        supplierId: supplier.id,
        unit: unit || 'Pieces',
        minOrder: Math.max(1, parseInt(minOrder) || 1),
        customOptions: customOptions || null,
        status: 'active', // Langsung aktif (bisa diubah jadi 'pending_review' untuk moderasi)
      },
      include: {
        category: { select: { name: true } },
        supplier: { select: { companyName: true } },
      }
    });

    // 7. Auto-create ProductMetrics untuk produk baru
    await prisma.productMetrics.create({
      data: {
        productId: product.id,
        views: 0,
        clicks: 0,
        purchases: 0,
        conversionRate: 0,
        avgRating: 0,
        totalRevenue: 0,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Produk berhasil diunggah!',
      data: product,
    }, { status: 201 });

  } catch (error) {
    console.error('[API] /api/products/upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengunggah produk. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}

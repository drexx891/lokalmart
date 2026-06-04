import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { validateVoucher } from '@/app/actions/voucher';

export async function POST(request: Request) {
  try {
    const { code, totalAmount, shippingCost } = await request.json();
    if (!code) {
      return NextResponse.json({ success: false, message: 'Kode voucher diperlukan' }, { status: 400 });
    }
    const result = await validateVoucher(code, totalAmount || 0, shippingCost || 0);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Voucher apply error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

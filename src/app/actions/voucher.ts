"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import type { Voucher } from '@prisma/client';

export async function validateVoucher(code: string, totalAmount: number, shippingCost: number = 0) {
  const voucher = await prisma.voucher.findUnique({ where: { code: code.toUpperCase() } });
  if (!voucher) {
    return { valid: false, message: 'Voucher tidak ditemukan' };
  }

  const now = new Date();
  if (voucher.startDate > now || voucher.endDate < now) {
    return { valid: false, message: 'Voucher tidak aktif atau sudah kedaluwarsa' };
  }

  if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
    return { valid: false, message: 'Voucher telah mencapai batas penggunaan' };
  }

  if (totalAmount < voucher.minPurchase) {
    return { valid: false, message: `Pembelian minimal Rp${voucher.minPurchase.toLocaleString("id-ID")} diperlukan` };
  }

  // Calculate discount based on type
  let discountProduct = 0;
  let discountShipping = 0;

  if (voucher.type === 'percentage') {
    discountProduct = Math.floor((totalAmount * voucher.value) / 100);
    if (voucher.maxDiscount && discountProduct > voucher.maxDiscount) {
      discountProduct = voucher.maxDiscount;
    }
  } else if (voucher.type === 'nominal') {
    discountProduct = voucher.value;
  } else if (voucher.type === 'free_shipping') {
    discountShipping = shippingCost;
    if (voucher.maxDiscount && discountShipping > voucher.maxDiscount) {
        discountShipping = voucher.maxDiscount;
    }
  }

  // Ensure discount does not exceed total
  if (discountProduct > totalAmount) discountProduct = totalAmount;
  if (discountShipping > shippingCost) discountShipping = shippingCost;

  return { 
      valid: true, 
      discountAmount: discountProduct, 
      discountShipping: discountShipping, 
      voucher 
  };
}

// Untuk pemanggilan dari komponen Checkout langsung
export async function checkVoucher(code: string, totalAmount: number, shippingCost: number) {
    const res = await validateVoucher(code, totalAmount, shippingCost);
    if (!res.valid) {
        return { success: false, message: res.message };
    }
    return { 
        success: true, 
        discountAmount: res.discountAmount, 
        discountShipping: res.discountShipping,
        voucherId: res.voucher?.id,
        voucherType: res.voucher?.type
    };
}

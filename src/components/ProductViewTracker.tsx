"use client";

import { useEffect, useCallback } from "react";

interface ProductViewTrackerProps {
  productId: string;
}

// Komponen ini dipasang di halaman detail produk
// Otomatis kirim event "view" ke /api/products/[id]/view saat mount
export default function ProductViewTracker({ productId }: ProductViewTrackerProps) {
  const trackView = useCallback(async () => {
    try {
      await fetch(`/api/products/${productId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType: 'view', metadata: { source: 'product_detail', timestamp: Date.now() } }),
      });
    } catch {
      // Silent fail — jangan ganggu UX
    }
  }, [productId]);

  useEffect(() => {
    trackView();
  }, [trackView]);

  return null; // Invisible component
}

// Utility function untuk tracking dari event handler (klik produk di homepage, dll)
export async function trackProductClick(productId: string, source: string = 'homepage') {
  try {
    await fetch(`/api/products/${productId}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionType: 'click', metadata: { source } }),
    });
  } catch {
    // Silent fail
  }
}

export async function trackAddToCart(productId: string) {
  try {
    await fetch(`/api/products/${productId}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionType: 'add_to_cart' }),
    });
  } catch {
    // Silent fail
  }
}

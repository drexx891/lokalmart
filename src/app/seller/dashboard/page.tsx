import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import SellerDashboardClient from './SellerDashboardClient';

export const metadata = {
  title: 'Seller Dashboard - Belio',
  description: 'Kelola produk dan toko Anda di Belio',
};

export default async function SellerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'supplier' && user.role !== 'admin') redirect('/buka-toko');

  const supplier = await prisma.supplier.findUnique({
    where: { userId: user.id },
  });

  if (!supplier) redirect('/buka-toko');

  // Ambil data produk milik seller
  const products = await prisma.product.findMany({
    where: { supplierId: supplier.id },
    include: {
      category: { select: { name: true } },
      metrics: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Statistik
  const totalProducts = products.length;
  const totalViews = products.reduce((sum, p) => sum + (p.metrics?.views || 0), 0);
  const totalSales = products.reduce((sum, p) => sum + (p.metrics?.purchases || 0), 0);
  const totalRevenue = products.reduce((sum, p) => sum + (p.metrics?.totalRevenue || 0), 0);
  const avgRating = products.length > 0
    ? Number((products.reduce((sum, p) => sum + (p.metrics?.avgRating || 0), 0) / products.length).toFixed(1))
    : 0;

  // Ambil semua kategori untuk form
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  return (
    <SellerDashboardClient
      supplier={supplier}
      products={JSON.parse(JSON.stringify(products))}
      categories={categories}
      stats={{ totalProducts, totalViews, totalSales, totalRevenue, avgRating }}
    />
  );
}

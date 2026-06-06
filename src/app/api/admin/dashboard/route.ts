import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Get actual counts
        const totalUsers = await prisma.user.count({ where: { role: 'user' } });
        const totalSellers = await prisma.supplier.count();
        const activeProducts = await prisma.product.count({ where: { status: 'active' } });
        
        // Orders today (mock since we don't have an Order table populated yet)
        const ordersToday = 284; // Placeholder
        const revenueToday = 48500000; // Placeholder Rp 48.5M

        // Generate 30 days mock chart data
        const chartData = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            chartData.push({
                date: `${d.getDate()}/${d.getMonth() + 1}`,
                sales: Math.floor(Math.random() * 50) + 10, // random 10-60
                revenue: Math.floor(Math.random() * 10000000) + 5000000,
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                metrics: {
                    totalUsers: totalUsers + totalSellers,
                    activeProducts,
                    ordersToday,
                    revenueToday
                },
                chartData
            }
        });

    } catch (error) {
        console.error('[API] GET /api/admin/dashboard error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

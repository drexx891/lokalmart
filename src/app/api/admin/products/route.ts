import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || undefined;

        const products = await prisma.product.findMany({
            where: {
                ...(status ? { status } : {}),
            },
            include: {
                supplier: {
                    select: { companyName: true }
                },
                category: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, action } = body; // action = 'approve', 'reject', 'suspend'

        let newStatus = 'active';
        if (action === 'reject') newStatus = 'rejected';
        if (action === 'suspend') newStatus = 'inactive';
        if (action === 'approve') newStatus = 'active';

        const updated = await prisma.product.update({
            where: { id },
            data: { status: newStatus }
        });

        return NextResponse.json({ success: true, message: `Status produk diubah menjadi ${newStatus}` });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Gagal update produk' }, { status: 500 });
    }
}

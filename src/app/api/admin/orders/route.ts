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

        const orders = await prisma.order.findMany({
            where: {
                ...(status && status !== 'all' ? { status } : {}),
            },
            include: {
                user: { select: { name: true, email: true } },
                items: {
                    include: { product: { select: { name: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, data: orders });
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
        const { id, action } = body; 

        if (action === 'cancel') {
            await prisma.order.update({
                where: { id },
                data: { status: 'cancelled' }
            });
            return NextResponse.json({ success: true, message: 'Pesanan dibatalkan' });
        }
        
        if (action === 'refund') {
            await prisma.order.update({
                where: { id },
                data: { status: 'refunded' }
            });
            return NextResponse.json({ success: true, message: 'Pesanan direfund' });
        }

        return NextResponse.json({ success: false, message: 'Aksi tidak valid' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Gagal update pesanan' }, { status: 500 });
    }
}

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
        const role = searchParams.get('role') || undefined;

        const users = await prisma.user.findMany({
            where: {
                ...(role && role !== 'all' ? { role } : {}),
            },
            include: {
                supplier: true,
                _count: {
                    select: { orders: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, data: users });
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
        const { id, action } = body; // action = 'suspend', 'activate', 'verify_seller'

        if (action === 'suspend') {
            await prisma.user.update({
                where: { id },
                data: { isSuspended: true }
            });
            return NextResponse.json({ success: true, message: 'Akun ditangguhkan' });
        }

        if (action === 'activate') {
            await prisma.user.update({
                where: { id },
                data: { isSuspended: false }
            });
            return NextResponse.json({ success: true, message: 'Akun diaktifkan' });
        }

        if (action === 'verify_seller') {
            const targetUser = await prisma.user.findUnique({ where: { id }, include: { supplier: true }});
            if (targetUser?.supplier) {
                await prisma.supplier.update({
                    where: { id: targetUser.supplier.id },
                    data: { verified: true }
                });
                return NextResponse.json({ success: true, message: 'Seller berhasil diverifikasi' });
            }
            return NextResponse.json({ success: false, message: 'User bukan seller' }, { status: 400 });
        }

        return NextResponse.json({ success: false, message: 'Aksi tidak valid' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Gagal update user' }, { status: 500 });
    }
}

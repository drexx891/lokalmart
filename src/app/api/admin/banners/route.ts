import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { position: 'asc' }
        });
        return NextResponse.json({ success: true, data: banners });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const banner = await prisma.banner.create({
            data: {
                title: body.title,
                imageUrl: body.imageUrl,
                targetUrl: body.targetUrl,
                position: body.position || 0,
                isPopup: body.isPopup || false,
                isActive: body.isActive !== undefined ? body.isActive : true,
            }
        });

        return NextResponse.json({ success: true, data: banner, message: 'Banner berhasil ditambahkan' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Gagal menambahkan banner' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const banner = await prisma.banner.update({
            where: { id: body.id },
            data: { isActive: body.isActive }
        });

        return NextResponse.json({ success: true, data: banner, message: 'Status banner diperbarui' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Gagal update banner' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

        await prisma.banner.delete({ where: { id } });

        return NextResponse.json({ success: true, message: 'Banner dihapus' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Gagal menghapus banner' }, { status: 500 });
    }
}

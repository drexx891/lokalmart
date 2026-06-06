import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function GET(request: Request) {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const admin = await prisma.user.upsert({
            where: { email: 'admin@belio.id' },
            update: {
                password: hashedPassword,
                role: 'admin',
                pin2FA: '123456',
                isVerified: true
            },
            create: {
                email: 'admin@belio.id',
                name: 'Super Admin',
                password: hashedPassword,
                role: 'admin',
                pin2FA: '123456',
                isVerified: true
            },
        });

        return NextResponse.json({ success: true, message: 'Super Admin seeded', email: admin.email });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to seed' }, { status: 500 });
    }
}

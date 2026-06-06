import { prisma } from './src/lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
    const admin = await prisma.adminUser.findUnique({
        where: { email: 'admin@belio.com' }
    });
    console.log(admin);

    if (admin) {
        const isValid = await bcrypt.compare('password123', admin.password);
        console.log('Password valid?', isValid);
    }
}

main().finally(() => prisma.$disconnect());

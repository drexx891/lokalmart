import { prisma } from './src/lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
    const existingAdmin = await prisma.user.findUnique({
        where: { email: 'admin@belio.com' }
    });

    if (existingAdmin) {
        console.log('Super Admin already exists.');
        return;
    }

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await prisma.user.create({
        data: {
            email: 'admin@belio.com',
            password: hashedPassword,
            name: 'Belio Super Admin',
            role: 'admin',
        }
    });

    console.log('Super Admin created successfully!');
    console.log('Email: admin@belio.com');
    console.log('Password: password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

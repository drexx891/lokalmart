// File: prisma/seed.ts
import { prisma } from '../src/lib/prisma';

async function main() {
    // Bersihkan data produk lama jika ada
    await prisma.product.deleteMany();

    // Masukkan data produk UMKM contoh
    await prisma.product.create({
        data: {
            name: 'Kripik Pisang Cokelat Khas Lampung',
            description: 'Kripik pisang kepok pilihan dengan taburan bubuk cokelat tebal dan lumer di mulut. Camilan legendaris yang manis dan renyah.',
            price: 25000,
            stock: 50,
            imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&q=80',
        },
    });

    await prisma.product.create({
        data: {
            name: 'Kopi Robusta Premium 250g',
            description: 'Biji kopi robusta pilihan dari dataran tinggi Sumatera. Dipanggang dengan tingkat kematangan medium-to-dark, menghasilkan aroma yang kuat dan rasa yang mantap.',
            price: 45000,
            stock: 30,
            imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80',
        },
    });

    await prisma.product.create({
        data: {
            name: 'Sambal Bawang Pedas Nampol',
            description: 'Dibuat dari cabai rawit segar dan bawang merah pilihan tanpa bahan pengawet. Dikemas dengan higienis, siap menemani setiap hidangan Anda.',
            price: 18000,
            stock: 100,
            imageUrl: 'https://images.unsplash.com/photo-1595231712426-63e46a6440b3?w=500&q=80',
        },
    });

    console.log('✅ Seeding berhasil! 3 Produk UMKM telah ditambahkan ke database.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

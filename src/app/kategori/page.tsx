import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

// SVG Icons untuk setiap grup kategori
const Icons = {
    Fashion: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a8.59 8.59 0 0 0-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path></svg>,
    Elektronik: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>,
    Rumah: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Makanan: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>,
    Kecantikan: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="6.5"></line></svg>,
    Anak: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>,
    Olahraga: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>,
    Otomotif: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3"></path><path d="M12 19v3"></path><path d="M22 12h-3"></path><path d="M5 12H2"></path><path d="M19.07 4.93l-2.12 2.12"></path><path d="M7.05 16.95l-2.12 2.12"></path><path d="M19.07 19.07l-2.12-2.12"></path><path d="M7.05 7.05l-2.12-2.12"></path></svg>,
    Pendidikan: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
    Pertanian: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 4 13V9l4 4 4-4v4a7 7 0 0 1-1 7z"></path><path d="M11 20v-3a2 2 0 0 1 2-2h4a5 5 0 0 0 5-5v-5l-4 4-4-4v5a5 5 0 0 0-3 5v3"></path></svg>,
    Kerajinan: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>,
};

// Pengelompokan kategori berdasarkan nama
const CATEGORY_GROUPS: { [key: string]: { title: string; icon: React.ReactNode; keywords: string[] } } = {
    "Fashion & Gaya Hidup": {
        title: "Fashion & Gaya Hidup",
        icon: Icons.Fashion,
        keywords: ["Fashion Wanita", "Fashion Pria", "Sepatu & Tas", "Fashion Muslim"]
    },
    "Elektronik & Gadget": {
        title: "Elektronik & Gadget",
        icon: Icons.Elektronik,
        keywords: ["Handphone & Tablet", "Komputer & Laptop", "Elektronik Rumah"]
    },
    "Rumah Tangga": {
        title: "Rumah Tangga",
        icon: Icons.Rumah,
        keywords: ["Rumah & Dapur", "Perlengkapan Mandi", "Alat Pertukangan", "Bahan Bangunan"]
    },
    "Makanan & Minuman": {
        title: "Makanan & Minuman",
        icon: Icons.Makanan,
        keywords: ["Makanan & Camilan", "Minuman", "Sembako & Bahan Pokok"]
    },
    "Kecantikan & Kesehatan": {
        title: "Kecantikan & Kesehatan",
        icon: Icons.Kecantikan,
        keywords: ["Kecantikan & Skincare", "Kesehatan & Obat", "Perawatan Tubuh"]
    },
    "Ibu & Anak": {
        title: "Ibu & Anak",
        icon: Icons.Anak,
        keywords: ["Ibu & Bayi", "Mainan & Edukasi Anak"]
    },
    "Olahraga & Outdoor": {
        title: "Olahraga & Outdoor",
        icon: Icons.Olahraga,
        keywords: ["Olahraga & Fitness", "Outdoor & Camping"]
    },
    "Otomotif": {
        title: "Otomotif",
        icon: Icons.Otomotif,
        keywords: ["Otomotif & Sparepart"]
    },
    "Pendidikan & ATK": {
        title: "Pendidikan & ATK",
        icon: Icons.Pendidikan,
        keywords: ["Buku & Alat Tulis"]
    },
    "Pertanian & Hewan": {
        title: "Pertanian & Hewan",
        icon: Icons.Pertanian,
        keywords: ["Pertanian & Perkebunan", "Hewan & Perlengkapan"]
    },
    "Kerajinan & Oleh-oleh": {
        title: "Kerajinan & Oleh-oleh",
        icon: Icons.Kerajinan,
        keywords: ["Kerajinan & Handmade", "Souvenir & Oleh-oleh"]
    }
};

export const dynamic = 'force-dynamic';

export default async function KategoriPage() {
    const allCategories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: { select: { products: true } }
        }
    });

    // Kelompokkan kategori
    const grouped = Object.entries(CATEGORY_GROUPS).map(([key, group]) => {
        const cats = allCategories.filter(c => group.keywords.includes(c.name));
        return { ...group, categories: cats };
    }).filter(g => g.categories.length > 0);

    // Kategori yang tidak termasuk kelompok mana pun
    const allGroupedNames = Object.values(CATEGORY_GROUPS).flatMap(g => g.keywords);
    const ungrouped = allCategories.filter(c => !allGroupedNames.includes(c.name));

    return (
        <div className="bg-[#F7F8FA] min-h-screen">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A3C6E] to-[#2A5FA0] py-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-blue-200 mb-3">
                        <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                        <span>/</span>
                        <span className="text-white font-medium">Semua Kategori</span>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">Semua Kategori</h1>
                    <p className="text-blue-100 text-sm">
                        Jelajahi {allCategories.length} kategori produk dari seluruh penjual di Belio
                    </p>
                </div>
            </div>

            {/* Grid Kategori per Kelompok */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-10">
                    {grouped.map((group, idx) => (
                        <div key={idx}>
                            {/* Header Kelompok */}
                            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#1A3C6E]/10">
                                <span className="text-3xl">{group.icon}</span>
                                <h2 className="text-lg font-bold text-[#1F2937]">{group.title}</h2>
                                <span className="text-xs text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
                                    {group.categories.length} kategori
                                </span>
                            </div>

                            {/* Grid Kategori dalam Kelompok */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {group.categories.map((cat: any) => (
                                    <Link
                                        key={cat.id}
                                        href={`/kategori/${cat.id}`}
                                        className="bg-white rounded-xl p-4 border border-[#E5E7EB] hover:border-[#1A3C6E]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group flex flex-col items-center text-center"
                                    >
                                        <div className="w-16 h-16 bg-[#EBF2FA] rounded-2xl flex items-center justify-center mb-3 group-hover:bg-[#D6E4F5] group-hover:scale-110 transition-all duration-200 relative overflow-hidden">
                                            {cat.imageUrl ? (
                                                <Image 
                                                    src={cat.imageUrl} 
                                                    alt={cat.name} 
                                                    fill 
                                                    className="object-cover" 
                                                />
                                            ) : cat.icon ? (
                                                <Image 
                                                    src={cat.icon} 
                                                    alt={cat.name} 
                                                    fill 
                                                    className="object-cover" 
                                                />
                                            ) : (
                                                <span className="text-3xl">📦</span>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-sm text-[#1F2937] group-hover:text-[#1A3C6E] transition-colors mb-1">
                                            {cat.name}
                                        </h3>
                                        <p className="text-[11px] text-[#9CA3AF] line-clamp-2 leading-snug">
                                            {cat.description || "Lihat produk"}
                                        </p>
                                        <span className="mt-2 text-[10px] font-bold text-[#1A3C6E] bg-[#EBF2FA] px-2 py-0.5 rounded-full">
                                            {cat._count?.products || 0} produk
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Kategori Lainnya (jika ada yang tidak terkelompokkan) */}
                    {ungrouped.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#1A3C6E]/10">
                                <span className="text-3xl">📦</span>
                                <h2 className="text-lg font-bold text-[#1F2937]">Kategori Lainnya</h2>
                                <span className="text-xs text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
                                    {ungrouped.length} kategori
                                </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {ungrouped.map((cat: any) => (
                                    <Link
                                        key={cat.id}
                                        href={`/kategori/${cat.id}`}
                                        className="bg-white rounded-xl p-4 border border-[#E5E7EB] hover:border-[#1A3C6E]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group flex flex-col items-center text-center"
                                    >
                                        <div className="w-16 h-16 bg-[#EBF2FA] rounded-2xl flex items-center justify-center mb-3 group-hover:bg-[#D6E4F5] group-hover:scale-110 transition-all duration-200 relative overflow-hidden">
                                            {cat.imageUrl ? (
                                                <Image 
                                                    src={cat.imageUrl} 
                                                    alt={cat.name} 
                                                    fill 
                                                    className="object-cover" 
                                                />
                                            ) : cat.icon ? (
                                                <Image 
                                                    src={cat.icon} 
                                                    alt={cat.name} 
                                                    fill 
                                                    className="object-cover" 
                                                />
                                            ) : (
                                                <span className="text-3xl">📦</span>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-sm text-[#1F2937] group-hover:text-[#1A3C6E] transition-colors mb-1">
                                            {cat.name}
                                        </h3>
                                        <p className="text-[11px] text-[#9CA3AF] line-clamp-2 leading-snug">
                                            {cat.description || "Lihat produk"}
                                        </p>
                                        <span className="mt-2 text-[10px] font-bold text-[#1A3C6E] bg-[#EBF2FA] px-2 py-0.5 rounded-full">
                                            {cat._count?.products || 0} produk
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

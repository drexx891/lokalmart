import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DirectoryFooter() {
    // Menarik Kategori Global dan produk di dalamnya untuk dijadikan 'subs'
    const categories = await prisma.category.findMany({
        include: {
            products: {
                select: { name: true },
                take: 10, // Ambil max 10 produk per kategori untuk ditampilkan sebagai sub-kategori/keyword
            }
        },
        take: 8 // Tampilkan 8 kategori utama di footer
    });

    // Jika database kosong, kita sediakan satu fallback
    const displayData = categories.length > 0 ? categories.map(cat => ({
        main: cat.name,
        subs: cat.products.length > 0 ? cat.products.map(p => p.name) : ["Lihat Semua Produk"]
    })) : [
        {
            main: "BELUM ADA KATEGORI",
            subs: ["Silakan tambahkan kategori dari Admin Panel"]
        }
    ];

    return (
        <div className="bg-white border-t border-[#E5E7EB] pt-12 pb-16">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-xl font-bold text-[#1F2937] mb-8">Kategori LokalMart</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-10">
                    {displayData.map((group, index) => (
                        <div key={index} className="flex flex-col">
                            <h3 className="text-sm font-bold text-[#1F2937] mb-3 uppercase tracking-wide">
                                {group.main}
                            </h3>
                            <p className="text-[12px] leading-relaxed text-[#6B7280]">
                                {group.subs.map((sub, i) => (
                                    <span key={i}>
                                        <Link 
                                            href={`/search?q=${encodeURIComponent(sub)}`}
                                            className="hover:text-[#1A3C6E] hover:underline transition-colors"
                                        >
                                            {sub.length > 25 ? sub.substring(0, 25) + '...' : sub}
                                        </Link>
                                        {i < group.subs.length - 1 && <span className="mx-1.5 text-[#D1D5DB]">|</span>}
                                    </span>
                                ))}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

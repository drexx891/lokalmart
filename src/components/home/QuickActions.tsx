import Link from "next/link";
import Image from "next/image";

import { prisma } from "@/lib/prisma";

export default async function QuickActions() {
    // Gunakan any untuk menghindari error TS di IDE yang belum refresh cache prisma client
    const prismaNavMenu = (prisma as any).navigationMenu;
    let actions = prismaNavMenu ? await prismaNavMenu.findMany({
        where: { isActive: true },
        orderBy: { position: "asc" }
    }) : [];

    if (actions.length === 0) {
        actions = [
            { id: "1", title: "Pusat B2B", href: "/unggulan", iconUrl: "https://cdn-icons-png.flaticon.com/512/2830/2830284.png", position: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { id: "2", title: "LokalMart Mall", href: "/premium", iconUrl: "https://cdn-icons-png.flaticon.com/512/1170/1170678.png", position: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { id: "3", title: "PPOB & Pulsa", href: "/ppob", iconUrl: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png", position: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { id: "4", title: "Flash Sale", href: "/promo", iconUrl: "https://cdn-icons-png.flaticon.com/512/763/763331.png", position: 4, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { id: "5", title: "Grosir Murah", href: "/grosir", iconUrl: "https://cdn-icons-png.flaticon.com/512/2760/2760136.png", position: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { id: "6", title: "Mitra Daerah", href: "/daerah", iconUrl: "https://cdn-icons-png.flaticon.com/512/2771/2771401.png", position: 6, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { id: "7", title: "Diskon 50%", href: "/semua-promo", iconUrl: "https://cdn-icons-png.flaticon.com/512/2950/2950664.png", position: 7, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { id: "8", title: "Gratis Ongkir", href: "/gratis-ongkir", iconUrl: "https://cdn-icons-png.flaticon.com/512/2766/2766141.png", position: 8, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { id: "9", title: "Lokal Barokah", href: "/islami", iconUrl: "https://cdn-icons-png.flaticon.com/512/3004/3004454.png", position: 9, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { id: "10", title: "Semua Kategori", href: "/kategori", iconUrl: "https://cdn-icons-png.flaticon.com/512/2311/2311531.png", position: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
        ];
    }

    return (
        <section className="bg-white pb-6 pt-2 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-start justify-between gap-2 overflow-x-auto pb-4 hide-scrollbar">
                    {actions.map((action: any, i: number) => (
                        <Link 
                            key={i} 
                            href={action.href}
                            className="flex flex-col items-center gap-2 min-w-[72px] md:min-w-[90px] group shrink-0"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center p-2.5 md:p-3 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-[#BFDBFE] transition-all duration-300 relative overflow-hidden">
                                <Image src={action.iconUrl} alt={action.title} width={40} height={40} className="object-contain group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <span className="text-[10px] md:text-xs font-medium text-[#374151] group-hover:text-[#1A3C6E] text-center leading-tight line-clamp-2 px-1">
                                {action.title}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

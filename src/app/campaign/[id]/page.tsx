import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // Type cast prisma to any sementara karena cache TS VS Code belum mendeteksi model baru
    const campaign = await (prisma as any).campaign.findUnique({
        where: { id }
    });

    if (!campaign || !campaign.isActive) {
        notFound();
    }

    // Ambil beberapa produk untuk ditampilkan di bawah campaign
    const products = await (prisma as any).product.findMany({
        take: 8,
        orderBy: { stock: 'desc' }
    });

    return (
        <main className="min-h-screen bg-[#F7F8F9] pb-20">
            {/* Header Campaign */}
            <div 
                className="w-full pt-20 pb-12 px-4 relative overflow-hidden"
                style={{ 
                    background: `linear-gradient(to right, ${campaign.colorFrom || '#1A3C6E'}, ${campaign.colorTo || '#2A5FA0'})` 
                }}
            >
                {/* Motif Latar */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-white/30 rounded-full blur-3xl transform -translate-y-10 translate-x-10"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center text-white">
                    <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        Kembali ke Beranda
                    </Link>
                    
                    <h1 className="text-4xl md:text-5xl font-black mb-4">{campaign.pageTitle || campaign.title}</h1>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto font-medium">{campaign.subtitle}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
                {/* Konten Campaign (Kaya Teks / HTML dari Admin) */}
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 mb-8 border border-gray-100 prose prose-lg max-w-none text-gray-700">
                    {campaign.pageContent ? (
                        <div dangerouslySetInnerHTML={{ __html: campaign.pageContent }} />
                    ) : (
                        <p className="text-center text-gray-500 italic">Belum ada penjelasan detail untuk kampanye ini.</p>
                    )}
                </div>

                {/* Produk Terkait Campaign (Untuk demo, kita tampilkan produk acak/terlaris) */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-[#1F2937]">Spesial Untukmu</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

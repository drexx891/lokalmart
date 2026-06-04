import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

export default async function SupplierProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const supplier = await prisma.supplier.findUnique({
        where: { id },
        include: {
            products: true
        }
    });

    if (!supplier) {
        notFound();
    }

    return (
        <div className="bg-[#F7F8FA] min-h-screen">
            
            {/* Shopee-style Store Header */}
            <div className="bg-white border-b border-[#E5E7EB] shadow-sm mb-4">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        
                        {/* Kiri: Banner/Avatar Area */}
                        <div className="w-full md:w-[400px] h-32 rounded-sm relative overflow-hidden flex-shrink-0 group">
                            {/* Background blur/banner */}
                            <div className="absolute inset-0 bg-[#1F2937]">
                                {supplier.bannerUrl && (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={supplier.bannerUrl} alt="Store Banner" className="w-full h-full object-cover opacity-50 blur-sm scale-110" />
                                )}
                            </div>
                            
                            {/* Overlay Info */}
                            <div className="absolute inset-0 bg-black/40 flex items-center p-4 gap-4">
                                <div className="w-20 h-20 rounded-full border-2 border-white bg-[#F7F8FA] overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {supplier.logoUrl ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={supplier.logoUrl} alt={supplier.companyName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-black text-[#D1D5DB]">{supplier.companyName.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="text-white flex-1 overflow-hidden">
                                    <h1 className="font-bold text-lg truncate drop-shadow-md">{supplier.companyName}</h1>
                                    <div className="text-xs text-white/80 mt-1 flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                        Aktif 5 menit lalu
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <button className="flex-1 border border-white text-white hover:bg-white/20 transition-colors text-xs py-1 rounded-sm flex items-center justify-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                            Chat
                                        </button>
                                        <button className="flex-1 border border-[#1A3C6E] bg-[#1A3C6E] text-white hover:bg-[#2A5FA0] transition-colors text-xs py-1 rounded-sm flex items-center justify-center gap-1 shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                            Ikuti
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Metrics (Shopee Style) */}
                        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8 text-sm py-2">
                            <div className="flex gap-2">
                                <span className="text-[#9CA3AF] flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg> Produk:</span>
                                <span className="text-[#1A3C6E] font-medium">{supplier.products.length}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[#9CA3AF] flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> Pengikut:</span>
                                <span className="text-[#1A3C6E] font-medium">1.2RB</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[#9CA3AF] flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Penilaian:</span>
                                <span className="text-[#1A3C6E] font-medium">4.8 (10RB Penilaian)</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[#9CA3AF] flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> Performa Chat:</span>
                                <span className="text-[#1A3C6E] font-medium">98% (Hitungan Jam)</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[#9CA3AF] flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Bergabung:</span>
                                <span className="text-[#1A3C6E] font-medium">{supplier.yearEstablished ? `Tahun ${supplier.yearEstablished}` : "2 Tahun Lalu"}</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="max-w-7xl mx-auto px-4 mt-2 border-t border-[#f0f0f0]">
                    <div className="flex items-center">
                        <Link href={`/supplier/${supplier.id}`} className="py-4 px-8 border-b-2 border-[#1A3C6E] text-[#1A3C6E] font-medium text-sm">
                            Halaman Toko
                        </Link>
                        <Link href={`/supplier/${supplier.id}`} className="py-4 px-8 border-b-2 border-transparent text-[#6B7280] hover:text-[#1A3C6E] transition-colors font-medium text-sm">
                            Semua Produk
                        </Link>
                        <Link href={`/supplier/${supplier.id}`} className="py-4 px-8 border-b-2 border-transparent text-[#6B7280] hover:text-[#1A3C6E] transition-colors font-medium text-sm hidden sm:block">
                            Profil Perusahaan
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 pb-20">
                <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Sidebar Kategori */}
                    <div className="hidden md:block w-56 shrink-0">
                        <div className="text-sm font-bold text-[#1F2937] mb-4 uppercase tracking-wider flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            Kategori Toko
                        </div>
                        <ul className="text-sm text-[#1F2937] flex flex-col gap-3">
                            <li className="font-bold text-[#1A3C6E]">Pakaian Grosir (14)</li>
                            <li className="hover:text-[#1A3C6E] cursor-pointer">Alat Tulis Kantor (8)</li>
                            <li className="hover:text-[#1A3C6E] cursor-pointer">Bahan Baku (22)</li>
                        </ul>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        
                        {/* Filter Bar Ala Shopee */}
                        <div className="bg-[#F7F8FA] p-3 flex items-center gap-4 mb-4 text-sm border border-[#E5E7EB] rounded-sm">
                            <span className="text-[#6B7280]">Urutkan</span>
                            <button className="bg-[#1A3C6E] text-white px-4 py-1.5 rounded-sm">Populer</button>
                            <button className="bg-white border border-[#E5E7EB] text-[#1F2937] px-4 py-1.5 rounded-sm hover:bg-[#fafafa]">Terbaru</button>
                            <button className="bg-white border border-[#E5E7EB] text-[#1F2937] px-4 py-1.5 rounded-sm hover:bg-[#fafafa]">Terlaris</button>
                            <select className="bg-white border border-[#E5E7EB] text-[#1F2937] px-4 py-1.5 rounded-sm focus:outline-none">
                                <option>Harga</option>
                                <option>Rendah ke Tinggi</option>
                                <option>Tinggi ke Rendah</option>
                            </select>
                        </div>

                        {supplier.products.length === 0 ? (
                            <div className="bg-white border border-[#E5E7EB] p-16 text-center rounded-sm shadow-sm flex flex-col items-center">
                                <div className="w-24 h-24 bg-[#F7F8FA] rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                                </div>
                                <p className="text-[#6B7280] font-medium text-lg">Toko ini belum memiliki produk</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {supplier.products.map(product => (
                                    <Link href={`/produk/${product.id}`} key={product.id} className="bg-white border border-transparent hover:border-[#1A3C6E] hover:-translate-y-1 transition-all flex flex-col shadow-[0_1px_4px_rgba(0,0,0,0.1)] relative">
                                        
                                        {/* Tag Grosir */}
                                        <div className="absolute top-0 right-0 z-10 bg-[#f6a700] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-sm">
                                            Grosir
                                        </div>

                                        <div className="aspect-square bg-[#F7F8FA] w-full relative overflow-hidden flex items-center justify-center">
                                            {product.imageUrl ? (
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span className="text-4xl grayscale opacity-20">📦</span>
                                            )}
                                        </div>
                                        
                                        <div className="p-2 flex flex-col flex-1">
                                            <h3 className="text-[#1F2937] text-xs line-clamp-2 leading-tight mb-2 min-h-[32px]">
                                                {product.name}
                                            </h3>
                                            
                                            <div className="mt-auto">
                                                <div className="text-[#1A3C6E] font-medium mb-1">
                                                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(product.price)}
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] text-[#9CA3AF]">
                                                    <div className="flex items-center gap-0.5 text-[#ffc107]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                                        <span>4.8</span>
                                                    </div>
                                                    <span>1.2RB Terjual</span>
                                                </div>
                                                
                                                <div className="mt-2 text-[10px] bg-[#EBF2FA] text-[#1A3C6E] text-center py-1 rounded-sm border border-[#BFDBFE]">
                                                    MOQ: {product.minOrder || 1} {product.unit}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

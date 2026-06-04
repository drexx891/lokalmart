import Image from "next/image";
import Link from "next/link";

export default function SemuaPromoPage() {
    const promos = [
        {
            id: 1,
            title: "Festival B2B Akhir Tahun",
            desc: "Diskon besar-besaran untuk kebutuhan grosir dan pengadaan alat kantor.",
            imgUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=400&fit=crop",
            date: "Berlaku hingga 31 Desember",
            theme: "from-fuchsia-600 to-purple-600",
            tag: "Mega Sale"
        },
        {
            id: 2,
            title: "Pekan Elektronik Bisnis",
            desc: "Update infrastruktur IT perusahaan Anda dengan harga distributor.",
            imgUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=400&fit=crop",
            date: "Berlaku 1 - 7 Hari Kedepan",
            theme: "from-blue-600 to-sky-500",
            tag: "Flash Sale"
        },
        {
            id: 3,
            title: "Cashback Modal Usaha",
            desc: "Belanja bahan baku bulan ini, nikmati cashback hingga 10% untuk bulan depan.",
            imgUrl: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&h=400&fit=crop",
            date: "Sepanjang Bulan",
            theme: "from-emerald-600 to-teal-500",
            tag: "Cashback"
        }
    ];

    return (
        <div className="bg-[#F7F8FA] min-h-screen py-10">
            <div className="max-w-5xl mx-auto px-4">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 rounded-2xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 opacity-20">
                        <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/><path d="M12 15V3"/><path d="M9 6l3-3 3 3"/><rect x="2" y="12" width="20" height="8" rx="2"/></svg>
                    </div>
                    <div className="relative z-10 text-center py-6">
                        <h1 className="text-3xl md:text-5xl font-black mb-4">
                            Gudang Promo & Event
                        </h1>
                        <p className="text-fuchsia-50 text-lg max-w-2xl mx-auto font-medium">
                            Pusat semua diskon, penawaran khusus, dan kampanye yang sedang berlangsung di LokalMart.
                        </p>
                    </div>
                </div>

                {/* List Banner Promo */}
                <div className="space-y-8">
                    {promos.map(promo => (
                        <div key={promo.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-[#E5E7EB] overflow-hidden group flex flex-col md:flex-row">
                            
                            {/* Gambar Kiri */}
                            <div className="w-full md:w-[45%] h-56 md:h-auto relative overflow-hidden bg-gray-100">
                                <Image src={promo.imgUrl} alt={promo.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className={`absolute top-4 left-4 bg-gradient-to-r ${promo.theme} text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg`}>
                                    {promo.tag}
                                </div>
                            </div>
                            
                            {/* Konten Kanan */}
                            <div className="p-8 md:w-[55%] flex flex-col justify-center">
                                <div className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    {promo.date}
                                </div>
                                <h2 className="text-2xl font-black text-[#1F2937] mb-3 group-hover:text-fuchsia-600 transition-colors">
                                    {promo.title}
                                </h2>
                                <p className="text-[#6B7280] leading-relaxed mb-6">
                                    {promo.desc}
                                </p>
                                <button className="bg-[#1A3C6E] hover:bg-[#2A5FA0] text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors shadow-sm w-fit">
                                    Lihat Penawaran
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

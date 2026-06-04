import Link from "next/link";

// Struktur data yang sama persis dengan yang di-seed
const directoryStructure = [
    {
        main: "ELEKTRONIK",
        subs: [
            "Konsol Game", "Aksesoris Konsol", "Alat Casting", "Foot Bath & Spa",
            "Mesin Jahit", "Setrika Uap", "Purifier", "Penyedot Debu", "Telepon",
            "Mesin Cuci", "Water Heater", "Pendingin Ruangan", "Pengering Sepatu",
            "TV Aksesoris", "Perangkat Dapur", "Lampu", "Kamera Keamanan",
            "Video Game", "Baterai", "Remot Kontrol", "Walkie Talkie", "Media Player"
        ]
    },
    {
        main: "MAKANAN & MINUMAN",
        subs: [
            "Makanan Ringan", "Bahan Pokok", "Menu Sarapan", "Minuman",
            "Susu Olahan", "Makanan Beku", "Roti Kue", "Set Hadiah Hampers",
            "Makanan Kaleng", "Makanan Instan"
        ]
    },
    {
        main: "KOMPUTER & AKSESORIS",
        subs: [
            "Desktop", "Monitor", "Komponen Laptop", "Penyimpanan Data",
            "Komponen Network", "Software", "Peralatan Kantor", "Printer Scanner",
            "Aksesoris Desktop", "Keyboard Mouse", "Laptop", "Gaming",
            "Audio Computer", "Proyektor"
        ]
    },
    {
        main: "PERAWATAN & KECANTIKAN",
        subs: [
            "Perawatan Tubuh", "Perawatan Tangan", "Perawatan Kaki", "Perawatan Kuku",
            "Perawatan Rambut", "Perawatan Pria", "Parfum Wewangian", "Kosmetik Wajah",
            "Kosmetik Mata", "Kosmetik Bibir", "Pembersih Make Up", "Aksesoris Make Up",
            "Alat Perawatan Wajah", "Alat Pelangsing Tubuh", "Alat Penghilang Bulu",
            "Alat Rambut", "Treatment Mata", "Paket Set Kecantikan"
        ]
    },
    {
        main: "HANDPHONE & AKSESORIS",
        subs: [
            "Kartu Perdana", "Tablet", "Handphone", "Perangkat Wearable",
            "Perangkat VR", "Aksesoris Selfie", "Kartu Memori", "Kabel Charger",
            "Powerbank Baterai", "Casing Skin", "Audio Handphone"
        ]
    },
    {
        main: "PAKAIAN PRIA",
        subs: [
            "Denim Pria", "Hoodie Sweatshirt", "Sweater Cardigan", "Jaket Mantel",
            "Jas Formal", "Celana Panjang Pria", "Celana Pendek Pria", "Atasan Pria",
            "Batik Pria", "Pakaian Dalam Pria", "Pakaian Tidur Pria"
        ]
    },
    {
        main: "PAKAIAN WANITA",
        subs: [
            "Pakaian Tradisional", "Kostum", "Kain Wanita", "Batik Wanita",
            "Denim Wanita", "Atasan Wanita", "Celana Legging"
        ]
    },
    {
        main: "FASHION MUSLIM",
        subs: [
            "Hijab", "Aksesoris Muslim", "Atasan Muslim Wanita", "Bawahan Muslim Wanita",
            "Dress Muslim", "Mukena", "Sajadah", "Koko Pria"
        ]
    }
];

export default function DirectoryFooter() {
    return (
        <div className="bg-white border-t border-[#E5E7EB] pt-12 pb-16">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-xl font-bold text-[#1F2937] mb-8">Kategori LokalMart</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-10">
                    {directoryStructure.map((group, index) => (
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
                                            {sub}
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

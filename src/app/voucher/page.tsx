export default function VoucherPage() {
    const vouchers = [
        { id: 1, title: "Diskon 50RB", desc: "Min. Belanja Rp 1.000.000", code: "LOKAL50", type: "discount", color: "from-rose-500 to-rose-400" },
        { id: 2, title: "Cashback 5%", desc: "Hingga Rp 150.000 (Min. Belanja Rp 2Jt)", code: "CASHBACK150", type: "cashback", color: "from-amber-500 to-amber-400" },
        { id: 3, title: "Gratis Ongkir", desc: "Subsidi ongkir Rp 50.000 ke Luar Jawa", code: "ONGKIR50", type: "shipping", color: "from-emerald-500 to-emerald-400" },
        { id: 4, title: "Diskon Brand", desc: "Khusus Produk Unilever (Min. Belanja 500rb)", code: "UNILEVER50", type: "brand", color: "from-blue-600 to-blue-500" },
    ];

    return (
        <div className="bg-[#F7F8FA] min-h-screen py-10">
            <div className="max-w-5xl mx-auto px-4">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-2xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 opacity-20">
                        <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M7 15a2 2 0 0 1-2 2H3l4-4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" opacity="0.4"/><circle cx="12" cy="12" r="2"/></svg>
                    </div>
                    <div className="relative z-10 text-center py-6">
                        <h1 className="text-3xl md:text-5xl font-black mb-4">
                            Klaim Voucher Diskon
                        </h1>
                        <p className="text-yellow-50 text-lg max-w-2xl mx-auto font-medium">
                            Klaim berbagai voucher menarik di bawah ini untuk membuat kulakan bisnis Anda menjadi jauh lebih hemat!
                        </p>
                    </div>
                </div>

                {/* Grid Voucher */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {vouchers.map(v => (
                        <div key={v.id} className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden flex relative group">
                            
                            {/* Bagian Kiri (Warna & Diskon) */}
                            <div className={`w-32 bg-gradient-to-br ${v.color} p-4 flex flex-col items-center justify-center text-white relative shrink-0`}>
                                {/* Efek Gerigi Tiket Kiri */}
                                <div className="absolute -left-2 top-0 bottom-0 flex flex-col justify-between py-2">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="w-4 h-4 bg-[#F7F8FA] rounded-full"></div>
                                    ))}
                                </div>
                                {/* Efek Pemisah Kanan */}
                                <div className="absolute -right-2 top-0 bottom-0 flex flex-col justify-between py-2">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="w-4 h-4 bg-white rounded-full"></div>
                                    ))}
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                </div>
                                <div className="text-center font-black text-sm uppercase leading-tight">{v.type}</div>
                            </div>

                            {/* Bagian Kanan (Detail & Tombol) */}
                            <div className="p-6 flex-1 flex flex-col justify-between bg-white relative">
                                <div>
                                    <h3 className="font-black text-xl text-[#1F2937] mb-1">{v.title}</h3>
                                    <p className="text-sm text-[#6B7280] font-medium">{v.desc}</p>
                                </div>
                                
                                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="bg-gray-100 text-[#4B5563] text-xs font-bold px-3 py-1.5 rounded-lg border border-dashed border-gray-300 inline-block w-fit">
                                        Kode: {v.code}
                                    </div>
                                    <button className="bg-[#1A3C6E] hover:bg-[#2A5FA0] text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-colors shadow-sm">
                                        Klaim Voucher
                                    </button>
                                </div>
                            </div>
                            
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

import Link from "next/link";

export default function PPOBPage() {
    return (
        <div className="bg-[#F7F8FA] min-h-screen py-10">
            <div className="max-w-4xl mx-auto px-4">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-sky-600 to-sky-400 rounded-2xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 opacity-20">
                        <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
                            PPOB & Tagihan Bisnis
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                        </h1>
                        <p className="text-sky-100 text-lg max-w-2xl">
                            Bayar seluruh tagihan operasional bisnis Anda (Listrik, Internet, PDAM) secara instan dalam satu platform.
                        </p>
                    </div>
                </div>

                {/* Main Widget */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-[#E5E7EB] overflow-x-auto">
                        <button className="flex-1 min-w-[120px] py-4 text-center font-bold text-sky-600 border-b-2 border-sky-600 bg-sky-50 transition-colors">
                            Pulsa & Data
                        </button>
                        <button className="flex-1 min-w-[120px] py-4 text-center font-bold text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50 transition-colors">
                            Token Listrik
                        </button>
                        <button className="flex-1 min-w-[120px] py-4 text-center font-bold text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50 transition-colors">
                            BPJS
                        </button>
                        <button className="flex-1 min-w-[120px] py-4 text-center font-bold text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50 transition-colors">
                            PDAM
                        </button>
                    </div>

                    {/* Content (Pulsa & Data Mock) */}
                    <div className="p-8">
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-[#1F2937] mb-2">Nomor HP</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#6B7280]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                </span>
                                <input type="tel" placeholder="0812-3456-7890" className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-[#1F2937] rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent font-medium" />
                            </div>
                        </div>

                        {/* Nominal Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                            {[10, 20, 50, 100, 200, 500, 1000].map((nom, i) => (
                                <button key={i} className={`p-4 rounded-xl border text-center transition-all ${i === 2 ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500' : 'border-[#E5E7EB] hover:border-sky-500 hover:shadow-sm bg-white'}`}>
                                    <div className={`font-bold text-lg ${i === 2 ? 'text-sky-700' : 'text-[#1F2937]'}`}>
                                        {nom} Ribu
                                    </div>
                                    <div className="text-xs text-[#6B7280] mt-1">
                                        Harga: Rp {(nom * 1000 + 1500).toLocaleString('id-ID')}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Summary & Checkout */}
                        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h4 className="text-sm text-[#6B7280] font-medium mb-1">Total Pembayaran</h4>
                                <div className="text-3xl font-black text-[#1F2937]">Rp 51.500</div>
                            </div>
                            <button className="w-full md:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold py-3.5 px-10 rounded-xl transition-colors shadow-md">
                                Lanjutkan Pembayaran
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

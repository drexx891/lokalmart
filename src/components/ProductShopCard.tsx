import Link from "next/link";

export default function ProductShopCard({ supplier }: { supplier: any }) {
    // Generate mock data statically based on supplier ID so it doesn't cause hydration errors
    // Simple hash function for consistent random numbers based on a string
    const stringToNum = (str: string = "belio") => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    const hash = stringToNum(supplier?.id || "official");
    
    // Consistent mock stats
    const rating = (4.5 + ((hash % 50) / 100)).toFixed(1); // 4.5 to 4.9
    const responseRate = 85 + (hash % 15); // 85% to 99%
    const productsCount = 20 + (hash % 300); 
    const followers = (1 + (hash % 50)) + ((hash % 9) / 10); // 1.0k to 50.9k
    const joinedYears = 1 + (hash % 5);
    const responseTime = hash % 2 === 0 ? "hitungan menit" : "hitungan jam";

    return (
        <div className="bg-white rounded-md border border-[#E8E8E8] shadow-sm mb-6 p-6 flex flex-col md:flex-row gap-6 md:gap-10">
            
            {/* Bagian Profil Toko */}
            <div className="flex gap-4 md:w-1/3 md:border-r border-[#E8E8E8] md:pr-6 shrink-0">
                <div className="relative">
                    <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#1A3C6E] font-bold text-2xl border border-[#E8E8E8] shadow-sm overflow-hidden">
                        {supplier?.companyName?.charAt(0) || "B"}
                    </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-semibold text-[#333333] text-base mb-1 truncate max-w-[200px]">
                        {supplier?.companyName || "Belio Official Store"}
                    </h3>
                    <p className="text-xs text-[#757575] mb-3">Aktif 15 menit lalu</p>
                    
                    <div className="flex gap-2">
                        <button className="flex-1 max-w-[120px] px-2 py-1.5 border border-[#EE4D2D] bg-[#FFF0ED] text-[#EE4D2D] text-xs font-medium rounded flex items-center justify-center gap-1.5 hover:bg-[#FFE4DF] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>
                            Chat
                        </button>
                        <Link href="/kategori" className="flex-1 max-w-[120px] px-2 py-1.5 border border-[#E8E8E8] text-[#555555] text-xs font-medium rounded flex items-center justify-center gap-1.5 hover:bg-[#F8F8F8] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            Toko
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bagian Statistik Toko */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-2 text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-[#757575]">Penilaian</span>
                    <span className="text-[#EE4D2D] font-medium">{rating}RB</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#757575]">Persentase Chat Dibalas</span>
                    <span className="text-[#EE4D2D] font-medium">{responseRate}%</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#757575]">Bergabung</span>
                    <span className="text-[#EE4D2D] font-medium">{joinedYears} tahun lalu</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#757575]">Produk</span>
                    <span className="text-[#EE4D2D] font-medium">{productsCount}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#757575]">Waktu Chat Dibalas</span>
                    <span className="text-[#EE4D2D] font-medium">{responseTime}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#757575]">Pengikut</span>
                    <span className="text-[#EE4D2D] font-medium">{followers}RB</span>
                </div>
            </div>

        </div>
    );
}

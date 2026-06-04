"use client";

import Logo from "@/components/ui/Logo";

export default function BukaTokoGatewayPage() {
    return (
        <div className="min-h-screen bg-[#F7F8FA] font-sans flex flex-col items-center justify-center p-4">
            
            <div className="bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-[#E5E7EB] flex flex-col items-center text-center max-w-2xl w-full">
                <div className="mb-8">
                    <Logo size="lg" />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#1F2937] mb-6">
                    Mulai Berjualan di Belio
                </h1>
                
                <p className="text-lg text-[#6B7280] mb-12">
                    Portal Seller Belio kini telah dipindahkan ke platform khusus yang lebih canggih dan profesional. Klik tombol di bawah ini untuk menuju ke Seller Center yang baru.
                </p>

                <a 
                    href="http://localhost:3001" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-3 bg-[#F5A623] text-[#1A3C6E] px-12 py-5 rounded-full font-black text-xl hover:bg-[#e09612] transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 transform duration-200"
                >
                    Mulai Berjualan Gratis
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
            </div>
            
        </div>
    );
}

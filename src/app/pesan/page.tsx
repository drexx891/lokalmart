import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function MessagesPage() {
  // Ambil beberapa supplier acak dari database untuk dijadikan list kontak simulasi
  const suppliers = await prisma.supplier.findMany({
    take: 3,
  });

  return (
    <div className="bg-[#F7F8FA] min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 h-[calc(100vh-160px)] flex flex-col">
        
        {/* Breadcrumbs */}
        <div className="text-sm text-[#6B7280] mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-[#1A3C6E] transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-[#1F2937] font-medium">Pesan (Inquiry)</span>
        </div>

        <div className="bg-white flex-1 border border-[#E5E7EB] rounded-sm flex overflow-hidden shadow-sm">
          
          {/* Sidebar Chat List */}
          <div className="w-[320px] border-r border-[#E5E7EB] flex flex-col shrink-0 bg-white">
            <div className="p-4 border-b border-[#E5E7EB] bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-[#1F2937]">Kotak Masuk</h2>
              <span className="text-xs bg-[#1A3C6E] text-white px-2 py-1 rounded-full font-bold">3 Baru</span>
            </div>
            
            <div className="p-3">
              <div className="relative">
                <input type="text" placeholder="Cari percakapan..." className="w-full bg-[#F7F8FA] text-sm text-[#1F2937] px-9 py-2 rounded-sm outline-none border border-transparent focus:border-[#1A3C6E] transition-colors" />
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 no-scrollbar">
              {suppliers.map((supplier, idx) => (
                <div key={supplier.id} className={`p-4 border-b border-[#f0f0f0] cursor-pointer flex gap-3 hover:bg-[#EBF2FA] transition-colors ${idx === 0 ? 'bg-[#fff8f6] border-l-4 border-l-[#1A3C6E]' : 'border-l-4 border-l-transparent'}`}>
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shrink-0 text-xl overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(supplier.companyName)}&background=random`} alt={supplier.companyName} className="w-full h-full object-cover" />
                    {idx === 0 && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className={`text-sm truncate pr-2 ${idx === 0 ? 'font-bold text-[#1F2937]' : 'font-medium text-[#6B7280]'}`}>
                        {supplier.companyName}
                      </h4>
                      <span className="text-[10px] text-[#9CA3AF] shrink-0">10:42 AM</span>
                    </div>
                    <p className={`text-xs truncate ${idx === 0 ? 'text-[#1F2937] font-medium' : 'text-[#9CA3AF]'}`}>
                      {idx === 0 ? "Halo! Ya, kami bisa produksi 10.000 pcs sesuai spesifikasi." : "Pesanan Anda sedang diproses."}
                    </p>
                  </div>
                </div>
              ))}
              
              {suppliers.length === 0 && (
                <div className="p-8 text-center text-sm text-[#9CA3AF]">
                  Belum ada pesan masuk.
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          {suppliers.length > 0 ? (
            <div className="flex-1 flex flex-col bg-[#fdfdfd]">
              {/* Header Chat */}
              <div className="h-[72px] border-b border-[#E5E7EB] flex items-center px-6 justify-between bg-white shrink-0">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-[#1F2937]">{suppliers[0].companyName}</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium border border-green-200">Verified Supplier</span>
                </div>
                <Link href={`/supplier/${suppliers[0].id}`} className="text-sm text-[#1A3C6E] hover:underline font-medium">
                  Lihat Profil
                </Link>
              </div>

              {/* Messages Content */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                <div className="text-center text-xs text-[#9CA3AF] my-4">Hari ini</div>
                
                {/* Pembeli Bubble */}
                <div className="flex justify-end mb-2">
                  <div className="bg-[#EBF2FA] border border-[#BFDBFE] text-[#1F2937] px-4 py-3 rounded-lg max-w-[70%] rounded-tr-sm">
                    <p className="text-sm">Halo, saya tertarik dengan produk etalase Anda. Apakah bisa *custom* logo perusahaan dan jika pesan 10.000 pcs bisa dapat diskon grosir?</p>
                    <span className="text-[10px] text-[#9CA3AF] block text-right mt-1">10:30 AM</span>
                  </div>
                </div>

                {/* Supplier Bubble */}
                <div className="flex mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(suppliers[0].companyName)}&background=random`} alt="Supplier" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white border border-[#E5E7EB] text-[#6B7280] px-4 py-3 rounded-lg max-w-[70%] rounded-tl-sm shadow-sm">
                    <p className="text-sm text-[#1F2937]">Halo! Ya, kami bisa produksi 10.000 pcs sesuai spesifikasi.</p>
                    <p className="text-sm text-[#1F2937] mt-2">Untuk pesanan di atas 5.000 pcs, kami beri diskon tambahan 15% dari harga eceran. Silakan kirimkan file logonya ke saya agar tim desainer kami buatkan *mockup*-nya secara gratis hari ini juga.</p>
                    <span className="text-[10px] text-[#9CA3AF] block mt-2">10:42 AM</span>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-[#E5E7EB]">
                <div className="flex gap-2">
                  <button className="w-10 h-10 flex items-center justify-center text-[#9CA3AF] hover:bg-gray-100 rounded-sm transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                  </button>
                  <input type="text" placeholder="Ketik balasan Anda di sini..." className="flex-1 bg-[#F7F8FA] text-sm px-4 py-2 rounded-sm outline-none border border-transparent focus:border-[#1A3C6E] transition-colors" />
                  <button className="bg-[#1A3C6E] hover:bg-[#2A5FA0] text-white px-6 py-2 rounded-sm font-bold text-sm transition-colors flex items-center gap-2">
                    Kirim
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#fdfdfd] text-[#9CA3AF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-[#E5E7EB]"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <p>Pilih pesan untuk mulai mengobrol.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

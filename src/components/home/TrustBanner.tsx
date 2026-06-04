export default function TrustBanner() {
  const features = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
      title: "Dana Terlindungi",
      desc: "Pembayaran aman sampai barang diterima"
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
      title: "Supplier Terverifikasi",
      desc: "Semua penjual sudah diverifikasi identitas"
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12"></path><path d="M12 8v4l3 3"></path><path d="M22 2L2 22"></path><path d="M18 2h4v4"></path><path d="M2 22h4v-4"></path><path d="M3.5 8a9 9 0 0 1 14.5-4.5"></path><path d="M20.5 16a9 9 0 0 1-14.5 4.5"></path></svg>,
      title: "Jaminan Refund",
      desc: "Uang kembali jika pesanan bermasalah"
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>,
      title: "Layanan 24/7",
      desc: "Tim support siap membantu kapan saja"
    }
  ];

  return (
    <section className="bg-white border-t border-b border-[#E5E7EB] py-12 mt-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-[#F7F8FA] flex items-center justify-center text-[#1A3C6E] mb-4 group-hover:bg-[#EBF2FA] transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed max-w-[200px]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

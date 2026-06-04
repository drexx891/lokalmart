import Link from "next/link";
import { notFound } from "next/navigation";

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Format slug menjadi judul yang rapi (misal: "cara-belanja" -> "Cara Belanja")
  const title = slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Daftar slug yang valid (opsional, untuk mencegah akses ke url sembarangan)
  const validSlugs = [
    "cara-belanja", "keamanan-dana", "kebijakan-pengembalian", "faq", "rfq",
    "edukasi-penjual", "layanan-promosi", "keanggotaan-premium", 
    "profil-perusahaan", "karir", "blog", "kontak", "syarat-ketentuan"
  ];

  if (!validSlugs.includes(slug)) {
    notFound();
  }

  return (
    <div className="bg-[#F7F8FA] min-h-[70vh] py-12 flex flex-col items-center justify-center">
      <div className="bg-white border border-[#E5E7EB] rounded-sm p-12 max-w-2xl w-full text-center shadow-sm">
        
        <div className="w-20 h-20 bg-[#EBF2FA] text-[#1A3C6E] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </div>
        
        <h1 className="text-3xl font-black text-[#1F2937] mb-4">
          Halaman {title}
        </h1>
        
        <p className="text-[#6B7280] leading-relaxed mb-8">
          Halaman informasi khusus untuk <strong>&ldquo;{title}&rdquo;</strong> saat ini sedang dalam tahap pengembangan (Under Construction). Silakan kembali lagi nanti setelah platform B2B Belio dirilis secara resmi.
        </p>
        
        <Link 
          href="/" 
          className="inline-block bg-[#1A3C6E] text-white px-8 py-3 rounded-sm font-bold hover:bg-[#2A5FA0] transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

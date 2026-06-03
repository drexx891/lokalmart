import { prisma } from "@/lib/prisma";

function formatRupiah(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-card-bg/80 border-b border-card-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              <h1 className="text-xl font-bold text-primary tracking-tight">
                LokalMart
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-muted">
              <a
                href="#produk"
                className="hover:text-primary transition-colors duration-200"
              >
                Produk
              </a>
              <a
                href="#tentang"
                className="hover:text-primary transition-colors duration-200"
              >
                Tentang
              </a>
              <a
                href="#kontak"
                className="hover:text-primary transition-colors duration-200"
              >
                Kontak
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(22,163,74,0.08),transparent_50%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-badge-bg text-badge-text mb-6">
              🇮🇩 Dukung UMKM Lokal
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-foreground">
              Belanja Produk{" "}
              <span className="text-primary">UMKM Terbaik</span> dari Seluruh
              Indonesia
            </h2>
            <p className="mt-5 text-lg text-muted leading-relaxed max-w-lg">
              Temukan produk-produk berkualitas langsung dari pengusaha lokal.
              Setiap pembelian Anda membantu memajukan ekonomi Indonesia. 🚀
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#produk"
                className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Lihat Produk
              </a>
              <a
                href="#tentang"
                className="inline-flex items-center px-6 py-3 rounded-full border border-card-border text-foreground font-semibold text-sm hover:bg-card-bg hover:border-primary/30 transition-all duration-200"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-card-border bg-card-bg/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {products.length}+
              </p>
              <p className="text-xs sm:text-sm text-muted mt-1">
                Produk UMKM
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-accent">100+</p>
              <p className="text-xs sm:text-sm text-muted mt-1">
                Mitra UMKM
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                34
              </p>
              <p className="text-xs sm:text-sm text-muted mt-1">
                Provinsi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="produk" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold tracking-tight text-foreground">
            Produk Unggulan 🔥
          </h3>
          <p className="mt-3 text-muted max-w-md mx-auto">
            Produk pilihan dari UMKM terbaik Indonesia, langsung dari
            produsennya
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-lg text-muted">
              Belum ada produk. Jalankan{" "}
              <code className="px-2 py-1 bg-card-bg border border-card-border rounded text-sm font-mono">
                npx prisma db seed
              </code>{" "}
              untuk menambahkan produk contoh.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="group relative bg-card-bg border border-card-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transform hover:-translate-y-1 transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      📦
                    </div>
                  )}
                  {/* Stock badge */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-badge-bg text-badge-text backdrop-blur-sm">
                    Stok: {product.stock}
                  </span>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h4 className="font-semibold text-foreground text-lg leading-snug group-hover:text-primary transition-colors duration-200">
                    {product.name}
                  </h4>
                  <p className="mt-2 text-sm text-muted line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-primary">
                      {formatRupiah(product.price)}
                    </p>
                    <button className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transform hover:scale-105 active:scale-95 transition-all duration-200">
                      + Keranjang
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section
        id="tentang"
        className="bg-gradient-to-b from-card-bg/50 to-background border-t border-card-border"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-bold tracking-tight text-foreground">
              Kenapa LokalMart? 🤔
            </h3>
            <p className="mt-4 text-muted leading-relaxed">
              Kami menghubungkan produk UMKM berkualitas dengan konsumen yang
              peduli. Setiap transaksi di LokalMart membantu menggerakkan roda
              ekonomi lokal Indonesia.
            </p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-card-bg border border-card-border hover:border-primary/20 transition-colors duration-200">
                <p className="text-3xl mb-3">🏪</p>
                <h4 className="font-semibold text-foreground">Langsung dari UMKM</h4>
                <p className="mt-2 text-sm text-muted">
                  Tanpa perantara, harga lebih terjangkau
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card-bg border border-card-border hover:border-primary/20 transition-colors duration-200">
                <p className="text-3xl mb-3">✅</p>
                <h4 className="font-semibold text-foreground">Kualitas Terjamin</h4>
                <p className="mt-2 text-sm text-muted">
                  Produk dikurasi oleh tim kami
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card-bg border border-card-border hover:border-primary/20 transition-colors duration-200">
                <p className="text-3xl mb-3">🚚</p>
                <h4 className="font-semibold text-foreground">Pengiriman Cepat</h4>
                <p className="mt-2 text-sm text-muted">
                  Sampai ke pintu rumah Anda
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="kontak"
        className="bg-card-bg border-t border-card-border"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              <span className="font-bold text-primary">LokalMart</span>
            </div>
            <p className="text-sm text-muted">
              © 2025 LokalMart. Dukung UMKM, Majukan Indonesia. 🇮🇩
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

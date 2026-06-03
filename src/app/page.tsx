import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

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
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.navContent}>
            <a href="/" className={styles.logo}>
              <span className={styles.logoIcon}>🛒</span>
              <span className={styles.logoText}>LokalMart</span>
            </a>
            <div className={styles.navLinks}>
              <a href="#produk" className={styles.navLink}>Produk</a>
              <a href="#tentang" className={styles.navLink}>Tentang</a>
              <a href="#kontak" className={styles.navLink}>Kontak</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span>🇮🇩</span> Dukung UMKM Lokal
            </div>
            <h1 className={styles.heroTitle}>
              Belanja Produk <span className={styles.heroTitleHighlight}>UMKM Terbaik</span> dari Seluruh Indonesia
            </h1>
            <p className={styles.heroSubtitle}>
              Temukan produk-produk berkualitas langsung dari pengusaha lokal.
              Setiap pembelian Anda membantu memajukan ekonomi Indonesia. 🚀
            </p>
            <div className={styles.heroActions}>
              <a href="#produk" className={styles.btnPrimary}>
                Lihat Produk
              </a>
              <a href="#tentang" className={styles.btnSecondary}>
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.statsGrid}>
            <div>
              <p className={styles.statValue}>{products.length}+</p>
              <p className={styles.statLabel}>Produk UMKM</p>
            </div>
            <div>
              <p className={styles.statValue}>100+</p>
              <p className={styles.statLabel}>Mitra UMKM</p>
            </div>
            <div>
              <p className={styles.statValue}>34</p>
              <p className={styles.statLabel}>Provinsi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="produk" className={styles.products}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Produk Unggulan 🔥</h2>
          <p className={styles.sectionSubtitle}>
            Produk pilihan dari UMKM terbaik Indonesia, langsung dari produsennya.
          </p>
        </header>

        {products.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <p className={styles.emptyText}>
              Belum ada produk. Jalankan <code className={styles.codeBlock}>npx prisma db seed</code> untuk menambahkan produk contoh.
            </p>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {products.map((product) => (
              <article key={product.id} className={styles.productCard}>
                <div className={styles.productImageWrapper}>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className={styles.productImage}
                    />
                  ) : (
                    <div className={styles.productPlaceholder}>📦</div>
                  )}
                  <span className={styles.productBadge}>
                    Stok: {product.stock}
                  </span>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productDesc}>{product.description}</p>
                  <div className={styles.productFooter}>
                    <p className={styles.productPrice}>{formatRupiah(product.price)}</p>
                    <button className={styles.btnCart}>+ Keranjang</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="tentang" className={styles.about}>
        <div className={styles.aboutContainer}>
          <header className={styles.aboutHeader}>
            <h2 className={styles.sectionTitle}>Kenapa LokalMart? 🤔</h2>
            <p className={styles.aboutDesc}>
              Kami menghubungkan produk UMKM berkualitas dengan konsumen yang peduli. 
              Setiap transaksi di LokalMart membantu menggerakkan roda ekonomi lokal Indonesia.
            </p>
          </header>
          
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <p className={styles.featureIcon}>🏪</p>
              <h3 className={styles.featureTitle}>Langsung dari UMKM</h3>
              <p className={styles.featureDesc}>Tanpa perantara, harga lebih terjangkau.</p>
            </div>
            <div className={styles.featureCard}>
              <p className={styles.featureIcon}>✅</p>
              <h3 className={styles.featureTitle}>Kualitas Terjamin</h3>
              <p className={styles.featureDesc}>Produk dikurasi oleh tim ahli kami.</p>
            </div>
            <div className={styles.featureCard}>
              <p className={styles.featureIcon}>🚚</p>
              <h3 className={styles.featureTitle}>Pengiriman Cepat</h3>
              <p className={styles.featureDesc}>Sampai ke pintu rumah Anda dengan aman.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLogo}>
            <span className={styles.logoIcon}>🛒</span>
            <span className={styles.footerLogoText}>LokalMart</span>
          </div>
          <p className={styles.footerText}>
            © 2025 LokalMart. Dukung UMKM, Majukan Indonesia. 🇮🇩
          </p>
        </div>
      </footer>
    </>
  );
}


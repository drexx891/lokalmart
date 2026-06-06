"use client";

import { useState } from "react";

interface SellerDashboardProps {
  supplier: { id: string; companyName: string; verified: boolean; rating: number; totalSales: number };
  products: any[];
  categories: { id: string; name: string }[];
  stats: { totalProducts: number; totalViews: number; totalSales: number; totalRevenue: number; avgRating: number };
}

export default function SellerDashboardClient({ supplier, products, categories, stats }: SellerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'upload'>('products');
  const [productList, setProductList] = useState(products);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  // Form state
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '', unit: 'Pieces', minOrder: '1'
  });

  const formatRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadMsg('');

    try {
      const res = await fetch('/api/products/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseInt(form.price),
          stock: parseInt(form.stock),
          imageUrl: form.imageUrl || null,
          categoryId: form.categoryId || null,
          unit: form.unit,
          minOrder: parseInt(form.minOrder) || 1,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUploadMsg('✅ Produk berhasil diunggah!');
        setProductList(prev => [{ ...data.data, metrics: null }, ...prev]);
        setForm({ name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '', unit: 'Pieces', minOrder: '1' });
        setActiveTab('products');
      } else {
        setUploadMsg(`❌ ${data.message}`);
      }
    } catch {
      setUploadMsg('❌ Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#1F2937] tracking-tight flex items-center gap-2">
            {supplier.companyName}
            {supplier.verified && (
              <span className="bg-[#2ECC8B]/10 text-[#2ECC8B] text-xs font-bold px-2 py-0.5 rounded-full border border-[#2ECC8B]/20">✓ Verified</span>
            )}
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">Kelola produk dan pantau performa toko Anda</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${activeTab === 'products' ? 'bg-[#1A3C6E] text-white' : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F7F8FA]'}`}>
            Produk Saya
          </button>
          <button onClick={() => setActiveTab('upload')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-1.5 ${activeTab === 'upload' ? 'bg-[#F5A623] text-white' : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F7F8FA]'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Upload Produk
          </button>
        </div>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Produk" value={String(stats.totalProducts)} icon="📦" color="bg-blue-50 text-blue-700" />
        <StatCard label="Total Dilihat" value={stats.totalViews.toLocaleString()} icon="👁️" color="bg-purple-50 text-purple-700" />
        <StatCard label="Total Terjual" value={String(stats.totalSales)} icon="🛒" color="bg-green-50 text-green-700" />
        <StatCard label="Pendapatan" value={formatRp(stats.totalRevenue)} icon="💰" color="bg-amber-50 text-amber-700" small />
        <StatCard label="Rating Toko" value={`⭐ ${stats.avgRating}`} icon="" color="bg-orange-50 text-orange-700" />
      </div>

      {/* Tab Content */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
          <div className="p-4 md:p-6 border-b border-[#E5E7EB]">
            <h2 className="text-lg font-bold text-[#1F2937]">Daftar Produk ({productList.length})</h2>
          </div>

          {productList.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-[#6B7280] font-medium">Belum ada produk. Mulai upload produk pertama Anda!</p>
              <button onClick={() => setActiveTab('upload')} className="mt-4 px-6 py-2.5 bg-[#F5A623] text-white rounded-xl font-bold text-sm hover:bg-[#E09612] transition-colors">
                + Upload Produk
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F7F8FA] text-[#6B7280] text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left p-4">Produk</th>
                    <th className="text-left p-4 hidden md:table-cell">Kategori</th>
                    <th className="text-right p-4">Harga</th>
                    <th className="text-right p-4">Stok</th>
                    <th className="text-right p-4 hidden md:table-cell">Views</th>
                    <th className="text-right p-4 hidden md:table-cell">Terjual</th>
                    <th className="text-center p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {productList.map((product) => (
                    <tr key={product.id} className="hover:bg-[#F7F8FA] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#F7F8FA] rounded-lg overflow-hidden flex-shrink-0 border border-[#E5E7EB]">
                            {product.imageUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#D1D5DB]">📦</div>
                            )}
                          </div>
                          <span className="font-medium text-[#1F2937] line-clamp-2 max-w-[200px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell text-[#6B7280]">{product.category?.name || '-'}</td>
                      <td className="p-4 text-right font-semibold text-[#1A3C6E]">{formatRp(product.price)}</td>
                      <td className="p-4 text-right">
                        <span className={product.stock < 5 ? 'text-red-600 font-bold' : 'text-[#1F2937]'}>{product.stock}</span>
                      </td>
                      <td className="p-4 text-right hidden md:table-cell text-[#6B7280]">{product.metrics?.views || 0}</td>
                      <td className="p-4 text-right hidden md:table-cell text-[#6B7280]">{product.metrics?.purchases || 0}</td>
                      <td className="p-4 text-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          product.status === 'active' ? 'bg-green-50 text-green-700' :
                          product.status === 'inactive' ? 'bg-gray-100 text-gray-500' :
                          'bg-yellow-50 text-yellow-700'
                        }`}>
                          {product.status === 'active' ? 'Aktif' : product.status === 'inactive' ? 'Nonaktif' : 'Review'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 md:p-8 max-w-2xl">
          <h2 className="text-xl font-bold text-[#1F2937] mb-6">Upload Produk Baru</h2>

          {uploadMsg && (
            <div className={`p-3 rounded-xl text-sm font-medium mb-6 ${uploadMsg.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {uploadMsg}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Nama Produk <span className="text-red-500">*</span></label>
              <input type="text" required minLength={5} maxLength={200} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Contoh: Kaos Polos Cotton Combed 30s"
                className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E]" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Deskripsi <span className="text-red-500">*</span></label>
              <textarea required rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Jelaskan detail produk, bahan, ukuran, dll."
                className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E] resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Harga (Rp) <span className="text-red-500">*</span></label>
                <input type="number" required min={100} value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                  placeholder="25000"
                  className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Stok <span className="text-red-500">*</span></label>
                <input type="number" required min={0} value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                  placeholder="100"
                  className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Kategori</label>
              <select value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
                className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E] bg-white">
                <option value="">Pilih Kategori</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">URL Gambar</label>
              <input type="url" value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E]" />
              <p className="text-xs text-[#9CA3AF] mt-1">Gunakan URL gambar dari Unsplash, Cloudinary, atau hosting lain</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Satuan</label>
                <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                  className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E] bg-white">
                  <option value="Pieces">Pieces</option>
                  <option value="Sets">Sets</option>
                  <option value="Cartons">Cartons</option>
                  <option value="Kg">Kg</option>
                  <option value="Lusin">Lusin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Min. Order</label>
                <input type="number" min={1} value={form.minOrder} onChange={e => setForm(p => ({ ...p, minOrder: e.target.value }))}
                  className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E]" />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#F5A623] to-[#E09612] text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-60">
              {isSubmitting ? 'Mengupload...' : '🚀 Upload Produk'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color, small }: { label: string; value: string; icon: string; color: string; small?: boolean }) {
  return (
    <div className={`${color} p-4 rounded-2xl`}>
      <div className="text-lg mb-1">{icon}</div>
      <div className={`font-black ${small ? 'text-base' : 'text-xl'} text-[#1F2937]`}>{value}</div>
      <div className="text-xs font-medium opacity-70 mt-0.5">{label}</div>
    </div>
  );
}

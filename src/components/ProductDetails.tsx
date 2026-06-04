import Image from "next/image";

export default function ProductDetails({
    product,
}: {
    product: any;
}) {
    // Generate mock data statically based on product ID
    const stringToNum = (str: string = "belio") => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    const hash = stringToNum(product?.id || "prod");
    const mockRating = (4.5 + ((hash % 50) / 100)).toFixed(1); 
    const mockReviewsCount = 100 + (hash % 500);

    return (
        <div className="flex flex-col gap-6">
            
            {/* SPESIFIKASI & DESKRIPSI (Kiri) */}
            <div className="bg-white rounded-md border border-[#E8E8E8] shadow-sm overflow-hidden">
                <div className="p-6">
                    <h2 className="bg-[#F8F8F8] p-3 text-lg font-bold text-[#333333] mb-6 uppercase tracking-wider">Spesifikasi Produk</h2>
                    <div className="grid grid-cols-[150px_1fr] md:grid-cols-[200px_1fr] gap-y-4 text-sm text-[#757575] mb-10">
                        <div>Kategori</div>
                        <div className="text-[#1A3C6E] hover:underline cursor-pointer flex items-center gap-2">
                            LokalMart <span className="text-[#757575]">{'>'}</span> {product.category?.name || "Kategori Lainnya"}
                        </div>
                        
                        <div>Merek</div>
                        <div className="text-[#1A3C6E] hover:underline cursor-pointer">Tidak Ada Merek</div>
                        
                        <div>Stok</div>
                        <div className="text-[#333333]">{product.stock || 50}</div>
                        
                        <div>Dikirim Dari</div>
                        <div className="text-[#333333]">KOTA JAKARTA SELATAN - KEBAYORAN LAMA, DKI JAKARTA, ID</div>
                    </div>

                    <h2 className="bg-[#F8F8F8] p-3 text-lg font-bold text-[#333333] mb-6 uppercase tracking-wider">Deskripsi Produk</h2>
                    <div className="text-sm text-[#333333] leading-relaxed whitespace-pre-wrap">
                        {product.description || (
                            "Produk ini belum memiliki deskripsi spesifik dari penjual.\n\nNamun, Anda tidak perlu khawatir karena produk ini dijamin 100% original dan berkualitas tinggi sesuai standar LokalMart.\n\n- Garansi uang kembali jika produk tidak sesuai gambar\n- Pengiriman cepat dan aman\n- Packing rapi dengan bubble wrap\n\nSilakan dipesan sekarang juga sebelum kehabisan!"
                        )}
                    </div>
                </div>
            </div>

            {/* PENILAIAN PRODUK (Review) */}
            <div className="bg-white rounded-md border border-[#E8E8E8] shadow-sm overflow-hidden mb-10">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-[#333333] mb-6 uppercase tracking-wider">Penilaian Produk</h2>
                    
                    {/* Ringkasan Penilaian */}
                    <div className="bg-[#FFF0ED] border border-[#FAD6CD] rounded flex flex-col md:flex-row items-center gap-6 p-6 mb-8">
                        <div className="text-center md:w-32 shrink-0">
                            <div className="text-[#EE4D2D] text-3xl font-bold mb-1">
                                <span className="text-5xl">{mockRating}</span> dari 5
                            </div>
                            <div className="flex justify-center gap-1">
                                {[1,2,3,4,5].map(s => (
                                    <svg key={s} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={s <= parseFloat(mockRating) ? "#EE4D2D" : "none"} stroke="#EE4D2D" strokeWidth={s <= parseFloat(mockRating) ? "0" : "1.5"}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                ))}
                            </div>
                        </div>
                        
                        {/* Filter Tab */}
                        <div className="flex-1 flex flex-wrap gap-3">
                            <button className="px-5 py-2 bg-white border border-[#EE4D2D] text-[#EE4D2D] rounded text-sm font-medium">Semua</button>
                            <button className="px-5 py-2 bg-white border border-[#E8E8E8] text-[#333333] rounded text-sm hover:border-[#EE4D2D] hover:text-[#EE4D2D]">5 Bintang ({mockReviewsCount - 15})</button>
                            <button className="px-5 py-2 bg-white border border-[#E8E8E8] text-[#333333] rounded text-sm hover:border-[#EE4D2D] hover:text-[#EE4D2D]">4 Bintang (12)</button>
                            <button className="px-5 py-2 bg-white border border-[#E8E8E8] text-[#333333] rounded text-sm hover:border-[#EE4D2D] hover:text-[#EE4D2D]">3 Bintang (2)</button>
                            <button className="px-5 py-2 bg-white border border-[#E8E8E8] text-[#333333] rounded text-sm hover:border-[#EE4D2D] hover:text-[#EE4D2D]">2 Bintang (0)</button>
                            <button className="px-5 py-2 bg-white border border-[#E8E8E8] text-[#333333] rounded text-sm hover:border-[#EE4D2D] hover:text-[#EE4D2D]">1 Bintang (1)</button>
                            <button className="px-5 py-2 bg-white border border-[#E8E8E8] text-[#333333] rounded text-sm hover:border-[#EE4D2D] hover:text-[#EE4D2D]">Dengan Komentar ({Math.floor(mockReviewsCount/2)})</button>
                            <button className="px-5 py-2 bg-white border border-[#E8E8E8] text-[#333333] rounded text-sm hover:border-[#EE4D2D] hover:text-[#EE4D2D]">Dengan Media (28)</button>
                        </div>
                    </div>
                    
                    {/* Daftar Ulasan Asli */}
                    <div className="flex flex-col">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="py-5 border-b border-[#E8E8E8] flex gap-4 last:border-b-0">
                                {/* Profil Pembeli */}
                                <div className="w-10 h-10 rounded-full bg-[#F3F4F6] border border-[#E8E8E8] overflow-hidden flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#D1D5DB"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-semibold text-[#333333] mb-1">
                                        b***{num}
                                    </div>
                                    <div className="flex gap-0.5 mb-1.5">
                                        {[1,2,3,4,5].map(s => (
                                            <svg key={s} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#EE4D2D" stroke="#EE4D2D"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                        ))}
                                    </div>
                                    <div className="text-[11px] text-[#757575] mb-4">
                                        2025-06-0{num} 14:32 | Variasi: Hitam, L
                                    </div>
                                    <div className="text-sm text-[#333333] leading-relaxed mb-4">
                                        Barang sudah sampai dengan selamat, packing sangat rapi pakai bubble wrap tebal. Kualitas bahannya bagus banget lembut dan dingin pas dipakai. Ukurannya juga pas banget di badan. Puas belanja disini, next pasti order lagi warna lain! Terima kasih seller, sukses terus! 👍🔥🔥
                                    </div>
                                    {/* Mock Photo Ulasan */}
                                    {num !== 2 && (
                                        <div className="flex gap-2">
                                            <div className="w-[72px] h-[72px] bg-[#F8F8F8] border border-[#E8E8E8] rounded overflow-hidden">
                                                <img src={product.imageUrl || "https://loremflickr.com/100/100/clothes"} alt="Review" className="w-full h-full object-cover opacity-80" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

        </div>
    );
}

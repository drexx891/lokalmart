"use client";

import { useState, useMemo } from "react";
import { addToCart } from "@/app/actions/cart";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface CustomOption {
    name: string;
    options: { label: string; priceDelta: number }[];
}

export default function ProductActions({ 
    productId, 
    stock, 
    minOrder, 
    unit, 
    basePrice,
    originalPrice,
    isPreOrder,
    preOrderDays,
    customOptionsRaw,
    variants,
    disabled 
}: { 
    productId: string;
    stock: number;
    minOrder: number;
    unit: string;
    basePrice: number;
    originalPrice?: number;
    isPreOrder?: boolean;
    preOrderDays?: number | null;
    customOptionsRaw?: any;
    variants?: any[];
    disabled?: boolean;
}) {
    const [quantity, setQuantity] = useState(minOrder);
    const [isLoadingCart, setIsLoadingCart] = useState(false);
    const [isLoadingBuy, setIsLoadingBuy] = useState(false);
    const [notes, setNotes] = useState("");
    
    // Parse custom options (Legacy)
    const customOptions: CustomOption[] = useMemo(() => {
        if (!customOptionsRaw) return [];
        try {
            return typeof customOptionsRaw === "string" ? JSON.parse(customOptionsRaw) : customOptionsRaw;
        } catch (e) {
            return [];
        }
    }, [customOptionsRaw]);

    // State for selected legacy options { "Warna": "Merah", "Ukuran": "XL" }
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    
    // State for Database Variants
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
    const selectedVariant = useMemo(() => variants?.find((v: any) => v.id === selectedVariantId), [variants, selectedVariantId]);

    const router = useRouter();

    const activeStock = selectedVariant ? selectedVariant.stock : stock;

    const handleMinus = () => {
        if (quantity > minOrder) setQuantity(q => q - 1);
    };

    const handlePlus = () => {
        if (quantity < activeStock) setQuantity(q => q + 1);
    };

    const handleOptionSelect = (optionName: string, label: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionName]: label
        }));
    };

    // Calculate dynamic price
    const currentPriceDelta = useMemo(() => {
        if (selectedVariant) return 0; // Use variant price instead
        let delta = 0;
        customOptions.forEach(opt => {
            const selectedLabel = selectedOptions[opt.name];
            if (selectedLabel) {
                const choice = opt.options.find(o => o.label === selectedLabel);
                if (choice) delta += Number(choice.priceDelta) || 0;
            }
        });
        return delta;
    }, [customOptions, selectedOptions, selectedVariant]);

    const finalPrice = selectedVariant?.price ? selectedVariant.price : basePrice + currentPriceDelta;
    const finalOriginalPrice = selectedVariant?.price ? selectedVariant.price * 1.3 : (originalPrice || basePrice * 1.3) + currentPriceDelta;

    const isAllOptionsSelected = variants?.length ? !!selectedVariantId : customOptions.every(opt => !!selectedOptions[opt.name]);

    const handleAddToCart = async () => {
        if (disabled) return;
        if (!isAllOptionsSelected) {
            toast.error("Silakan lengkapi pilihan variasi produk terlebih dahulu");
            return;
        }

        setIsLoadingCart(true);
        const result = await addToCart(productId, quantity, selectedOptions, notes, selectedVariantId || undefined);
        setIsLoadingCart(false);

        if (result.success) {
            toast.success("Produk berhasil ditambahkan ke keranjang", {
                style: { background: '#fff', color: '#333', border: '1px solid #E5E7EB' }
            });
            router.refresh();
        } else {
            toast.error(result.message || "Gagal memasukkan ke keranjang", {
                style: { background: '#EBF2FA', color: '#1A3C6E', border: '1px solid #BFDBFE' }
            });
        }
    };

    const handleBuyNow = async () => {
        if (disabled) return;
        if (!isAllOptionsSelected) {
            toast.error("Silakan lengkapi pilihan variasi produk terlebih dahulu");
            return;
        }

        setIsLoadingBuy(true);
        const result = await addToCart(productId, quantity, selectedOptions, notes, selectedVariantId || undefined);
        setIsLoadingBuy(false);

        if (result.success) {
            router.push("/keranjang");
        } else {
            toast.error(result.message || "Gagal memasukkan ke keranjang");
        }
    };

    return (
        <>
            {/* HARGA DINAMIS */}
            <div className="bg-[#EBF2FA] rounded-xl p-4 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#1A3C6E" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                
                <div className="flex items-end gap-3 relative z-10">
                    <span className="text-3xl font-black text-[#EE4D2D]">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(finalPrice)}
                    </span>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm text-[#9CA3AF] line-through decoration-1">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(finalOriginalPrice)}
                        </span>
                    </div>
                </div>
            </div>

            {/* PRE-ORDER BADGE */}
            {isPreOrder && (
                <div className="mb-6 flex gap-4 items-start pb-4 border-b border-[#E8E8E8]">
                    <span className="w-24 shrink-0 text-sm font-medium text-[#757575] mt-1">Pre-Order</span>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            <div className="text-sm font-semibold text-[#1F2937]">
                                Waktu Proses: {preOrderDays || 7} Hari
                            </div>
                        </div>
                        <div className="text-[11px] text-[#757575]">Produk ini memerlukan waktu tambahan untuk diproses oleh penjual.</div>
                    </div>
                </div>
            )}

            {/* VARIASI CUSTOM (Database Variants) */}
            {variants && variants.length > 0 ? (
                <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-start">
                    <span className="w-24 shrink-0 text-sm font-medium text-[#757575] mt-1.5">Varian</span>
                    <div className="flex flex-wrap gap-2">
                        {variants.map((v: any) => {
                            const isSelected = selectedVariantId === v.id;
                            const isOutOfStock = v.stock <= 0;
                            return (
                                <button 
                                    key={v.id}
                                    onClick={() => setSelectedVariantId(v.id)}
                                    disabled={isOutOfStock}
                                    className={`px-3 py-1.5 rounded text-sm transition-all border ${
                                        isOutOfStock ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' :
                                        isSelected ? 'border-[#EE4D2D] text-[#EE4D2D] bg-[#FFF0ED]' : 'border-[#E8E8E8] text-[#333333] bg-white hover:border-[#EE4D2D]'
                                    }`}
                                >
                                    {v.name} {isOutOfStock && "(Habis)"}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : customOptions.map((opt, idx) => (
                <div key={idx} className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-start">
                    <span className="w-24 shrink-0 text-sm font-medium text-[#757575] mt-1.5">{opt.name}</span>
                    <div className="flex flex-wrap gap-2">
                        {opt.options.map((choice, i) => {
                            const isSelected = selectedOptions[opt.name] === choice.label;
                            const priceDeltaText = Number(choice.priceDelta) > 0 ? ` (+Rp${choice.priceDelta})` : "";
                            return (
                                <button 
                                    key={i}
                                    onClick={() => handleOptionSelect(opt.name, choice.label)}
                                    className={`px-3 py-1.5 rounded text-sm transition-all border ${isSelected ? 'border-[#EE4D2D] text-[#EE4D2D] bg-[#FFF0ED]' : 'border-[#E8E8E8] text-[#333333] bg-white hover:border-[#EE4D2D]'}`}
                                >
                                    {choice.label} <span className="text-[10px]">{priceDeltaText}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Catatan Pembeli */}
            <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-start">
                <span className="w-24 shrink-0 text-sm font-medium text-[#757575] mt-1.5">Catatan</span>
                <div className="flex-1">
                    <input 
                        type="text" 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Opsional: Tinggalkan pesan ke penjual..." 
                        className="w-full border border-[#D1D5DB] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1A3C6E]" 
                    />
                </div>
            </div>

            {/* Atur Jumlah (Kuantitas) */}
            <div className="mb-8 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
                <span className="w-24 shrink-0 text-sm font-medium text-[#757575]">Kuantitas</span>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[#E8E8E8] rounded bg-white overflow-hidden w-fit">
                        <button 
                            onClick={handleMinus} 
                            disabled={quantity <= minOrder}
                            className="w-8 h-8 flex items-center justify-center text-[#757575] border-r border-[#E8E8E8] hover:bg-[#F8F8F8] transition-colors disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <input 
                            type="text" 
                            value={quantity} 
                            readOnly 
                            className="w-12 h-8 text-center text-sm font-medium text-[#333333] focus:outline-none" 
                        />
                        <button 
                            onClick={handlePlus}
                            disabled={quantity >= stock} 
                            className="w-8 h-8 flex items-center justify-center text-[#757575] border-l border-[#E8E8E8] hover:bg-[#F8F8F8] transition-colors disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                    </div>
                    <div className="text-sm text-[#757575]">
                        Tersisa <strong className="text-[#333333] font-medium">{activeStock}</strong> buah
                        {minOrder > 1 && <span className="ml-2 text-[#EE4D2D] bg-[#FFF0ED] px-1.5 py-0.5 rounded text-xs">Min. Beli {minOrder}</span>}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button 
                    onClick={handleAddToCart}
                    disabled={disabled || isLoadingCart || activeStock === 0}
                    className="flex-1 sm:max-w-[250px] bg-[#FFEEE8] text-[#EE4D2D] border border-[#EE4D2D] py-3 rounded text-sm font-medium hover:bg-[#FFF0ED] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path><line x1="12" y1="9" x2="18" y2="9"></line><line x1="15" y1="6" x2="15" y2="12"></line></svg>
                    {isLoadingCart ? "Memproses..." : "Masukkan Keranjang"}
                </button>
                <button 
                    onClick={handleBuyNow}
                    disabled={disabled || isLoadingBuy || activeStock === 0}
                    className="flex-1 sm:max-w-[250px] bg-[#EE4D2D] text-white py-3 rounded text-sm font-medium hover:bg-[#E04626] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isLoadingBuy ? "Memproses..." : "Beli Sekarang"}
                </button>
            </div>
        </>
    );
}

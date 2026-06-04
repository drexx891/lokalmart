"use client";

import { useState } from "react";
import Link from "next/link";
import { updateCartItemQuantity, removeCartItem } from "@/app/actions/cart";
import { CheckoutButton } from "@/components/CartItemControls";
import VoucherInput from "@/components/cart/VoucherInput";
import toast from "react-hot-toast";

type CartItem = {
    id: string;
    quantity: number;
    price: number;
    selectedOptions?: any;
    notes?: string | null;
    product: {
        id: string;
        name: string;
        imageUrl: string | null;
        supplier: { companyName: string } | null;
    }
};

interface CartClientProps {
    initialItems: CartItem[];
    initialDiscount: number;
}

export default function CartClient({ initialItems, initialDiscount }: CartClientProps) {
    const [items, setItems] = useState<CartItem[]>(initialItems);
    const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const finalTotal = totalAmount - initialDiscount;

    const formattedTotal = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(finalTotal);

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveItem(itemId);
            return;
        }

        // Optimistic UI Update
        const oldItems = [...items];
        setItems(items.map(i => i.id === itemId ? { ...i, quantity: newQuantity } : i));
        setIsUpdating(prev => ({ ...prev, [itemId]: true }));

        const result = await updateCartItemQuantity(itemId, newQuantity);
        
        setIsUpdating(prev => ({ ...prev, [itemId]: false }));

        if (!result.success) {
            toast.error(result.message || "Gagal memperbarui");
            setItems(oldItems); // Rollback if failed
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        if (!confirm("Hapus produk ini dari keranjang?")) return;

        // Optimistic UI Update
        const oldItems = [...items];
        setItems(items.filter(i => i.id !== itemId));
        setIsUpdating(prev => ({ ...prev, [itemId]: true }));

        const result = await removeCartItem(itemId);
        
        setIsUpdating(prev => ({ ...prev, [itemId]: false }));

        if (!result.success) {
            toast.error(result.message || "Gagal menghapus");
            setItems(oldItems); // Rollback if failed
        } else {
            toast.success("Produk dihapus");
        }
    };

    if (items.length === 0) {
        return (
            <div className="bg-white border border-[#E5E7EB] rounded-sm py-20 flex flex-col items-center justify-center text-[#9CA3AF] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-[#E5E7EB]"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <h3 className="text-lg font-bold text-[#6B7280] mb-2">Keranjang Anda kosong</h3>
                <p>Temukan supplier terpercaya dan tambahkan produk ke keranjang Anda.</p>
                <Link href="/" className="mt-6 border border-[#1A3C6E] text-[#1A3C6E] px-6 py-2 font-bold rounded-sm hover:bg-[#EBF2FA] transition-colors">
                    Mulai Belanja
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Daftar Item */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="bg-white border border-[#E5E7EB] rounded-sm p-4 hidden md:flex font-bold text-[#1F2937] text-sm shadow-sm">
                    <div className="flex-[3]">Detail Produk</div>
                    <div className="flex-1 text-center">Harga Satuan</div>
                    <div className="flex-1 text-center">Kuantitas</div>
                    <div className="flex-1 text-right">Subtotal</div>
                </div>

                {items.map((item) => {
                    const formattedPrice = new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                    }).format(item.price);
                    
                    const itemTotal = item.price * item.quantity;
                    const formattedItemTotal = new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                    }).format(itemTotal);
                    
                    const isLoading = isUpdating[item.id];

                    // Render selected options
                    let optionsText = "";
                    if (item.selectedOptions) {
                        try {
                            const opts = typeof item.selectedOptions === "string" ? JSON.parse(item.selectedOptions) : item.selectedOptions;
                            optionsText = Object.entries(opts).map(([k, v]) => `${v}`).join(", ");
                        } catch (e) {}
                    }

                    return (
                        <div key={item.id} className={`bg-white border border-[#E5E7EB] rounded-sm p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm transition-opacity ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
                            
                            <div className="flex-[3] flex items-center gap-4 w-full">
                                <div className="w-20 h-20 bg-[#F7F8FA] rounded-sm flex-shrink-0 overflow-hidden flex items-center justify-center p-2 border border-[#E5E7EB]">
                                    {item.product.imageUrl ? (
                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply" />
                                    ) : (
                                        <span className="text-3xl grayscale opacity-30">📦</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Link href={`/produk/${item.product.id}`} className="text-[#1F2937] font-medium hover:text-[#1A3C6E] transition-colors line-clamp-2 leading-tight">
                                        {item.product.name}
                                    </Link>
                                    
                                    {optionsText && (
                                        <div className="text-[11px] text-[#4B5563] bg-[#F3F4F6] px-2 py-1 rounded inline-block mt-1 border border-[#E5E7EB]">
                                            Variasi: <span className="font-semibold">{optionsText}</span>
                                        </div>
                                    )}

                                    {item.notes && (
                                        <div className="text-[11px] text-[#6B7280] italic mt-1 truncate max-w-[200px]">
                                            Catatan: {item.notes}
                                        </div>
                                    )}

                                    <div className="text-xs text-[#9CA3AF] mt-2 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                        {item.product.supplier?.companyName || "Verified Supplier"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 text-center font-bold text-[#1A3C6E] w-full md:w-auto flex justify-between md:block">
                                <span className="md:hidden text-[#6B7280] font-normal">Harga:</span>
                                {formattedPrice}
                            </div>

                            <div className="flex-1 flex justify-center w-full md:w-auto">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center border border-[#E5E7EB] rounded-sm overflow-hidden">
                                        <button 
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            disabled={isLoading}
                                            className="bg-[#F7F8FA] hover:bg-[#E5E7EB] text-[#6B7280] px-3 py-1 font-bold transition-colors disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <span className="text-[#1F2937] font-medium text-sm px-4 bg-white border-x border-[#E5E7EB] py-1 text-center min-w-[40px]">
                                            {item.quantity}
                                        </span>
                                        <button 
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            disabled={isLoading}
                                            className="bg-[#F7F8FA] hover:bg-[#E5E7EB] text-[#6B7280] px-3 py-1 font-bold transition-colors disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveItem(item.id)}
                                        disabled={isLoading}
                                        className="text-[#1A3C6E] text-xs hover:underline font-medium text-center"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 text-right font-bold text-[#1F2937] w-full md:w-auto flex justify-between md:block">
                                <span className="md:hidden text-[#6B7280] font-normal">Subtotal:</span>
                                {formattedItemTotal}
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Ringkasan Belanja */}
            <div className="w-full lg:w-[320px] flex-shrink-0">
                <VoucherInput />
                <div className="bg-white border border-[#E5E7EB] rounded-sm p-5 sticky top-6 shadow-sm mt-4 transition-all">
                    <h2 className="text-lg font-bold text-[#1F2937] mb-4 border-b border-[#E5E7EB] pb-3">Ringkasan Permintaan (RFQ)</h2>
                    
                    <div className="flex justify-between items-center mb-4 text-[#6B7280] text-sm">
                        <span>Total Jenis Barang</span>
                        <span className="font-medium text-[#1F2937]">{items.length} Produk</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4 text-[#6B7280] text-sm">
                        <span>Total Kuantitas</span>
                        <span className="font-medium text-[#1F2937]">{totalQuantity} Pcs</span>
                    </div>
                    
                    <div className="h-px w-full bg-[#E5E7EB] mb-4"></div>
                    
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[#1F2937] font-bold">Estimasi Total</span>
                        <span className="text-[#1A3C6E] font-black text-xl">{formattedTotal}</span>
                    </div>
                    
                    {initialDiscount > 0 && (
                        <div className="flex justify-between items-center mb-4 text-[#6B7280] text-sm">
                            <span className="font-medium text-[#1F2937]">Potongan Voucher</span>
                            <span className="font-medium text-[#1F2937]">- {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(initialDiscount)}</span>
                        </div>
                    )}
                    
                    <CheckoutButton />
                    
                    <p className="text-[10px] text-[#9CA3AF] text-center leading-relaxed">
                        Total harga adalah estimasi. Anda bisa bernegosiasi ongkos kirim dan diskon tambahan dengan supplier.
                    </p>
                </div>
            </div>
        </div>
    );
}

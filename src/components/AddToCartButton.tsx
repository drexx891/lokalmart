"use client";

import { addToCart } from "@/app/actions/cart";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ 
    productId, 
    disabled, 
    variant = "icon" 
}: { 
    productId: string, 
    disabled?: boolean,
    variant?: "icon" | "full"
}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault(); // Mencegah Link trigger (jika di dalam Link)
        e.stopPropagation();

        if (disabled) return;

        setIsLoading(true);
        const result = await addToCart(productId);
        setIsLoading(false);

        if (result.success) {
            toast.success("Produk berhasil ditambahkan ke keranjang", {
                style: { background: '#fff', color: '#333', border: '1px solid #E5E7EB' }
            });
            router.refresh();
        } else {
            toast.error(result.message, {
                style: { background: '#EBF2FA', color: '#1A3C6E', border: '1px solid #BFDBFE' }
            });
        }
    };

    if (variant === "full") {
        return (
            <button 
                onClick={handleAddToCart}
                disabled={disabled || isLoading}
                className="flex-1 bg-[#1A3C6E] text-white py-3.5 rounded-xl font-bold shadow-md shadow-[#1A3C6E]/20 hover:bg-[#2A5FA0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? "Menambahkan..." : "+ Tambah ke Keranjang"}
            </button>
        );
    }

    return (
        <button 
            onClick={handleAddToCart}
            disabled={disabled || isLoading}
            className="w-full bg-white border border-[#1A3C6E] text-[#1A3C6E] py-2 rounded-sm font-bold text-sm mt-3 hover:bg-[#EBF2FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Tambah ke keranjang"
        >
            {isLoading ? (
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
            )}
        </button>
    );
}

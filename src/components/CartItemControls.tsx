"use client";

import { useState } from "react";
import { updateCartItemQuantity, removeCartItem, checkoutCart } from "@/app/actions/cart";
import toast from "react-hot-toast";

interface CartItemControlsProps {
  itemId: string;
  initialQuantity: number;
}

export function CartItemControls({ itemId, initialQuantity }: CartItemControlsProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove();
      return;
    }
    
    setIsLoading(true);
    setQuantity(newQuantity);
    const result = await updateCartItemQuantity(itemId, newQuantity);
    setIsLoading(false);
    
    if (!result.success) {
      toast.error(result.message || "Gagal memperbarui");
      setQuantity(quantity); // Revert on failure
    }
  };

  const handleRemove = async () => {
    if (!confirm("Hapus produk ini dari keranjang?")) return;
    
    setIsLoading(true);
    const result = await removeCartItem(itemId);
    setIsLoading(false);
    
    if (!result.success) {
      toast.error(result.message || "Gagal menghapus");
    } else {
      toast.success("Produk dihapus");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center border border-[#E5E7EB] rounded-sm overflow-hidden">
        <button 
          onClick={() => handleUpdate(quantity - 1)}
          disabled={isLoading}
          className="bg-[#F7F8FA] hover:bg-[#E5E7EB] text-[#6B7280] px-3 py-1 font-bold transition-colors disabled:opacity-50"
        >
          -
        </button>
        <span className="text-[#1F2937] font-medium text-sm px-4 bg-white border-x border-[#E5E7EB] py-1 text-center min-w-[40px]">
          {quantity}
        </span>
        <button 
          onClick={() => handleUpdate(quantity + 1)}
          disabled={isLoading}
          className="bg-[#F7F8FA] hover:bg-[#E5E7EB] text-[#6B7280] px-3 py-1 font-bold transition-colors disabled:opacity-50"
        >
          +
        </button>
      </div>
      <button 
        onClick={handleRemove}
        disabled={isLoading}
        className="text-[#1A3C6E] text-xs hover:underline font-medium text-center"
      >
        Hapus
      </button>
    </div>
  );
}

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = () => {
    setIsLoading(true);
    // Sekarang alihkan ke halaman checkout untuk mengisi alamat terlebih dahulu
    window.location.href = "/checkout";
  };

  return (
    <button 
      onClick={handleCheckout}
      disabled={isLoading}
      className="w-full bg-[#1A3C6E] text-white px-4 py-3 rounded-sm font-bold hover:bg-[#2A5FA0] transition-colors shadow-sm mb-3 disabled:opacity-50"
    >
      {isLoading ? "Memproses..." : "Lanjut ke Pengiriman"}
    </button>
  );
}

"use client";
import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";

export default function VoucherInput({ onSuccess }: { onSuccess?: (discount: number) => void }) {
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();

  const apply = async () => {
    if (!code) return toast.error("Masukkan kode voucher");
    startTransition(async () => {
      try {
        const res = await fetch("/api/voucher/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: code.trim() }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success(`Voucher diterapkan, potongan Rp${data.discountAmount.toLocaleString()}`);
          if (onSuccess) onSuccess(data.discountAmount);
          setCode("");
        } else {
          toast.error(data.message || "Voucher tidak valid");
        }
      } catch (e) {
        toast.error("Terjadi kesalahan saat mengirim voucher");
      }
    });
  };

  return (
    <div className="mt-6 flex gap-2 items-center">
      <input
        type="text"
        placeholder="Masukkan kode voucher"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 border border-[#E5E7EB] rounded-lg p-2 focus:border-[#1A3C6E] transition"
        disabled={isPending}
      />
      <button
        onClick={apply}
        disabled={isPending}
        className="bg-gradient-to-r from-[#1A3C6E] to-[#2A5FA0] text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
      >
        {isPending ? "Menerapkan..." : "Gunakan Voucher"}
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { cancelOrder } from "@/app/actions/order";
import { completeOrder } from "@/app/actions/finance";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function OrderHistoryClient({ invoices }: { invoices: any[] }) {
    const tabs = ["Semua", "Menunggu Bayar", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];
    const [activeTab, setActiveTab] = useState("Semua");
    const [isLoading, setIsLoading] = useState<string | null>(null);
    
    // State untuk Modal Pembatalan (Opsional: disesuaikan jika batal per-invoice atau per-order)
    // Untuk saat ini pembatalan dibiarkan atau diadaptasi, di sini kita hanya buat alert
    const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

    const router = useRouter();

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending":
            case "awaiting_payment":
                return "Menunggu Bayar";
            case "packed":
                return "Diproses";
            case "shipped":
                return "Dikirim";
            case "delivered":
            case "paid":
                return "Selesai";
            case "cancelled":
                return "Dibatalkan";
            default:
                return "Menunggu Bayar";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
            case "awaiting_payment":
                return "bg-yellow-100 text-yellow-800";
            case "packed":
                return "bg-blue-100 text-blue-800";
            case "shipped":
                return "bg-purple-100 text-purple-800";
            case "delivered":
            case "paid":
                return "bg-[#E8F8F5] text-[#2ECC8B]";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const filteredInvoices = activeTab === "Semua" 
        ? invoices 
        : invoices.filter(inv => getStatusText(inv.status) === activeTab);

    const handleCompleteOrder = async (orderId: string) => {
        if (!confirm("Konfirmasi pesanan telah diterima dengan baik? Saldo akan langsung diteruskan ke Penjual.")) return;
        setIsLoading(orderId);
        const res = await completeOrder(orderId);
        setIsLoading(null);
        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            
            <div className="flex items-center gap-3">
                <Link href="/profil" className="md:hidden p-2 bg-white rounded-full shadow-sm text-[#1F2937]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </Link>
                <h1 className="text-2xl font-bold text-[#1F2937]">Riwayat Tagihan & Pesanan</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col">
                
                {/* Tabs */}
                <div className="flex overflow-x-auto hide-scrollbar border-b border-[#E5E7EB]">
                    {tabs.map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'border-[#1A3C6E] text-[#1A3C6E]' : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* List Invoice */}
                <div className="p-4 md:p-6 flex flex-col gap-6">
                    {filteredInvoices.length > 0 ? (
                        filteredInvoices.map(invoice => (
                            <div key={invoice.id} className="border border-[#E5E7EB] rounded-xl overflow-hidden hover:border-[#BFDBFE] hover:shadow-sm transition-all">
                                
                                {/* Header Invoice */}
                                <div className="bg-[#F9FAFB] px-4 py-3 flex items-center justify-between border-b border-[#E5E7EB]">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A3C6E" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                        <span className="font-bold text-[#1F2937] text-sm">
                                            Tagihan: {invoice.id.toUpperCase().substring(0, 13)}
                                        </span>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(invoice.status)}`}>
                                        {getStatusText(invoice.status)}
                                    </span>
                                </div>

                                {/* List Order (Toko) dalam Invoice ini */}
                                <div className="flex flex-col">
                                    {invoice.orders && invoice.orders.map((order: any) => (
                                        <div key={order.id} className="border-b border-[#E5E7EB] last:border-b-0">
                                            <div className="bg-white px-4 py-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                                    <span className="font-bold text-[#4B5563] text-xs">
                                                        {order.supplier?.companyName || "LokalMart Seller"}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className={`text-[10px] font-bold uppercase text-[#1A3C6E]`}>
                                                        Status: {getStatusText(order.status)}
                                                    </span>
                                                    {(order.status === "shipped" || order.status === "delivered") && (
                                                        <button 
                                                            onClick={() => handleCompleteOrder(order.id)}
                                                            disabled={isLoading === order.id}
                                                            className="text-[10px] bg-[#2ECC8B] hover:bg-[#27ae60] text-white px-3 py-1.5 rounded shadow-sm font-bold transition-colors disabled:opacity-50"
                                                        >
                                                            {isLoading === order.id ? "Memproses..." : "Pesanan Diterima"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Item Pertama Order ini */}
                                            <div className="p-4 bg-white">
                                                {order.items && order.items.length > 0 ? (
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-16 h-16 bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg shrink-0 overflow-hidden flex items-center justify-center text-[#9CA3AF]">
                                                            {order.items[0].product?.imageUrl ? (
                                                                <img src={order.items[0].product.imageUrl} alt="Produk" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-[#1F2937] text-sm line-clamp-2 leading-snug">{order.items[0].product?.name || "Produk Tidak Ditemukan"}</h3>
                                                            <div className="text-xs text-[#6B7280] mt-0.5">{order.items[0].quantity} x {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(order.items[0].price)}</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500">Item tidak ditemukan</p>
                                                )}

                                                {order.items && order.items.length > 1 && (
                                                    <div className="text-xs text-[#1A3C6E] font-semibold mt-3 text-center bg-[#EBF2FA] py-1.5 rounded-lg cursor-pointer">
                                                        + {order.items.length - 1} produk lainnya dari toko ini
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Invoice */}
                                <div className="bg-[#F9FAFB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#E5E7EB]">
                                    <div>
                                        <div className="text-[11px] text-[#6B7280] mb-0.5">Total Keseluruhan Tagihan</div>
                                        <div className="text-lg font-bold text-[#1A3C6E]">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(invoice.totalAmount)}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        {invoice.status === "awaiting_payment" && invoice.paymentUrl && (
                                            <a href={invoice.paymentUrl} className="px-6 py-2 text-sm font-bold text-[#1A3C6E] bg-[#F5A623] rounded-lg hover:bg-[#e09612] transition-colors shadow-sm">Bayar Tagihan Ini</a>
                                        )}
                                        {invoice.status === "paid" && (
                                            <button className="px-6 py-2 text-sm font-bold text-[#1A3C6E] border border-[#1A3C6E] rounded-lg hover:bg-[#EBF2FA] transition-colors">Lihat Invoice</button>
                                        )}
                                    </div>
                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-4 text-[#9CA3AF]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </div>
                            <h3 className="font-bold text-[#1F2937] text-lg mb-1">Belum ada tagihan</h3>
                            <p className="text-sm text-[#6B7280] mb-6">Pesan {activeTab.toLowerCase()} kamu akan muncul di sini.</p>
                            <Link href="/" className="bg-[#1A3C6E] text-white font-bold px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#2A5FA0] transition-colors">Mulai Belanja</Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

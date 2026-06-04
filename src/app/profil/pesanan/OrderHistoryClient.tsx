"use client";

import { useState } from "react";
import Link from "next/link";
import { cancelOrder } from "@/app/actions/order";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function OrderHistoryClient({ orders }: { orders: any[] }) {
    const tabs = ["Semua", "Menunggu Bayar", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];
    const [activeTab, setActiveTab] = useState("Semua");
    const [isLoading, setIsLoading] = useState<string | null>(null);
    
    // State untuk Modal Pembatalan
    const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState<string>("");
    const [otherReason, setOtherReason] = useState<string>("");

    const cancelReasonsList = [
        "Ingin mengubah alamat pengiriman",
        "Ingin mengubah rincian pesanan (varian/ukuran)",
        "Menemukan harga yang lebih murah di toko lain",
        "Penjual tidak merespons / lambat",
        "Berubah pikiran",
        "Lainnya"
    ];

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

    const handleCancelClick = (orderId: string) => {
        setCancelOrderId(orderId);
        setCancelReason("");
        setOtherReason("");
    };

    const handleConfirmCancel = async () => {
        if (!cancelOrderId) return;
        
        const finalReason = cancelReason === "Lainnya" ? otherReason : cancelReason;
        if (!finalReason.trim()) {
            toast.error("Silakan pilih atau isi alasan pembatalan");
            return;
        }

        setIsLoading(cancelOrderId);
        const res = await cancelOrder(cancelOrderId, finalReason);
        setIsLoading(null);
        setCancelOrderId(null); // Tutup modal
        
        if (res.success) {
            toast.success("Pesanan berhasil dibatalkan");
            router.refresh();
        } else {
            toast.error(res.message);
        }
    };

    const filteredOrders = activeTab === "Semua" 
        ? orders 
        : orders.filter(o => getStatusText(o.status) === activeTab);

    return (
        <div className="flex flex-col gap-6">
            
            <div className="flex items-center gap-3">
                <Link href="/profil" className="md:hidden p-2 bg-white rounded-full shadow-sm text-[#1F2937]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </Link>
                <h1 className="text-2xl font-bold text-[#1F2937]">Riwayat Pesanan</h1>
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

                {/* List Pesanan */}
                <div className="p-4 md:p-6 flex flex-col gap-4">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <div key={order.id} className="border border-[#E5E7EB] rounded-xl overflow-hidden hover:border-[#BFDBFE] hover:shadow-sm transition-all">
                                
                                {/* Header Kartu */}
                                <div className="bg-[#F9FAFB] px-4 py-3 flex items-center justify-between border-b border-[#E5E7EB]">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                                        <span className="font-bold text-[#1F2937] text-sm">
                                            {order.items && order.items.length > 0 ? order.items[0].product?.supplier?.companyName || "LokalMart Seller" : "LokalMart Seller"}
                                        </span>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>

                                {/* Konten Kartu */}
                                <div className="p-4 border-b border-[#E5E7EB]">
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
                                            Tampilkan {order.items.length - 1} produk lainnya
                                        </div>
                                    )}
                                </div>

                                {/* Footer Kartu */}
                                <div className="bg-[#F9FAFB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="text-[11px] text-[#6B7280] mb-0.5">Total Pesanan</div>
                                        <div className="text-lg font-bold text-[#1A3C6E]">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(order.totalAmount)}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        {(order.status === "pending" || order.status === "awaiting_payment" || order.status === "packed") && (
                                            <button 
                                                onClick={() => handleCancelClick(order.id)}
                                                disabled={isLoading === order.id}
                                                className="px-4 py-2 text-sm font-bold text-[#E24B4A] border border-[#E24B4A] rounded-lg hover:bg-[#FEF2F2] transition-colors disabled:opacity-50"
                                            >
                                                {isLoading === order.id ? "Memproses..." : "Batalkan"}
                                            </button>
                                        )}
                                        {order.status === "awaiting_payment" && order.paymentUrl && (
                                            <a href={order.paymentUrl} className="px-4 py-2 text-sm font-bold text-[#1A3C6E] bg-[#F5A623] rounded-lg hover:bg-[#e09612] transition-colors shadow-sm">Bayar Sekarang</a>
                                        )}
                                        {order.status === "shipped" && (
                                            <>
                                                <button className="px-4 py-2 text-sm font-bold text-[#1A3C6E] border border-[#1A3C6E] rounded-lg hover:bg-[#EBF2FA] transition-colors">Lacak Paket</button>
                                                <button className="px-4 py-2 text-sm font-bold text-white bg-[#1A3C6E] rounded-lg hover:bg-[#2A5FA0] transition-colors shadow-sm">Konfirmasi Terima</button>
                                            </>
                                        )}
                                        {(order.status === "paid" || order.status === "delivered") && (
                                            <>
                                                <button className="px-4 py-2 text-sm font-bold text-[#1A3C6E] border border-[#1A3C6E] rounded-lg hover:bg-[#EBF2FA] transition-colors">Beli Lagi</button>
                                                <button className="px-4 py-2 text-sm font-bold text-[#1A3C6E] bg-[#F5A623] rounded-lg hover:bg-[#e09612] transition-colors shadow-sm">Beri Ulasan</button>
                                            </>
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
                            <h3 className="font-bold text-[#1F2937] text-lg mb-1">Belum ada pesanan</h3>
                            <p className="text-sm text-[#6B7280] mb-6">Pesan {activeTab.toLowerCase()} kamu akan muncul di sini.</p>
                            <Link href="/" className="bg-[#1A3C6E] text-white font-bold px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#2A5FA0] transition-colors">Mulai Belanja</Link>
                        </div>
                    )}
                </div>

            </div>

            {/* Modal Konfirmasi Pembatalan */}
            {cancelOrderId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
                        <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center bg-[#F9FAFB]">
                            <h3 className="font-bold text-[#1F2937] text-lg">Pilih Alasan Pembatalan</h3>
                            <button onClick={() => setCancelOrderId(null)} className="text-[#9CA3AF] hover:text-[#1F2937]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
                            {cancelReasonsList.map(reason => (
                                <label key={reason} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${cancelReason === reason ? 'border-[#E24B4A] bg-[#FEF2F2]' : 'border-[#E5E7EB] hover:border-[#D1D5DB]'}`}>
                                    <input 
                                        type="radio" 
                                        name="cancelReason" 
                                        className="mt-0.5 w-4 h-4 text-[#E24B4A] focus:ring-[#E24B4A]"
                                        checked={cancelReason === reason}
                                        onChange={() => setCancelReason(reason)}
                                    />
                                    <span className="font-semibold text-[#1F2937] text-sm leading-tight">{reason}</span>
                                </label>
                            ))}
                            
                            {cancelReason === "Lainnya" && (
                                <div className="mt-3">
                                    <textarea 
                                        className="w-full border border-[#D1D5DB] rounded-lg p-3 text-sm focus:ring-[#E24B4A] focus:border-[#E24B4A] outline-none" 
                                        rows={3} 
                                        placeholder="Ketik alasan pembatalan Anda di sini..."
                                        value={otherReason}
                                        onChange={(e) => setOtherReason(e.target.value)}
                                    ></textarea>
                                </div>
                            )}
                        </div>
                        <div className="p-5 border-t border-[#E5E7EB] flex gap-3">
                            <button 
                                onClick={() => setCancelOrderId(null)}
                                className="flex-1 px-4 py-3 font-bold text-[#4B5563] bg-[#F3F4F6] rounded-xl hover:bg-[#E5E7EB] transition-colors"
                            >
                                Nanti Saja
                            </button>
                            <button 
                                onClick={handleConfirmCancel}
                                disabled={!cancelReason || (cancelReason === "Lainnya" && !otherReason.trim())}
                                className="flex-1 px-4 py-3 font-bold text-white bg-[#E24B4A] rounded-xl hover:bg-[#C83E3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Konfirmasi Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

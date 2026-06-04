import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) redirect("/login");

    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    // Fallback Mockup Data in case DB is offline
    let order: any = {
        id: orderId || "ORD-123456",
        status: "shipped",
        totalAmount: 250000,
        createdAt: new Date(Date.now() - 86400000 * 2),
        shippingName: "Budi Santoso",
        shippingPhone: "081234567890",
        shippingAddress: "Jl. Jend. Sudirman No. 12, Kebayoran Baru",
        shippingCity: "Jakarta Selatan",
        shippingProvince: "DKI Jakarta",
        shippingZipCode: "12190",
        courier: "J&T Express",
        resiNumber: "JT987654321",
        items: [
            {
                id: "item_1",
                product: { name: "Sepatu Sneaker Pria Hitam 42", imageUrl: null },
                price: 150000,
                quantity: 1
            },
            {
                id: "item_2",
                product: { name: "Kaos Polos Putih XL", imageUrl: null },
                price: 50000,
                quantity: 2
            }
        ],
        trackingHistory: [
            {
                id: "trk_1",
                status: "paid",
                description: "Pembayaran telah diverifikasi. Pesanan diteruskan ke penjual.",
                createdAt: new Date(Date.now() - 86400000 * 2)
            },
            {
                id: "trk_2",
                status: "packed",
                description: "Pesanan sedang dikemas oleh penjual.",
                createdAt: new Date(Date.now() - 86400000 * 1.5)
            },
            {
                id: "trk_3",
                status: "shipped",
                description: "Paket telah diserahkan ke pihak kurir (J&T Express).",
                createdAt: new Date(Date.now() - 86400000 * 1)
            },
            {
                id: "trk_4",
                status: "shipped",
                description: "Paket sedang dalam perjalanan menuju kota tujuan.",
                createdAt: new Date(Date.now() - 43200000)
            }
        ]
    };

    try {
        const dbOrder = await (prisma as any).order.findUnique({
            where: { id: orderId },
            include: {
                items: { include: { product: true } },
                trackingHistory: { orderBy: { createdAt: 'desc' } }
            }
        });

        if (dbOrder) {
            order = dbOrder;
        }
    } catch (error) {
        console.error("DB Error fetching order tracking:", error);
    }

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'pending':
            case 'awaiting_payment': return 'text-orange-600 bg-orange-100';
            case 'paid': 
            case 'packed': return 'text-blue-600 bg-blue-100';
            case 'shipped': return 'text-[#1A3C6E] bg-[#EBF2FA]';
            case 'delivered': return 'text-green-600 bg-green-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status: string) => {
        switch(status) {
            case 'pending': return 'Menunggu Pembayaran';
            case 'awaiting_payment': return 'Belum Dibayar';
            case 'paid': return 'Sudah Dibayar';
            case 'packed': return 'Sedang Dikemas';
            case 'shipped': return 'Sedang Dikirim';
            case 'delivered': return 'Selesai';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            <div className="border-b border-[#E5E7EB] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/profil/pesanan" className="text-[#6B7280] text-sm hover:text-[#1A3C6E] flex items-center gap-1 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Kembali ke Daftar Pesanan
                    </Link>
                    <h1 className="text-xl font-bold text-[#1F2937]">Detail Pesanan</h1>
                    <p className="text-sm text-[#6B7280] mt-1">ID Pesanan: <span className="font-bold text-[#1A3C6E]">{order.id}</span></p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-bold text-sm ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Kiri: Daftar Produk & Alamat */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                        <div className="bg-[#F9FAFB] p-4 border-b border-[#E5E7EB]">
                            <h2 className="font-bold text-[#1F2937]">Produk yang Dibeli</h2>
                        </div>
                        <div className="p-4 flex flex-col gap-4">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-[#F3F4F6] rounded-lg border border-[#E5E7EB] flex items-center justify-center overflow-hidden shrink-0">
                                        {item.product.imageUrl ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xl opacity-30">📦</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-[#1F2937] text-sm">{item.product.name}</h3>
                                        <p className="text-xs text-[#6B7280] mt-1">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="font-bold text-[#1F2937] text-sm">
                                        Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-[#F9FAFB] p-4 border-t border-[#E5E7EB] flex justify-between items-center">
                            <span className="font-semibold text-[#6B7280]">Total Belanja</span>
                            <span className="font-black text-[#1A3C6E] text-lg">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <div className="border border-[#E5E7EB] rounded-xl p-4">
                        <h2 className="font-bold text-[#1F2937] mb-3">Info Pengiriman</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-[#6B7280] block mb-1">Kurir</span>
                                <span className="font-bold text-[#1F2937]">{order.courier || "-"}</span>
                            </div>
                            <div>
                                <span className="text-[#6B7280] block mb-1">No. Resi</span>
                                <span className="font-bold text-[#1A3C6E]">{order.resiNumber || "Belum Tersedia"}</span>
                            </div>
                            <div className="md:col-span-2 mt-2">
                                <span className="text-[#6B7280] block mb-1">Alamat Tujuan</span>
                                <p className="font-bold text-[#1F2937] mb-1">{order.shippingName} ({order.shippingPhone})</p>
                                <p className="text-[#4B5563]">
                                    {order.shippingAddress}, {order.shippingCity}, {order.shippingProvince} {order.shippingZipCode}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kanan: Timeline Lacak */}
                <div>
                    <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white sticky top-6">
                        <h2 className="font-bold text-[#1F2937] mb-6 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            Lacak Pengiriman
                        </h2>

                        <div className="relative border-l-2 border-[#E5E7EB] ml-3 pl-6 space-y-8">
                            {order.trackingHistory && order.trackingHistory.length > 0 ? (
                                // Pastikan history sudah diurutkan dari terbaru ke terlama
                                order.trackingHistory.map((track: any, index: number) => (
                                    <div key={track.id} className="relative">
                                        <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white ${index === 0 ? 'bg-[#1A3C6E] shadow-[0_0_0_3px_#EBF2FA]' : 'bg-[#D1D5DB]'}`}></div>
                                        <p className={`font-bold ${index === 0 ? 'text-[#1A3C6E]' : 'text-[#4B5563]'} text-sm`}>
                                            {getStatusText(track.status)}
                                        </p>
                                        <p className="text-xs text-[#6B7280] mt-1">{track.description}</p>
                                        <p className="text-[10px] text-[#9CA3AF] mt-2 font-medium">
                                            {new Date(track.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="relative">
                                    <div className="absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white bg-[#1A3C6E] shadow-[0_0_0_3px_#EBF2FA]"></div>
                                    <p className="font-bold text-[#1A3C6E] text-sm">Pesanan Dibuat</p>
                                    <p className="text-xs text-[#6B7280] mt-1">Menunggu konfirmasi pembayaran.</p>
                                    <p className="text-[10px] text-[#9CA3AF] mt-2 font-medium">
                                        {new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

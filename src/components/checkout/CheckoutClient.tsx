"use client";

import { useState, useEffect } from "react";
import { checkoutCart } from "@/app/actions/cart";
import { checkVoucher } from "@/app/actions/voucher";
import toast from "react-hot-toast";
import Link from "next/link";

interface Address {
    id: string;
    label: string;
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    street: string;
    zipCode: string;
    isPrimary: boolean;
}

const shippingOptions = [
    { id: 'jne', name: 'JNE Reguler', price: 20000, eta: '2-3 Hari' },
    { id: 'jnt', name: 'J&T Express', price: 25000, eta: '1-2 Hari' },
    { id: 'sicepat', name: 'Sicepat HALU', price: 15000, eta: '3-5 Hari' }
];

const paymentOptions = [
    {
        category: "Transfer Bank (Virtual Account)",
        methods: ["BCA Virtual Account", "Mandiri Virtual Account", "BNI Virtual Account", "BRI Virtual Account"]
    },
    {
        category: "E-Wallet",
        methods: ["GoPay", "OVO", "DANA", "ShopeePay"]
    },
    {
        category: "Minimarket",
        methods: ["Indomaret", "Alfamart"]
    },
    {
        category: "Bayar di Tempat",
        methods: ["COD (Bayar di Tempat)"]
    }
];

export default function CheckoutClient({ savedAddresses, cartTotal, maxPreOrderDays = 0, isCodAvailable = true }: { savedAddresses: Address[], cartTotal: number, maxPreOrderDays?: number, isCodAvailable?: boolean }) {
    const [selectedAddressId, setSelectedAddressId] = useState<string>(
        savedAddresses.find(a => a.isPrimary)?.id || savedAddresses[0]?.id || ""
    );
    const [selectedCourierId, setSelectedCourierId] = useState<string>(shippingOptions[0].id);
    const [paymentMethod, setPaymentMethod] = useState<string>("BCA Virtual Account");
    const [isLoading, setIsLoading] = useState(false);

    // Voucher State
    const [voucherCodeInput, setVoucherCodeInput] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState<{
        code: string;
        discountProduct: number;
        discountShipping: number;
        type: string;
    } | null>(null);
    const [isVoucherLoading, setIsVoucherLoading] = useState(false);

    const selectedCourier = shippingOptions.find(c => c.id === selectedCourierId)!;

    // Tambah Waktu PO (Pre-Order) jika ada
    const generateETA = (baseEta: string) => {
        if (!maxPreOrderDays || maxPreOrderDays === 0) return baseEta;
        // Misal: "2-3 Hari" + 7 Hari = "9-10 Hari"
        try {
            const matches = baseEta.match(/(\d+)-(\d+)/);
            if (matches) {
                const min = parseInt(matches[1]) + maxPreOrderDays;
                const max = parseInt(matches[2]) + maxPreOrderDays;
                return `${min}-${max} Hari (PO ${maxPreOrderDays} Hari)`;
            }
            return `${baseEta} + PO ${maxPreOrderDays} Hari`;
        } catch {
            return baseEta;
        }
    };
    
    const currentETA = generateETA(selectedCourier.eta);

    // Hitung Ulang Voucher jika kurir berubah (karena gratis ongkir terpengaruh biaya ongkir kurir)
    useEffect(() => {
        if (appliedVoucher?.type === 'free_shipping') {
            handleApplyVoucher(appliedVoucher.code);
        }
    }, [selectedCourierId]);

    const handleApplyVoucher = async (codeToApply?: string) => {
        const code = codeToApply || voucherCodeInput;
        if (!code) {
            toast.error("Masukkan kode voucher terlebih dahulu");
            return;
        }

        setIsVoucherLoading(true);
        const res = await checkVoucher(code, cartTotal, selectedCourier.price);
        setIsVoucherLoading(false);

        if (res.success) {
            setAppliedVoucher({
                code: code,
                discountProduct: res.discountAmount || 0,
                discountShipping: res.discountShipping || 0,
                type: res.voucherType || 'nominal'
            });
            if (!codeToApply) toast.success("Voucher berhasil digunakan!");
        } else {
            setAppliedVoucher(null);
            if (!codeToApply) toast.error(res.message || "Voucher tidak valid");
        }
    };

    const handleRemoveVoucher = () => {
        setAppliedVoucher(null);
        setVoucherCodeInput("");
    };

    const handleCheckout = async () => {
        const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);
        if (!selectedAddress && savedAddresses.length > 0) {
            toast.error("Silakan pilih alamat pengiriman");
            return;
        }

        if (savedAddresses.length === 0) {
            toast.error("Anda belum memiliki alamat. Silakan tambah alamat terlebih dahulu.");
            window.location.href = "/profil/alamat";
            return;
        }

        setIsLoading(true);
        const result = await checkoutCart({
            shippingName: selectedAddress!.recipientName,
            shippingPhone: selectedAddress!.phone,
            shippingProvince: selectedAddress!.province,
            shippingCity: selectedAddress!.city,
            shippingAddress: selectedAddress!.street,
            shippingZipCode: selectedAddress!.zipCode,
            courier: selectedCourier.name,
            shippingCost: selectedCourier.price,
            paymentMethod: paymentMethod,
            voucherCode: appliedVoucher?.code
        });
        
        setIsLoading(false);

        if (result.success) {
            toast.success(result.message || "Mengarahkan ke pembayaran...", {
                style: { background: '#fff', color: '#333', border: '1px solid #E5E7EB' }
            });
            if (result.redirectUrl) {
                window.location.href = result.redirectUrl;
            }
        } else {
            toast.error(result.message || "Gagal Checkout", {
                style: { background: '#EBF2FA', color: '#1A3C6E', border: '1px solid #BFDBFE' }
            });
        }
    };

    const finalShippingCost = selectedCourier.price - (appliedVoucher?.discountShipping || 0);
    const totalTagihan = (cartTotal - (appliedVoucher?.discountProduct || 0)) + finalShippingCost;

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
                
                {/* Pilih Alamat */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A3C6E" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            Alamat Pengiriman
                        </h2>
                        <Link href="/profil/alamat" className="text-sm font-bold text-[#1A3C6E] hover:underline">Tambah Alamat Baru</Link>
                    </div>

                    {savedAddresses.length === 0 ? (
                        <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] p-4 rounded-xl text-sm">
                            Anda belum menambahkan alamat pengiriman. <Link href="/profil/alamat" className="font-bold underline">Tambah sekarang</Link>.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {savedAddresses.map(addr => (
                                <label key={addr.id} className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-[#1A3C6E] bg-[#F7F9FC]' : 'border-[#E5E7EB] hover:border-[#D1D5DB]'}`}>
                                    <input 
                                        type="radio" 
                                        name="address" 
                                        className="mt-1 w-4 h-4 text-[#1A3C6E] border-gray-300 focus:ring-[#1A3C6E]"
                                        checked={selectedAddressId === addr.id}
                                        onChange={() => setSelectedAddressId(addr.id)}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-[#1F2937]">{addr.recipientName}</span>
                                            <span className="text-xs bg-[#E5E7EB] px-2 py-0.5 rounded text-[#4B5563] font-semibold">{addr.label}</span>
                                            {addr.isPrimary && <span className="text-[10px] bg-[#1A3C6E] text-white px-2 py-0.5 rounded font-bold">UTAMA</span>}
                                        </div>
                                        <p className="text-sm text-[#4B5563] font-medium">{addr.phone}</p>
                                        <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">
                                            {addr.street}, {addr.city}, {addr.province} {addr.zipCode}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pilih Kurir */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
                    <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                        Opsi Pengiriman & Estimasi
                    </h2>
                    
                    {maxPreOrderDays > 0 && (
                        <div className="mb-4 bg-[#FFF9F0] border border-[#F5A623] text-[#935D05] p-3 rounded-lg text-sm font-medium flex items-start gap-2">
                            <svg className="shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            Terdapat barang Pre-Order di keranjang Anda. Estimasi kedatangan telah disesuaikan dengan waktu proses terlama ({maxPreOrderDays} Hari).
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {shippingOptions.map(c => (
                            <label key={c.id} className={`flex flex-col gap-2 p-4 rounded-xl border cursor-pointer transition-colors ${selectedCourierId === c.id ? 'border-[#F5A623] bg-[#FFF9F0]' : 'border-[#E5E7EB] hover:border-[#D1D5DB]'}`}>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="radio" 
                                        name="courier" 
                                        className="w-4 h-4 text-[#F5A623] border-gray-300 focus:ring-[#F5A623]"
                                        checked={selectedCourierId === c.id}
                                        onChange={() => setSelectedCourierId(c.id)}
                                    />
                                    <span className="font-bold text-[#1F2937]">{c.name}</span>
                                </div>
                                <div className="pl-7">
                                    <p className="text-[#E24B4A] font-bold">
                                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(c.price)}
                                    </p>
                                    <p className="text-xs text-[#6B7280] font-medium mt-1">
                                        Estimasi tiba: <span className="text-[#1F2937]">{generateETA(c.eta)}</span>
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Metode Pembayaran */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
                    <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2ECC8B" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                        Metode Pembayaran
                    </h2>
                    
                    <div className="space-y-6">
                        {!isCodAvailable && (
                            <div className="bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] p-4 rounded-xl text-sm font-medium mb-4 flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                <span>Metode COD (Bayar di Tempat) dinonaktifkan karena salah satu toko dalam keranjang ini tidak mengizinkan opsi COD.</span>
                            </div>
                        )}
                        {paymentOptions.map((group) => (
                            <div key={group.category}>
                                <h3 className="text-sm font-semibold text-[#6B7280] mb-3">{group.category}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {group.methods.map((method) => {
                                        const isCodMethod = method.includes("COD");
                                        const isDisabled = isCodMethod && !isCodAvailable;
                                        
                                        return (
                                            <label key={method} className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                                                isDisabled 
                                                    ? 'border-[#E5E7EB] bg-[#F9FAFB] opacity-60 cursor-not-allowed'
                                                    : paymentMethod === method 
                                                        ? 'border-[#2ECC8B] bg-[#F0FDF4] cursor-pointer' 
                                                        : 'border-[#E5E7EB] hover:border-[#D1D5DB] cursor-pointer'
                                            }`}>
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    className="w-4 h-4 text-[#2ECC8B] border-gray-300 focus:ring-[#2ECC8B] disabled:bg-gray-200"
                                                    checked={paymentMethod === method}
                                                    onChange={() => {
                                                        if (!isDisabled) setPaymentMethod(method);
                                                    }}
                                                    disabled={isDisabled}
                                                />
                                                <span className={`font-semibold text-sm ${isDisabled ? 'text-[#9CA3AF]' : 'text-[#1F2937]'}`}>
                                                    {method}
                                                </span>
                                                {paymentMethod === method && !isDisabled && (
                                                    <svg className="ml-auto" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2ECC8B" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Ringkasan */}
            <div className="w-full lg:w-[380px] shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 sticky top-6">
                    <h2 className="text-lg font-bold text-[#1F2937] mb-6 border-b border-[#E5E7EB] pb-4">Ringkasan Pesanan</h2>
                    
                    {/* Area Voucher */}
                    <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                        <h3 className="text-sm font-bold text-[#1F2937] mb-3">Makin Hemat Pakai Promo</h3>
                        {appliedVoucher ? (
                            <div className="flex items-center justify-between bg-[#F0FDF4] border border-[#2ECC8B] p-3 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2ECC8B" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    <div>
                                        <span className="font-bold text-[#2ECC8B] text-sm uppercase">{appliedVoucher.code}</span>
                                        <p className="text-[10px] text-[#2ECC8B]">Voucher Berhasil Dipakai</p>
                                    </div>
                                </div>
                                <button onClick={handleRemoveVoucher} className="text-[#E24B4A] text-xs font-bold hover:underline">Hapus</button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Masukkan Kode Voucher"
                                    className="flex-1 border border-[#E5E7EB] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3C6E] focus:ring-1 focus:ring-[#1A3C6E] uppercase"
                                    value={voucherCodeInput}
                                    onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                                />
                                <button 
                                    onClick={() => handleApplyVoucher()}
                                    disabled={isVoucherLoading || !voucherCodeInput}
                                    className="bg-[#1A3C6E] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#122A4F] disabled:opacity-50 transition-colors"
                                >
                                    {isVoucherLoading ? "..." : "Pakai"}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-[#6B7280] text-sm">
                            <span>Total Harga Produk</span>
                            <span className="font-semibold text-[#1F2937]">
                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(cartTotal)}
                            </span>
                        </div>
                        {appliedVoucher?.discountProduct ? (
                            <div className="flex justify-between text-[#2ECC8B] text-sm font-medium">
                                <span>Diskon Produk</span>
                                <span>-{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(appliedVoucher.discountProduct)}</span>
                            </div>
                        ) : null}
                        <div className="flex justify-between text-[#6B7280] text-sm">
                            <span>Ongkos Kirim ({selectedCourier.name})</span>
                            <span className="font-semibold text-[#1F2937]">
                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(selectedCourier.price)}
                            </span>
                        </div>
                        {appliedVoucher?.discountShipping ? (
                            <div className="flex justify-between text-[#2ECC8B] text-sm font-medium">
                                <span>Diskon Ongkir</span>
                                <span>-{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(appliedVoucher.discountShipping)}</span>
                            </div>
                        ) : null}
                    </div>

                    <div className="border-t border-[#E5E7EB] pt-4 mb-6">
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-[#6B7280]">Estimasi Tiba</span>
                            <span className="font-bold text-[#1F2937] text-right">{currentETA}</span>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                            <span className="font-bold text-[#1F2937]">Total Tagihan</span>
                            <span className="text-2xl font-black text-[#E24B4A]">
                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalTagihan)}
                            </span>
                        </div>
                    </div>

                    <button 
                        onClick={handleCheckout}
                        disabled={isLoading || savedAddresses.length === 0}
                        className="w-full bg-[#E24B4A] hover:bg-[#C83E3D] text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                        {isLoading ? "Memproses..." : "Bayar Sekarang"}
                    </button>
                    
                    <p className="text-center text-xs text-[#9CA3AF] mt-4">
                        Dengan menekan tombol bayar, Anda menyetujui Syarat & Ketentuan Belio.
                    </p>
                </div>
            </div>
        </div>
    );
}

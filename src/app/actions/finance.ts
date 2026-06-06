"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function completeOrder(orderId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, message: "Silakan login terlebih dahulu" };
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { supplier: true }
        });

        if (!order) {
            return { success: false, message: "Pesanan tidak ditemukan" };
        }

        if (order.userId !== user.id) {
            return { success: false, message: "Akses ditolak" };
        }

        if (order.status === "completed") {
            return { success: false, message: "Pesanan ini sudah selesai" };
        }

        if (order.status === "pending" || order.status === "cancelled") {
            return { success: false, message: "Pesanan belum dikirim, tidak dapat diselesaikan" };
        }

        if (!order.supplierId) {
            return { success: false, message: "Data toko tidak valid pada pesanan ini" };
        }

        // Jalankan transaksi
        await prisma.$transaction(async (tx) => {
            // 1. Update status Order
            await tx.order.update({
                where: { id: order.id },
                data: { status: "completed" }
            });

            // 2. Tambahkan history tracking
            await tx.orderTracking.create({
                data: {
                    orderId: order.id,
                    status: "completed",
                    description: "Pesanan telah diterima dan diselesaikan oleh pembeli."
                }
            });

            // 3. Pastikan Wallet supplier ada
            let wallet = await tx.wallet.findUnique({
                where: { supplierId: order.supplierId! }
            });

            if (!wallet) {
                wallet = await tx.wallet.create({
                    data: {
                        supplierId: order.supplierId!,
                        balance: 0
                    }
                });
            }

            // 4. Tambahkan transaksi masuk ke dompet (Potong komisi jika ada, sementara kita berikan 100% atau bisa diatur nanti)
            // Di sini kita asumsikan 100% masuk ke saldo (tanpa potongan komisi)
            const revenue = order.totalAmount;

            await tx.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    amount: revenue,
                    type: "order_revenue",
                    description: `Pendapatan dari pesanan ${order.id}`,
                    referenceId: order.id
                }
            });

            // 5. Update saldo Wallet
            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: {
                        increment: revenue
                    }
                }
            });
        });

        revalidatePath(`/profil/pesanan/${orderId}`);
        revalidatePath("/profil/pesanan");
        return { success: true, message: "Pesanan diselesaikan. Uang telah diteruskan ke penjual." };

    } catch (error: any) {
        console.error("Complete order error:", error);
        return { success: false, message: error.message || "Gagal menyelesaikan pesanan" };
    }
}

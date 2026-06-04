"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";

export async function cancelOrder(orderId: string, reason: string = "Dibatalkan oleh pembeli") {
    try {
        const user = await getCurrentUser();
        
        if (!user) {
            throw new Error("Silakan masuk (login) terlebih dahulu");
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            throw new Error("Pesanan tidak ditemukan");
        }

        if (order.userId !== user.id) {
            throw new Error("Akses ditolak");
        }

        // Hanya pesanan dengan status tertentu yang bisa dibatalkan
        const cancellableStatuses = ["pending", "awaiting_payment", "packed"];
        if (!cancellableStatuses.includes(order.status)) {
            throw new Error("Pesanan ini sudah tidak dapat dibatalkan karena sedang diproses atau sudah dikirim.");
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status: "cancelled" }
        });

        // Rekam histori pelacakan pembatalan dengan alasan dari user
        await prisma.orderTracking.create({
            data: {
                orderId: orderId,
                status: "cancelled",
                description: `Pesanan dibatalkan: ${reason}`
            }
        });

        revalidatePath("/profil/pesanan");
        return { success: true, message: "Pesanan berhasil dibatalkan" };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
}

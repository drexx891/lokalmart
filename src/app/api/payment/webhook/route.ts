import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Midtrans mengirimkan order_id, transaction_status, gross_amount, dll.
        const {
            order_id,
            transaction_status,
            fraud_status,
            signature_key,
            status_code,
            gross_amount
        } = body;

        // Validasi keamanan Signature Key (Sangat penting agar tidak ditembak hacker)
        // Rumus: SHA512(order_id + status_code + gross_amount + ServerKey)
        const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-TZiFwQc0E9Bq-KlsB_uU_d1g';
        const hash = crypto.createHash("sha512");
        hash.update(order_id + status_code + gross_amount + serverKey);
        const calculatedSignature = hash.digest("hex");

        if (signature_key !== calculatedSignature) {
            return NextResponse.json({ message: "Invalid Signature" }, { status: 403 });
        }

        // Midtrans order_id kita formatnya: orderId-timestamp. Kita ambil orderId aslinya.
        const dbOrderId = order_id.split("-")[0];

        let newStatus = "awaiting_payment";

        if (transaction_status === 'capture') {
            if (fraud_status === 'challenge') {
                newStatus = "pending"; // Menunggu review
            } else if (fraud_status === 'accept') {
                newStatus = "packed"; // Kartu kredit berhasil, mulai kemas
            }
        } else if (transaction_status === 'settlement') {
            newStatus = "packed"; // Uang diterima, mulai kemas
        } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
            newStatus = "cancelled";
        } else if (transaction_status === 'pending') {
            newStatus = "awaiting_payment";
        }

        // Update status order di database
        await prisma.order.update({
            where: { id: dbOrderId },
            data: { status: newStatus }
        });

        // Tambah tracking history jika berhasil bayar
        if (newStatus === "packed") {
            await prisma.orderTracking.create({
                data: {
                    orderId: dbOrderId,
                    status: "paid",
                    description: "Pembayaran telah berhasil diverifikasi oleh sistem Midtrans."
                }
            });
        }

        return NextResponse.json({ message: "OK" }, { status: 200 });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}

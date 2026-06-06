import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        const {
            order_id,
            transaction_status,
            fraud_status,
            signature_key,
            status_code,
            gross_amount
        } = body;

        const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-TZiFwQc0E9Bq-KlsB_uU_d1g';
        const hash = crypto.createHash("sha512");
        hash.update(order_id + status_code + gross_amount + serverKey);
        const calculatedSignature = hash.digest("hex");

        if (signature_key !== calculatedSignature) {
            return NextResponse.json({ message: "Invalid Signature" }, { status: 403 });
        }

        // Midtrans order_id format: invoiceId-timestamp. 
        const invoiceId = order_id.split("-")[0];

        let newStatus = "awaiting_payment";

        if (transaction_status === 'capture') {
            if (fraud_status === 'challenge') {
                newStatus = "pending"; 
            } else if (fraud_status === 'accept') {
                newStatus = "packed"; 
            }
        } else if (transaction_status === 'settlement') {
            newStatus = "packed"; 
        } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
            newStatus = "cancelled";
        } else if (transaction_status === 'pending') {
            newStatus = "awaiting_payment";
        }

        const invoice = await prisma.orderInvoice.findUnique({
            where: { id: invoiceId },
            include: { orders: true }
        });

        if (!invoice) {
            return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
        }

        // Update invoice and all suborders in a transaction
        await prisma.$transaction(async (tx) => {
            await tx.orderInvoice.update({
                where: { id: invoiceId },
                data: { status: newStatus }
            });

            for (const order of invoice.orders) {
                await tx.order.update({
                    where: { id: order.id },
                    data: { status: newStatus }
                });

                if (newStatus === "packed") {
                    await tx.orderTracking.create({
                        data: {
                            orderId: order.id,
                            status: "paid",
                            description: "Pembayaran telah berhasil diverifikasi oleh sistem Midtrans."
                        }
                    });
                }
            }
        });

        return NextResponse.json({ message: "OK" }, { status: 200 });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}

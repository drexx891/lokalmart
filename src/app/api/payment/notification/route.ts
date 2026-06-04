import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Midtrans Webhook Payload
        const {
            order_id,
            status_code,
            gross_amount,
            signature_key,
            transaction_status,
            fraud_status
        } = body;

        // Verify Signature
        const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-XXXXX';
        
        // signature_key = SHA512(order_id + status_code + gross_amount + serverKey)
        const expectedSignature = crypto
            .createHash('sha512')
            .update(order_id + status_code + gross_amount + serverKey)
            .digest('hex');

        if (signature_key !== expectedSignature) {
            console.error('Midtrans signature verification failed');
            return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
        }

        // Cari pesanan di database
        // Kita simpan orderId dengan format: lokalmart-{id} atau hanya {id}
        // Mari asumsikan kita kirim order_id as asli id
        const orderId = order_id; 

        let statusToUpdate = 'pending';

        if (transaction_status === 'capture') {
            if (fraud_status === 'accept') {
                statusToUpdate = 'paid';
            }
        } else if (transaction_status === 'settlement') {
            statusToUpdate = 'paid';
        } else if (transaction_status === 'cancel' ||
            transaction_status === 'deny' ||
            transaction_status === 'expire') {
            statusToUpdate = 'failed';
        } else if (transaction_status === 'pending') {
            statusToUpdate = 'awaiting_payment';
        }

        if (statusToUpdate !== 'pending') {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: statusToUpdate }
            });
        }

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('Payment webhook error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

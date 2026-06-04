import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import PaymentClient from "@/components/checkout/PaymentClient";

export default async function PembayaranPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id: id },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!order || order.userId !== user.id) {
        redirect("/profil/pesanan");
    }

    // Jika order sudah dibayar/dikemas, langsung alihkan ke pesanan
    if (order.status !== "pending" && order.status !== "awaiting_payment") {
        redirect("/profil/pesanan");
    }

    return (
        <div className="bg-[#F7F8FA] min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4">
                <PaymentClient order={order} />
            </div>
        </div>
    );
}

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import OrderHistoryClient from "./OrderHistoryClient";

export default async function RiwayatPesananPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    // Ambil pesanan yang BUKAN "pending" kosong (keranjang)
    // Order dengan status pending tapi sudah memiliki informasi pengiriman (berarti sudah dicheckout atau ada metode)
    // Atau ambil semua order yang bukan keranjang. Keranjang adalah order.status === "pending" dan paymentUrl == null dsb.
    // Tapi karena kita menyimpan keranjang sebagai "pending", kita filter:
    const orders = await prisma.order.findMany({
        where: {
            userId: user.id,
            // Kita tidak menampilkan keranjang belanja ("pending" murni tanpa checkout info)
            // Tapi jika statusnya "packed", "shipped", dll, tampilkan
            // Jika "pending" tapi sudah checkout (biasanya awaiting_payment), tampilkan
            NOT: {
                status: "pending"
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            supplier: true
                        }
                    }
                }
            }
        }
    });

    return <OrderHistoryClient orders={orders} />;
}

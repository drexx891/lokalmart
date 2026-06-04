import AddressClient from "@/components/profil/AddressClient";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AddressPage() {
    const sessionUser = await getCurrentUser();
    
    // Mockup data (fallback jika DB mati)
    let addresses: any[] = [
        {
            id: "addr_1",
            label: "Rumah",
            recipientName: "Budi Santoso",
            phone: "081234567890",
            province: "DKI Jakarta",
            city: "Jakarta Selatan",
            street: "Jl. Jend. Sudirman No. 12, Kebayoran Baru",
            zipCode: "12190",
            isPrimary: true
        }
    ];

    if (sessionUser) {
        try {
            const dbAddresses = await (prisma as any).address.findMany({
                where: { userId: sessionUser.id },
                orderBy: { createdAt: 'desc' }
            });
            if (dbAddresses && dbAddresses.length > 0) {
                addresses = dbAddresses;
            }
        } catch (error) {
            console.error("DB Error fetching addresses:", error);
        }
    }

    return (
        <div className="w-full">
            <AddressClient initialAddresses={addresses} />
        </div>
    );
}

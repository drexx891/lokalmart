import ProfilFormClient from "@/components/profil/ProfilFormClient";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProfilPage() {
    const sessionUser = await getCurrentUser();
    
    // Fallback data jika DB error atau belum login, agar UI tetap bisa diakses (UI mockup phase)
    let userProfile = {
        id: "usr_mock_123",
        name: "Budi Santoso",
        email: "budi.santoso@email.com",
        phone: "081234567890",
        gender: "Laki-laki",
        birthDate: "1990-01-01",
        avatarUrl: null as string | null
    };

    if (sessionUser) {
        try {
            const dbUser = await (prisma as any).user.findUnique({
                where: { id: sessionUser.id }
            });
            if (dbUser) {
                userProfile = {
                    id: dbUser.id,
                    name: dbUser.name || sessionUser.name || "",
                    email: dbUser.email,
                    phone: dbUser.phone || "",
                    gender: dbUser.gender || "",
                    birthDate: dbUser.birthDate || "",
                    avatarUrl: dbUser.avatarUrl || null
                };
            }
        } catch (error) {
            console.error("Database connection failed while fetching user profile:", error);
            // Tetap gunakan userProfile mockup jika DB mati
        }
    }

    return (
        <div className="w-full">
            <ProfilFormClient initialUser={userProfile} />
        </div>
    );
}

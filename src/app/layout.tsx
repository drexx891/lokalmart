import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// New Layout Components
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { prisma } from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
    themeColor: "#1A3C6E", // Belio Navy
};

export const metadata: Metadata = {
    title: "Belio | B2B Trading Platform",
    description: "Sourcing premium products directly from verified suppliers.",
};

import { unstable_cache } from "next/cache";

const getCachedCategories = unstable_cache(
    async () => {
        return prisma.category.findMany({ take: 8 });
    },
    ['layout-categories'],
    { revalidate: 3600 }
);

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const dbCategories = await getCachedCategories();

    // Fetch dynamic cart count & user
    let cartCount = 0;
    let user = null;
    try {
        const { getCurrentUser } = await import('@/lib/auth');
        const sessionUser = await getCurrentUser();
        if (sessionUser) {
            const dbUser = await (prisma as any).user.findUnique({
                where: { id: sessionUser.id }
            });
            
            if (dbUser) {
                user = { ...sessionUser, ...dbUser };
            } else {
                user = sessionUser;
            }

            const pendingOrder = await prisma.order.findFirst({
                where: { userId: sessionUser.id, status: "pending" },
                include: { items: true }
            });
            if (pendingOrder) {
                // Sum all quantities
                cartCount = pendingOrder.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
            }
        }
    } catch (e) {
        console.error("Failed to fetch user/cart info", e);
    }

    return (
        <html lang="id" data-scroll-behavior="smooth">
            <body className={`${inter.className} min-h-screen antialiased bg-[#F7F8FA] text-[#1F2937] flex flex-col`}>
                <TopBar />
                <Navbar categories={dbCategories} cartCount={cartCount} user={user} />

                <main className="flex-1 bg-white">
                    {children}
                </main>

                <Footer />
                <MobileBottomNav cartCount={cartCount} />
                <Toaster position="bottom-right" />
            </body>
        </html>
    );
}

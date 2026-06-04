import { prisma } from "@/lib/prisma";
import HeroSlider from "./HeroSlider";

export default async function HeroSection() {
    // Type cast prisma to any sementara karena cache TS VS Code belum mendeteksi model baru
    const campaigns = await (prisma as any).campaign.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
    });

    const mainCampaigns = campaigns.filter((c: any) => c.position === 'main_slider');
    const rightTop = campaigns.find((c: any) => c.position === 'right_top');
    const rightBottom = campaigns.find((c: any) => c.position === 'right_bottom');

    return (
        <section className="bg-white pb-6 pt-6">
            <div className="max-w-7xl mx-auto px-4">
                <HeroSlider 
                    mainCampaigns={mainCampaigns} 
                    rightTop={rightTop} 
                    rightBottom={rightBottom} 
                />
            </div>
        </section>
    );
}

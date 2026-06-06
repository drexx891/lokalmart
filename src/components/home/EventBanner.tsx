"use client";

import Link from "next/link";

interface EventBannerProps {
  events: {
    id: string;
    name: string;
    type: string;
    startTime: string;
    endTime: string;
    aiTitle: string | null;
    aiSubtitle: string | null;
    aiCta: string | null;
    configJson: {
      colorFrom?: string;
      colorTo?: string;
      colorTheme?: string;
      description?: string;
      maxDiscount?: number;
    } | null;
    products: {
      id: string;
      discountPercent: number;
      product: { id: string; name: string; price: number; imageUrl: string | null };
    }[];
  }[];
}

export default function EventBanner({ events }: EventBannerProps) {
  if (!events || events.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => {
          const config = event.configJson || {};
          const colorFrom = config.colorFrom || '#1A3C6E';
          const colorTo = config.colorTo || '#2A5FA0';
          const maxDiscount = config.maxDiscount || Math.max(...event.products.map(p => p.discountPercent), 0);
          const title = event.aiTitle || event.name;
          const subtitle = event.aiSubtitle || config.description || `Diskon hingga ${maxDiscount}%!`;
          const cta = event.aiCta || 'Lihat Promo';

          return (
            <Link
              key={event.id}
              href={`/promo?event=${event.id}`}
              className="group relative rounded-2xl overflow-hidden p-6 md:p-8 min-h-[160px] flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
              style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
            >
              {/* Dekorasi lingkaran latar */}
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/5" />

              <div className="relative z-10">
                {/* Badge Tipe Event */}
                <span className="inline-block bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mb-2">
                  {event.type === 'flash_sale' ? '⚡ Flash Sale' : event.type === 'campaign' ? '🎯 Promo' : event.type === 'seasonal' ? '🌟 Musiman' : '📦 Clearance'}
                </span>

                {/* Title */}
                <h3 className="text-white font-black text-lg md:text-xl leading-tight mb-1">{title}</h3>

                {/* Subtitle */}
                <p className="text-white/80 text-xs md:text-sm line-clamp-2">{subtitle}</p>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-4">
                {/* Diskon Badge */}
                {maxDiscount > 0 && (
                  <div className="bg-white/20 backdrop-blur-sm text-white font-black text-sm px-3 py-1 rounded-lg">
                    s.d. {maxDiscount}% OFF
                  </div>
                )}

                {/* CTA */}
                <span className="text-white text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  {cta}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </span>
              </div>

              {/* Thumbnail produk mini (desktop only) */}
              {event.products.length > 0 && (
                <div className="absolute bottom-4 right-4 hidden md:flex gap-1">
                  {event.products.slice(0, 3).map((ep) => (
                    ep.product.imageUrl && (
                      <div key={ep.id} className="w-10 h-10 rounded-lg bg-white/20 overflow-hidden border border-white/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ep.product.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    )
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

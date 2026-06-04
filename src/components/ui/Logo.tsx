import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({ 
    weight: "700", 
    subsets: ["latin"],
    display: "swap"
});

interface LogoProps {
    size?: "sm" | "md" | "lg";
    theme?: "light" | "dark"; // light = for light backgrounds (Navy text), dark = for dark backgrounds (White text)
}

export default function Logo({ size = "md", theme = "light" }: LogoProps) {
    // Ukuran komponen (SVG + Teks)
    const dimensions = {
        sm: { svg: 24, text: "text-lg", gap: "gap-1.5" },
        md: { svg: 32, text: "text-2xl", gap: "gap-2" },
        lg: { svg: 48, text: "text-4xl", gap: "gap-3" }
    };

    const d = dimensions[size];
    
    // Warna teks "belio" tergantung tema background
    const textColor = theme === "light" ? "text-[#1A3C6E]" : "text-white";

    return (
        <Link href="/" className="inline-flex items-center group cursor-pointer" style={{ padding: "2px" }}>
            <div className={`flex items-center ${d.gap}`}>
                
                {/* Logo Ikon: Versi B - Hexagon Navy dengan aksen Emas dan huruf B */}
                <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <svg 
                        width={d.svg} 
                        height={d.svg} 
                        viewBox="0 0 40 40" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Hexagon Base Navy */}
                        <path 
                            d="M20 2.5L35.1554 11.25V28.75L20 37.5L4.84455 28.75V11.25L20 2.5Z" 
                            fill="#1A3C6E"
                        />
                        
                        {/* Aksen Sudut Kecil Emas (Kanan Bawah) */}
                        <path 
                            d="M35.1554 28.75L20 37.5L28 32.5L35.1554 28.75Z" 
                            fill="#F5A623"
                        />
                        
                        {/* Huruf 'B' Putih di Tengah */}
                        <path 
                            d="M15 12H21.5C24.5376 12 27 14.0147 27 16.5C27 18.5714 25.5 20.25 23.5 20.75C26 21.25 27.5 23.1429 27.5 25.5C27.5 28.5376 25.0376 31 22 31H15V12ZM18 14.5V19.5H21.5C22.8807 19.5 24 18.3807 24 17C24 15.6193 22.8807 14.5 21.5 14.5H18ZM18 22V28.5H22C23.3807 28.5 24.5 27.3807 24.5 26C24.5 24.6193 23.3807 23.5 22 23.5H18Z" 
                            fill="white"
                        />
                    </svg>
                </div>

                {/* Teks Merek */}
                <span className={`${poppins.className} ${d.text} ${textColor} tracking-tight lowercase mt-1 group-hover:opacity-90 transition-opacity`}>
                    belio
                </span>

            </div>
        </Link>
    );
}

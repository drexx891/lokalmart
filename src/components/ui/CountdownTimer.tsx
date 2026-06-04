"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: Date | string | number;
  onExpired?: () => void;
  variant?: "pill" | "box" | "inline";
}

export default function CountdownTimer({ targetDate, onExpired, variant = "box" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft(null);
        if (onExpired) onExpired();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onExpired]);

  // Handle Hydration mismatch by not rendering until client-side time is calculated
  if (timeLeft === null && !isExpired) {
    return <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>;
  }

  if (isExpired) {
    return (
      <div className={`font-bold text-[#E24B4A] ${variant === 'inline' ? 'text-sm' : 'bg-[#FEF2F2] px-3 py-1 rounded-md text-xs'}`}>
        Promo Berakhir!
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  // Variant: Box (Kotak merah terpisah per angka)
  if (variant === "box") {
    return (
      <div className="flex items-center gap-1.5">
        {timeLeft!.days > 0 && (
            <>
                <div className="bg-[#E24B4A] text-white font-bold text-sm px-2 py-1 rounded shadow-sm min-w-[32px] text-center">
                {formatNumber(timeLeft!.days)}
                </div>
                <span className="text-[#E24B4A] font-bold">:</span>
            </>
        )}
        <div className="bg-[#E24B4A] text-white font-bold text-sm px-2 py-1 rounded shadow-sm min-w-[32px] text-center">
          {formatNumber(timeLeft!.hours)}
        </div>
        <span className="text-[#E24B4A] font-bold">:</span>
        <div className="bg-[#E24B4A] text-white font-bold text-sm px-2 py-1 rounded shadow-sm min-w-[32px] text-center">
          {formatNumber(timeLeft!.minutes)}
        </div>
        <span className="text-[#E24B4A] font-bold">:</span>
        <div className="bg-[#E24B4A] text-white font-bold text-sm px-2 py-1 rounded shadow-sm min-w-[32px] text-center">
          {formatNumber(timeLeft!.seconds)}
        </div>
      </div>
    );
  }

  // Variant: Pill (Kapsul gelap menyatu)
  if (variant === "pill") {
    return (
      <div className="bg-[#1F2937] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>
          {timeLeft!.days > 0 ? `${timeLeft!.days}h ` : ''}
          {formatNumber(timeLeft!.hours)}:{formatNumber(timeLeft!.minutes)}:{formatNumber(timeLeft!.seconds)}
        </span>
      </div>
    );
  }

  // Variant: Inline (Hanya teks biasa)
  return (
    <span className="font-bold text-[#E24B4A]">
      {timeLeft!.days > 0 ? `${timeLeft!.days} hari ` : ''}
      {formatNumber(timeLeft!.hours)}:{formatNumber(timeLeft!.minutes)}:{formatNumber(timeLeft!.seconds)}
    </span>
  );
}

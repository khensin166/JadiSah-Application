'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Copy, Check, Share2 } from 'lucide-react';
import { WeddingSummary } from '@/types/dashboard';
import { calculateDetailedCountdown, CountdownTimeRemaining } from '@/lib/dashboard-utils';
import { Button } from '@/components/ui/button';

interface CountdownBannerProps {
  wedding: WeddingSummary;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({ wedding }) => {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<CountdownTimeRemaining>(() =>
    calculateDetailedCountdown(wedding.weddingDate)
  );

  useEffect(() => {
    // Initial update
    setCountdown(calculateDetailedCountdown(wedding.weddingDate));
    
    // Update countdown every second
    const timer = setInterval(() => {
      setCountdown(calculateDetailedCountdown(wedding.weddingDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [wedding.weddingDate]);

  const invitationUrl = `https://jadisah.id/invitation/${wedding.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden soft-shadow border border-champagne-light/80 bg-gradient-to-br from-ivory-50 via-champagne-soft/40 to-ivory-100 text-charcoal-900">
      {/* Background ambient decorative shapes */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-champagne/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-sage/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-9 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Left Column: Wedding Information */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-soft border border-champagne-light text-champagne-dark text-xs font-semibold uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold animate-pulse" />
            <span>{wedding.venueName}</span>
          </div>

          <h2 className="font-cormorant text-3xl sm:text-5xl font-normal tracking-tight text-charcoal-900 leading-tight">
            {wedding.brideName} <span className="font-serif italic text-champagne-dark">&amp;</span> {wedding.groomName}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-charcoal-600 font-normal">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-champagne-dark" />
              <span>Sabtu, 12 Desember 2026</span>
            </div>
            <span className="hidden sm:inline text-champagne-light">•</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-champagne-dark" />
              <span>Jakarta Selatan, Indonesia</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              onClick={handleCopy}
              className="px-4 py-2 rounded-full bg-champagne hover:bg-champagne-light text-charcoal-900 font-semibold text-xs tracking-wider uppercase transition shadow-xs cursor-pointer border border-champagne-dark/20"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-charcoal-900" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-charcoal-900" />
                  <span>Salin Link Undangan</span>
                </>
              )}
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="px-4 py-2 rounded-full bg-ivory-50 hover:bg-champagne-soft border border-champagne-light text-charcoal-800 font-semibold text-xs tracking-wider uppercase transition shadow-2xs"
            >
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Halo! Anda diundang ke pernikahan ${wedding.brideName} & ${wedding.groomName}. Buka link undangan: ${invitationUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Share2 className="h-3.5 w-3.5 mr-1 text-champagne-dark" />
                <span>Bagikan</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Right Column: Countdown Box in 4-Unit Grid (Hari : Jam : Menit : Detik) */}
        <div className="bg-ivory-50/90 border border-champagne-light p-5 rounded-2xl flex flex-col items-center justify-center min-w-[280px] sm:min-w-[320px] text-center soft-shadow">
          <span className="text-[10px] uppercase tracking-[0.22em] text-champagne-dark font-semibold mb-3">
            Countdown to &quot;I Do&quot;
          </span>

          <div className="grid grid-cols-4 gap-2 sm:gap-2.5 w-full text-center">
            {/* Hari */}
            <div className="bg-champagne-soft/70 p-2 sm:p-2.5 rounded-xl border border-champagne-light flex flex-col items-center justify-center min-w-[56px]" suppressHydrationWarning>
              <span className="font-cormorant text-2xl sm:text-3xl font-bold text-charcoal-900 block leading-tight" suppressHydrationWarning>
                {countdown.days}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-champagne-dark font-semibold mt-0.5">
                Hari
              </span>
            </div>

            {/* Jam */}
            <div className="bg-champagne-soft/70 p-2 sm:p-2.5 rounded-xl border border-champagne-light flex flex-col items-center justify-center min-w-[56px]" suppressHydrationWarning>
              <span className="font-cormorant text-2xl sm:text-3xl font-bold text-charcoal-900 block leading-tight" suppressHydrationWarning>
                {String(countdown.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-champagne-dark font-semibold mt-0.5">
                Jam
              </span>
            </div>

            {/* Menit */}
            <div className="bg-champagne-soft/70 p-2 sm:p-2.5 rounded-xl border border-champagne-light flex flex-col items-center justify-center min-w-[56px]" suppressHydrationWarning>
              <span className="font-cormorant text-2xl sm:text-3xl font-bold text-charcoal-900 block leading-tight" suppressHydrationWarning>
                {String(countdown.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-champagne-dark font-semibold mt-0.5">
                Menit
              </span>
            </div>

            {/* Detik */}
            <div className="bg-champagne-soft/70 p-2 sm:p-2.5 rounded-xl border border-champagne-light flex flex-col items-center justify-center min-w-[56px]" suppressHydrationWarning>
              <span className="font-cormorant text-2xl sm:text-3xl font-bold text-champagne-dark block leading-tight" suppressHydrationWarning>
                {String(countdown.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-champagne-dark font-semibold mt-0.5">
                Detik
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-champagne-light/50 w-full flex items-center justify-between text-[11px] text-charcoal-600">
            <span className="text-champagne-dark font-medium">Tanggal Akad:</span>
            <span className="font-semibold text-charcoal-900">
              {new Date(wedding.weddingDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

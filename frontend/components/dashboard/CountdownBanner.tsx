'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Copy, Check, Share2, Sparkles } from 'lucide-react';
import { WeddingSummary } from '@/types/dashboard';
import { calculateDaysRemaining } from '@/lib/dashboard-utils';

interface CountdownBannerProps {
  wedding: WeddingSummary;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({ wedding }) => {
  const [copied, setCopied] = useState(false);
  const daysRemaining = calculateDaysRemaining(wedding.weddingDate);

  const invitationUrl = `https://jadisah.id/invitation/${wedding.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 p-6 sm:p-8 text-white shadow-xl shadow-rose-200/50 dark:shadow-none">
      {/* Decorative backdrop elements */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-pink-400/20 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Column: Wedding Information */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-yellow-200" />
            <span>Hari Bahagia Sudah Dekat</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {wedding.brideName} &amp; {wedding.groomName}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-rose-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-rose-200" />
              <span>Sabtu, 12 Desember 2026</span>
            </div>
            <span className="hidden sm:inline opacity-60">•</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-rose-200" />
              <span>{wedding.venueName}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Countdown Box & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
          {/* Countdown Pill Card */}
          <div className="flex items-center gap-3 rounded-2xl bg-white/15 px-5 py-3.5 backdrop-blur-md border border-white/20">
            <div className="text-center">
              <span className="block text-3xl sm:text-4xl font-black tracking-tight leading-none">
                {daysRemaining}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-rose-100 font-medium">
                Hari Lagi
              </span>
            </div>
            <div className="h-8 w-px bg-white/30" />
            <div className="text-left text-xs leading-tight text-rose-100">
              <p className="font-semibold text-white">Menuju Akad</p>
              <p className="opacity-90">12 Des 2026</p>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Salin Link Undangan</span>
                </>
              )}
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `Halo! Anda diundang ke pernikahan ${wedding.brideName} & ${wedding.groomName}. Buka link undangan: ${invitationUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3.5 py-2.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-white/25 border border-white/20"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Bagikan</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

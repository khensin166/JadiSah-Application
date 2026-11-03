"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/context/auth-context";
import type { ThemeConfig } from "@/types/theme";

interface LandingHeroProps {
  theme: ThemeConfig;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ theme }) => {
  const { isAuthenticated } = useSession();

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] sm:size-[700px] rounded-full bg-champagne-light/30 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-champagne bg-champagne-soft/70 px-4 py-1.5 text-xs font-semibold text-champagne-dark shadow-xs">
          <Sparkles className="size-3.5 text-champagne-dark" />
          <span>{theme.assets.heroPill}</span>
        </div>

        {/* Headline with Cormorant Garamond font */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-charcoal-900 leading-[1.1] max-w-4xl mx-auto">
          {theme.assets.heroHeadline}{" "}
          <span className="italic font-normal text-champagne-dark underline decoration-champagne-light decoration-wavy decoration-1 underline-offset-8">
            {theme.assets.heroHeadlineHighlight}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-charcoal-600 leading-relaxed">
          {theme.assets.heroSubheadline}
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href={isAuthenticated ? "/dashboard" : "/register"}>
            <Button size="lg" className="w-full sm:w-auto gap-2 px-7 py-6 text-sm sm:text-base font-semibold shadow-md">
              <span>{isAuthenticated ? "Masuk ke Dashboard Saya" : "Mulai Rencanakan Sekarang"}</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href={isAuthenticated ? "/dashboard" : "/login"}>
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 py-6 text-sm text-charcoal-700 bg-ivory-50/80">
              <span>{isAuthenticated ? "Buka Workspace" : "Masuk ke Akun Anda"}</span>
            </Button>
          </Link>
        </div>

        {/* Mini Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-charcoal-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-sage-dark" />
            <span>Gratis untuk Mempelai</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="size-4 text-champagne-dark" />
            <span>Kolaborasi Pasangan Real-time</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-sage-dark" />
            <span>Privasi Data Pernikahan Terjamin</span>
          </div>
        </div>

        {/* Hero Interactive Showcase Card (Representing Theme Asset Mockup) */}
        <div className="pt-8 sm:pt-12">
          <div className="relative mx-auto max-w-3xl rounded-3xl border border-champagne bg-gradient-to-br from-ivory-50 via-white to-champagne-soft/50 p-4 sm:p-7 shadow-xl soft-shadow text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-champagne-light/70 gap-3">
              <div>
                <Badge variant="outline" className="bg-sage-soft text-sage-dark border-sage/40 mb-1.5">
                  {theme.assets.heroMockupBadge}
                </Badge>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                  {theme.assets.heroMockupTitle}
                </h3>
                <p className="text-xs text-charcoal-500">
                  {theme.assets.heroMockupSubtitle}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-champagne-soft text-champagne-dark">
                  <Heart className="size-4 fill-champagne-dark/20" />
                </span>
                <span className="text-xs font-semibold text-charcoal-700">Couple Synced</span>
              </div>
            </div>

            {/* Quick Metrics Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
              <div className="p-3 rounded-2xl bg-ivory-100/70 border border-champagne-light/60">
                <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider">RSVP Hadir</span>
                <p className="font-serif text-xl font-bold text-charcoal-900 mt-0.5">342 / 450</p>
                <span className="text-[10px] text-sage-dark font-medium">76% Konfirmasi</span>
              </div>
              <div className="p-3 rounded-2xl bg-ivory-100/70 border border-champagne-light/60">
                <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider">Realisasi Biaya</span>
                <p className="font-serif text-xl font-bold text-charcoal-900 mt-0.5">Rp 118,5 Jt</p>
                <span className="text-[10px] text-charcoal-500">Pagu Rp 175 Jt</span>
              </div>
              <div className="p-3 rounded-2xl bg-ivory-100/70 border border-champagne-light/60">
                <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider">Checklist Persiapan</span>
                <p className="font-serif text-xl font-bold text-charcoal-900 mt-0.5">18 / 24</p>
                <span className="text-[10px] text-sage-dark font-medium">75% Selesai</span>
              </div>
              <div className="p-3 rounded-2xl bg-ivory-100/70 border border-champagne-light/60">
                <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider">Rundown Hari-H</span>
                <p className="font-serif text-xl font-bold text-charcoal-900 mt-0.5">8 Sesi</p>
                <span className="text-[10px] text-champagne-dark font-medium">Akad &amp; Resepsi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/auth-context";
import type { ThemeConfig } from "@/types/theme";

interface LandingCTAProps {
  theme: ThemeConfig;
}

export const LandingCTA: React.FC<LandingCTAProps> = ({ theme }) => {
  const { isAuthenticated } = useSession();

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-champagne bg-gradient-to-br from-ivory-50 via-champagne-soft/70 to-ivory-100 p-8 sm:p-14 text-center soft-shadow space-y-6">
          {/* Top Gold Trim Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-champagne-light via-champagne to-champagne-dark" />

          <div className="inline-flex items-center gap-2 rounded-full bg-champagne text-charcoal-900 px-3.5 py-1 text-xs font-semibold shadow-xs">
            <Sparkles className="size-3.5" />
            <span>Mulai Hari Ini</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 max-w-2xl mx-auto leading-tight">
            {theme.assets.ctaHeadline}
          </h2>

          <p className="max-w-xl mx-auto text-sm text-charcoal-600 leading-relaxed">
            {theme.assets.ctaDescription}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" className="gap-2 px-8 py-6 text-sm sm:text-base font-semibold shadow-md">
                <span>{isAuthenticated ? "Masuk ke Dashboard Anda" : theme.assets.ctaButtonText}</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};


"use client";

import React from "react";
import Link from "next/link";
import type { ThemeConfig } from "@/types/theme";

interface LandingFooterProps {
  theme: ThemeConfig;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ theme }) => {
  return (
    <footer className="border-t border-champagne-light/60 bg-ivory-50/90 py-8 px-4 sm:px-8 text-xs text-charcoal-500">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold tracking-wider text-charcoal-900 text-sm">
            {theme.assets.brandName}
          </span>
          <span>&bull;</span>
          <span>{theme.assets.brandTagline}</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="hover:text-charcoal-900 transition-colors">
            Masuk
          </Link>
          <Link href="/register" className="hover:text-charcoal-900 transition-colors">
            Daftar
          </Link>
          <Link href="/dashboard" className="hover:text-charcoal-900 transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
};


"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/auth-context";
import type { ThemeConfig } from "@/types/theme";

interface LandingNavbarProps {
  theme: ThemeConfig;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ theme }) => {
  const { isAuthenticated, isLoading } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-champagne-light/70 bg-ivory-50/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 py-3.5">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-gradient-to-br from-champagne to-champagne-dark shadow-sm text-ivory-50 font-serif font-bold text-lg transition-transform group-hover:scale-105">
            {theme.assets.logoLetter}
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-charcoal-900 leading-none">
              {theme.assets.brandName}
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-champagne-dark">
              Atelier
            </span>
          </div>
        </Link>

        {/* Dynamic Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isLoading ? (
            <div className="h-8 w-24 rounded-lg bg-champagne-soft animate-pulse" />
          ) : isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="sm" className="gap-1.5 shadow-sm text-xs sm:text-sm">
                <LayoutDashboard className="size-4" />
                <span>Buka Dashboard</span>
                <ArrowRight className="size-3.5 hidden sm:inline" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs sm:text-sm text-charcoal-700 hover:text-charcoal-900">
                  <LogIn className="size-3.5" />
                  <span>Masuk</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gap-1.5 shadow-sm text-xs sm:text-sm">
                  <UserPlus className="size-3.5" />
                  <span>Daftar Gratis</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

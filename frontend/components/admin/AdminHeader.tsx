"use client";

import React from "react";
import { RefreshCw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AdminHeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function AdminHeader({ onRefresh, isRefreshing = false }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-champagne-light/70 bg-ivory-50/90 px-4 sm:px-8 backdrop-blur-md transition-all">
      <div className="flex items-center gap-3">
        {/* Mobile/Desktop Sidebar Toggle */}
        <SidebarTrigger className="text-charcoal-700 hover:bg-champagne/20 hover:text-charcoal-900" />

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-charcoal-900 leading-tight">
              Manajemen Pengguna &amp; Otoritas
            </h1>
            <Badge
              variant="outline"
              className="hidden sm:inline-flex bg-sage-soft text-sage-dark border-sage/40 text-[10px] py-0"
            >
              <span className="mr-1 size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Connected
            </Badge>
          </div>
          <p className="text-xs text-charcoal-500">
            Kelola akun pengguna, penetapan hak akses role (IAM), dan paket langganan atelier.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-1.5 text-xs text-charcoal-700 bg-white/80 border-champagne-light hover:bg-champagne/15"
        >
          <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin text-champagne-dark" : ""}`} />
          <span className="hidden sm:inline">Segarkan Data</span>
        </Button>

        <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-champagne-light/80 bg-champagne-soft/60 px-3 py-1.5 text-xs font-semibold text-champagne-dark">
          <Shield className="size-3.5" />
          <span>IAM Security Active</span>
        </div>
      </div>
    </header>
  );
}

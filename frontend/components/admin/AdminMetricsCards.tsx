"use client";

import React from "react";
import { Users, Shield, Crown, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminUser } from "@/types/admin";

interface AdminMetricsCardsProps {
  totalUsers: number;
  usersOnPage: AdminUser[];
}

export function AdminMetricsCards({
  totalUsers,
  usersOnPage,
}: AdminMetricsCardsProps) {
  // Hitung agregat cepat dari daftar user yang sedang dimuat
  const paidCount = usersOnPage.filter(
    (u) => u.subscription_tier === "PREMIUM" || u.subscription_tier === "VIP"
  ).length;

  const adminCount = usersOnPage.filter(
    (u) => u.roles.includes("ADMIN") || u.roles.includes("SUPER_ADMIN")
  ).length;

  const freeCount = usersOnPage.filter(
    (u) => u.subscription_tier === "FREE"
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Pengguna */}
      <Card className="rounded-3xl border border-champagne-light/80 bg-ivory-50/90 soft-shadow">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
              Total Pengguna
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-champagne-soft text-champagne-dark border border-champagne-light/70">
              <Users className="size-4" />
            </div>
          </div>
          <p className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            {totalUsers}
          </p>
          <p className="mt-1 text-[11px] text-charcoal-500">
            Akun terdaftar dalam database
          </p>
        </CardContent>
      </Card>

      {/* 2. Pelanggan Berbayar */}
      <Card className="rounded-3xl border border-champagne-light/80 bg-ivory-50/90 soft-shadow">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
              Paket Premium &amp; VIP
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-champagne-gold/20 text-champagne-dark border border-champagne-gold/40">
              <Crown className="size-4" />
            </div>
          </div>
          <p className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            {paidCount}
          </p>
          <p className="mt-1 text-[11px] text-sage-dark font-medium">
            Fitur atelier tak terbatas aktif
          </p>
        </CardContent>
      </Card>

      {/* 3. Pengguna Administrator */}
      <Card className="rounded-3xl border border-champagne-light/80 bg-ivory-50/90 soft-shadow">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
              Administrator Sistem
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-charcoal-900 text-ivory-50">
              <Shield className="size-4" />
            </div>
          </div>
          <p className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            {adminCount}
          </p>
          <p className="mt-1 text-[11px] text-charcoal-500">
            Role Admin / Super Admin
          </p>
        </CardContent>
      </Card>

      {/* 4. Paket Gratis */}
      <Card className="rounded-3xl border border-champagne-light/80 bg-ivory-50/90 soft-shadow">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
              Paket Free Tier
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-sage-soft text-sage-dark border border-sage/30">
              <UserCheck className="size-4" />
            </div>
          </div>
          <p className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            {freeCount}
          </p>
          <p className="mt-1 text-[11px] text-charcoal-500">
            Calon upgrade langganan
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


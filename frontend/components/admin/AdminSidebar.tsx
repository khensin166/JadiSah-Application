"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  LayoutDashboard,
  ExternalLink,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { UserProfile } from "@/types/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface AdminSidebarProps {
  adminUser: UserProfile | null;
  activeSection: string;
  onSectionChange: (section: string) => void;
  totalUsersCount?: number;
}

export function AdminSidebar({
  adminUser,
  activeSection,
  onSectionChange,
  totalUsersCount,
}: AdminSidebarProps) {
  const { logout } = useAuth();
  const isSuperAdmin = adminUser?.roles?.includes("SUPER_ADMIN");

  const displayName =
    [adminUser?.first_name, adminUser?.last_name].filter(Boolean).join(" ") ||
    adminUser?.email ||
    "Administrator";

  return (
    <Sidebar className="border-r border-champagne-light/60 bg-ivory-50 text-charcoal-800">
      {/* 1. Header: Brand Logo & Authority Badge */}
      <SidebarHeader className="border-b border-champagne-light/50 px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-champagne to-champagne-dark shadow-sm text-ivory-50 font-serif font-bold text-lg transition-transform group-hover:scale-105">
            J
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight text-charcoal-900 leading-none">
              JadiSah
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-champagne-dark">
              Admin Console
            </span>
          </div>
        </Link>

        <div className="mt-4 rounded-xl border border-champagne-light bg-gradient-to-r from-champagne-soft/70 via-ivory-50 to-champagne-soft/40 p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-600">
              Hak Otoritas
            </span>
            <Badge
              variant={isSuperAdmin ? "charcoal" : "default"}
              className="text-[9px] py-0 px-2 uppercase font-bold"
            >
              {isSuperAdmin ? "Super Admin" : "Admin"}
            </Badge>
          </div>
          <p className="mt-1 text-[11px] text-charcoal-500 leading-snug">
            {isSuperAdmin
              ? "Akses penuh manajemen user, role, dan tier langganan."
              : "Akses membaca data direktori dan role pengguna."}
          </p>
        </div>
      </SidebarHeader>

      {/* 2. Content Navigation */}
      <SidebarContent className="px-3 py-4 space-y-6">
        {/* Navigation Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-widest text-champagne-dark">
            Manajemen Sistem
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-1">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "users"}
                  onClick={() => onSectionChange("users")}
                  className={`w-full justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    activeSection === "users"
                      ? "bg-ivory-200 text-charcoal-900 border-l-3 border-champagne font-bold"
                      : "text-charcoal-700 hover:bg-champagne/15 hover:text-charcoal-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="size-4 text-champagne-dark" />
                    <span>Direktori Pengguna</span>
                  </div>
                  {typeof totalUsersCount === "number" && (
                    <Badge variant="outline" className="text-[10px] bg-white/80 py-0">
                      {totalUsersCount}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-champagne-light/50" />

        {/* Quick Links Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-widest text-champagne-dark">
            Tautan Cepat
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-1">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-charcoal-700 hover:bg-champagne/15 hover:text-charcoal-900 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutDashboard className="size-4 text-champagne-dark" />
                      <span>Workspace Pengantin</span>
                    </div>
                    <ExternalLink className="size-3 text-charcoal-400" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/"
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-charcoal-700 hover:bg-champagne/15 hover:text-charcoal-900 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="size-4 text-champagne-dark" />
                      <span>Halaman Utama (Landing)</span>
                    </div>
                    <ExternalLink className="size-3 text-charcoal-400" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 3. Footer: Active Admin Profile & Logout */}
      <SidebarFooter className="border-t border-champagne-light/50 p-4">
        <div className="rounded-2xl border border-champagne-light/70 bg-white/80 p-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-champagne-soft border border-champagne-light text-champagne-dark font-serif font-bold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-charcoal-900">
                {displayName}
              </p>
              <p className="truncate text-[11px] text-charcoal-500">
                {adminUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-champagne-light/40">
            <span className="flex items-center gap-1 text-[10px] text-sage-dark font-medium">
              <ShieldCheck className="size-3" />
              Sesi Terverifikasi
            </span>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 hover:underline transition"
            >
              <LogOut className="size-3" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}


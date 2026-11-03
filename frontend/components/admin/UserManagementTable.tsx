"use client";

import React from "react";
import {
  Search,
  X,
  Shield,
  Crown,
  ChevronLeft,
  ChevronRight,
  Lock,
  User as UserIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminUser, RoleName, SubscriptionTier } from "@/types/admin";

interface UserManagementTableProps {
  users: AdminUser[];
  total: number;
  page: number;
  perPage: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRole: string;
  onRoleFilterChange: (role: string) => void;
  selectedTier: string;
  onTierFilterChange: (tier: string) => void;
  onPageChange: (newPage: number) => void;
  isLoading: boolean;
  isSuperAdmin: boolean;
  onEditRoles: (user: AdminUser) => void;
  onEditSubscription: (user: AdminUser) => void;
}

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

function getTierBadgeVariant(
  tier: SubscriptionTier
): "secondary" | "warning" | "charcoal" {
  switch (tier) {
    case "VIP":
      return "charcoal";
    case "PREMIUM":
      return "warning";
    case "FREE":
    default:
      return "secondary";
  }
}

function getRoleBadgeVariant(role: RoleName): "charcoal" | "success" | "outline" {
  switch (role) {
    case "SUPER_ADMIN":
      return "charcoal";
    case "ADMIN":
      return "success";
    case "USER":
    default:
      return "outline";
  }
}

export function UserManagementTable({
  users,
  total,
  page,
  perPage,
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleFilterChange,
  selectedTier,
  onTierFilterChange,
  onPageChange,
  isLoading,
  isSuperAdmin,
  onEditRoles,
  onEditSubscription,
}: UserManagementTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <Card className="rounded-3xl border border-champagne-light/80 bg-ivory-50/90 soft-shadow overflow-hidden">
      {/* Table Toolbar: Search & Filters */}
      <CardHeader className="border-b border-champagne-light/60 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="font-serif text-2xl font-bold text-charcoal-900">
                Direktori Pengguna Terdaftar
              </CardTitle>
              <Badge variant="outline" className="text-xs bg-white/80 border-champagne-light">
                {total} Akun
              </Badge>
            </div>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Kelola penugasan peran administrator dan alokasi tier langganan.
            </p>
          </div>

          {!isSuperAdmin && (
            <div className="flex items-center gap-1.5 rounded-xl border border-champagne-light/60 bg-champagne-soft/50 px-3 py-1.5 text-xs text-charcoal-700">
              <Lock className="size-3.5 text-champagne-dark" />
              <span>Aksi mutasi role &amp; paket khusus Super Admin.</span>
            </div>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-charcoal-400" />
            <Input
              type="text"
              placeholder="Cari nama atau email pengguna..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-8 bg-white/80 border-champagne-light text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
                aria-label="Bersihkan pencarian"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              aria-label="Filter berdasarkan peran"
              className="w-full h-9 rounded-md border border-champagne-light bg-white/80 px-3 text-xs text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-champagne"
            >
              <option value="ALL">Semua Peran (Roles)</option>
              <option value="USER">Hanya User</option>
              <option value="ADMIN">Hanya Admin</option>
              <option value="SUPER_ADMIN">Hanya Super Admin</option>
            </select>
          </div>

          {/* Subscription Tier Filter */}
          <div>
            <select
              value={selectedTier}
              onChange={(e) => onTierFilterChange(e.target.value)}
              aria-label="Filter berdasarkan paket langganan"
              className="w-full h-9 rounded-md border border-champagne-light bg-white/80 px-3 text-xs text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-champagne"
            >
              <option value="ALL">Semua Paket Langganan</option>
              <option value="FREE">Paket FREE</option>
              <option value="PREMIUM">Paket PREMIUM</option>
              <option value="VIP">Paket VIP</option>
            </select>
          </div>
        </div>
      </CardHeader>

      {/* Table Body */}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengguna</TableHead>
              <TableHead className="hidden md:table-cell">Tanggal Terdaftar</TableHead>
              <TableHead>Peran (Roles)</TableHead>
              <TableHead>Paket Langganan</TableHead>
              <TableHead className="text-right">Aksi Manajemen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  <TableCell className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-champagne-soft animate-pulse" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-28 rounded bg-champagne-soft animate-pulse" />
                        <div className="h-2.5 w-36 rounded bg-champagne-soft animate-pulse" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="h-3 w-20 rounded bg-champagne-soft animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-16 rounded-full bg-champagne-soft animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-20 rounded-full bg-champagne-soft animate-pulse" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-8 w-24 rounded-lg bg-champagne-soft animate-pulse ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              // Empty State
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-champagne-soft text-champagne-dark mb-3">
                    <UserIcon className="size-6" />
                  </div>
                  <p className="font-serif text-lg font-bold text-charcoal-900">
                    Tidak Ada Pengguna yang Sesuai
                  </p>
                  <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
                    {searchQuery || selectedRole !== "ALL" || selectedTier !== "ALL"
                      ? "Coba sesuaikan kata kunci pencarian atau reset filter peran/paket."
                      : "Belum ada akun pengguna yang terdaftar di sistem."}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              // Real Data Rows
              users.map((u) => {
                const name =
                  [u.first_name, u.last_name].filter(Boolean).join(" ") ||
                  u.email.split("@")[0];

                return (
                  <TableRow key={u.id} className="hover:bg-ivory-100/70 transition">
                    {/* User Identity Column */}
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-champagne-soft border border-champagne-light text-charcoal-900 font-serif font-bold text-xs">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-charcoal-900 truncate">
                            {name}
                          </p>
                          <p className="text-[11px] text-charcoal-500 truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Registration Date Column */}
                    <TableCell className="hidden md:table-cell text-xs text-charcoal-600">
                      {formatDate(u.created_at)}
                    </TableCell>

                    {/* Roles Column */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <Badge
                            key={r}
                            variant={getRoleBadgeVariant(r)}
                            className="text-[10px] py-0 px-2 font-bold"
                          >
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>

                    {/* Subscription Tier Column */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <Badge
                          variant={getTierBadgeVariant(u.subscription_tier)}
                          className="text-[10px] py-0 px-2 font-bold uppercase"
                        >
                          {u.subscription_tier}
                        </Badge>
                        {u.subscription_expires_at && (
                          <p className="text-[10px] text-charcoal-500">
                            s/d {formatDate(u.subscription_expires_at)}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell className="text-right p-4">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={!isSuperAdmin}
                          onClick={() => onEditRoles(u)}
                          className="h-8 px-2.5 text-xs text-charcoal-700 bg-white border-champagne-light hover:bg-champagne/15"
                          title={
                            isSuperAdmin
                              ? "Ubah hak otoritas role"
                              : "Hanya Super Admin yang dapat mengubah role"
                          }
                        >
                          <Shield className="mr-1 size-3 text-champagne-dark" />
                          Role
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={!isSuperAdmin}
                          onClick={() => onEditSubscription(u)}
                          className="h-8 px-2.5 text-xs text-charcoal-700 bg-white border-champagne-light hover:bg-champagne/15"
                          title={
                            isSuperAdmin
                              ? "Ubah paket langganan pengguna"
                              : "Hanya Super Admin yang dapat mengubah paket"
                          }
                        >
                          <Crown className="mr-1 size-3 text-champagne-dark" />
                          Paket
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-champagne-light/60 px-5 py-4 gap-3 bg-ivory-100/40">
          <div className="text-xs text-charcoal-500">
            Halaman <strong className="text-charcoal-900">{page}</strong> dari{" "}
            <strong className="text-charcoal-900">{totalPages}</strong> (Total {total} pengguna)
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              className="h-8 px-3 text-xs bg-white"
            >
              <ChevronLeft className="mr-1 size-3.5" />
              Sebelumnya
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
              className="h-8 px-3 text-xs bg-white"
            >
              Selanjutnya
              <ChevronRight className="ml-1 size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


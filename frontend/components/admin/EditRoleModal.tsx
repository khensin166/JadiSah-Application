"use client";

import React, { useState } from "react";
import { Shield, AlertTriangle, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminUser, RoleName } from "@/types/admin";

interface EditRoleModalProps {
  open: boolean;
  onClose: () => void;
  targetUser: AdminUser | null;
  currentAdminId?: string;
  onSave: (userId: string, roles: RoleName[]) => Promise<boolean>;
  isSaving: boolean;
}

const AVAILABLE_ROLES: { name: RoleName; label: string; desc: string }[] = [
  {
    name: "USER",
    label: "User (Pelanggan / Pasangan)",
    desc: "Akses reguler ke workspace pernikahan, manajemen tamu, anggaran, dan kolaborasi pasangan.",
  },
  {
    name: "ADMIN",
    label: "Administrator",
    desc: "Akses membaca data seluruh pengguna dan daftar peran pada Admin Console.",
  },
  {
    name: "SUPER_ADMIN",
    label: "Super Administrator",
    desc: "Hak penuh menetapkan peran (RBAC), mengubah paket langganan, dan konfigurasi kritis sistem.",
  },
];

interface FormContentProps {
  targetUser: AdminUser;
  currentAdminId?: string;
  onClose: () => void;
  onSave: (userId: string, roles: RoleName[]) => Promise<boolean>;
  isSaving: boolean;
}

function EditRoleFormContent({
  targetUser,
  currentAdminId,
  onClose,
  onSave,
  isSaving,
}: FormContentProps) {
  const [selectedRoles, setSelectedRoles] = useState<RoleName[]>(
    () => targetUser.roles || ["USER"]
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEditingSelf = currentAdminId === targetUser.id;

  const handleToggleRole = (role: RoleName) => {
    setErrorMsg(null);
    if (selectedRoles.includes(role)) {
      if (isEditingSelf && role === "SUPER_ADMIN") {
        setErrorMsg("Anda tidak dapat mencabut peran SUPER_ADMIN dari akun Anda sendiri.");
        return;
      }
      if (selectedRoles.length === 1) {
        setErrorMsg("Pengguna harus memiliki minimal 1 peran (role).");
        return;
      }
      setSelectedRoles((prev) => prev.filter((r) => r !== role));
    } else {
      setSelectedRoles((prev) => [...prev, role]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoles.length === 0) {
      setErrorMsg("Pilih minimal 1 peran.");
      return;
    }
    const ok = await onSave(targetUser.id, selectedRoles);
    if (ok) {
      onClose();
    }
  };

  const fullName =
    [targetUser.first_name, targetUser.last_name].filter(Boolean).join(" ") ||
    targetUser.email;

  return (
    <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-champagne-light bg-ivory-50 text-charcoal-900 shadow-2xl">
      {/* Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-champagne-light via-champagne to-champagne-dark" />

      {/* Header */}
      <div className="flex items-start justify-between border-b border-champagne-light/60 px-6 pt-5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-champagne-soft text-champagne-dark">
              <Shield className="size-4" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-champagne-dark">
              Otoritas Hak Akses
            </span>
          </div>
          <h2
            id="edit-role-modal-title"
            className="mt-1 font-cormorant text-2xl font-bold text-charcoal-900"
          >
            Ubah Peran (Role) Pengguna
          </h2>
          <p className="text-xs text-charcoal-500">
            Menetapkan peran RBAC untuk akun{" "}
            <strong className="text-charcoal-900">{fullName}</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="rounded-full p-1.5 text-charcoal-500 transition hover:bg-champagne/20 hover:text-charcoal-900"
          aria-label="Tutup dialog"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-xs font-medium text-red-700">
            <AlertTriangle className="size-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isEditingSelf && (
          <div className="rounded-xl border border-champagne bg-champagne-soft/50 p-3 text-xs text-charcoal-700 leading-relaxed">
            <strong>Info Keamanan:</strong> Ini adalah akun Anda sendiri. Demi mencegah kehilangan akses admin, pencabutan peran Super Admin tidak diizinkan.
          </div>
        )}

        <div className="space-y-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-600">
            Daftar Peran yang Ditetapkan:
          </span>

          {AVAILABLE_ROLES.map((r) => {
            const isChecked = selectedRoles.includes(r.name);
            return (
              <label
                key={r.name}
                className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition ${
                  isChecked
                    ? "border-champagne bg-white shadow-xs"
                    : "border-champagne-light/70 bg-ivory-100/40 hover:bg-ivory-100"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 size-4 rounded border-champagne text-champagne-dark focus:ring-champagne"
                  checked={isChecked}
                  onChange={() => handleToggleRole(r.name)}
                  disabled={isSaving || (isEditingSelf && r.name === "SUPER_ADMIN")}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-charcoal-900">
                      {r.label}
                    </span>
                    {r.name === "SUPER_ADMIN" && (
                      <Badge variant="charcoal" className="text-[9px] py-0">
                        Highest Access
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-charcoal-500 leading-snug">
                    {r.desc}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-champagne-light/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSaving}
          >
            Batal
          </Button>
          <Button type="submit" size="sm" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-1.5 size-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Check className="mr-1.5 size-4" />
                Simpan Perubahan Role
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function EditRoleModal({
  open,
  onClose,
  targetUser,
  currentAdminId,
  onSave,
  isSaving,
}: EditRoleModalProps) {
  if (!open || !targetUser) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-role-modal-title"
    >
      <EditRoleFormContent
        key={targetUser.id}
        targetUser={targetUser}
        currentAdminId={currentAdminId}
        onClose={onClose}
        onSave={onSave}
        isSaving={isSaving}
      />
    </div>
  );
}

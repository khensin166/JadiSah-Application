"use client";

import React, { useState } from "react";
import { Crown, Calendar, Check, Loader2, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { AdminUser, SetUserSubscriptionPayload, SubscriptionTier } from "@/types/admin";

interface EditSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  targetUser: AdminUser | null;
  onSave: (userId: string, payload: SetUserSubscriptionPayload) => Promise<boolean>;
  isSaving: boolean;
}

const TIERS: {
  tier: SubscriptionTier;
  label: string;
  desc: string;
  badgeVariant: "secondary" | "warning" | "charcoal";
}[] = [
  {
    tier: "FREE",
    label: "Paket Free (Gratis)",
    desc: "Akses dasar perencanaan pernikahan tanpa batas waktu.",
    badgeVariant: "secondary",
  },
  {
    tier: "PREMIUM",
    label: "Paket Premium",
    desc: "Fitur manajemen tamu lengkap, kolaborasi pasangan, dan ekspor data.",
    badgeVariant: "warning",
  },
  {
    tier: "VIP",
    label: "Paket VIP Atelier",
    desc: "Akses concierge penuh, kuota undangan tak terbatas, dan dukungan prioritas.",
    badgeVariant: "charcoal",
  },
];

interface FormContentProps {
  targetUser: AdminUser;
  onClose: () => void;
  onSave: (userId: string, payload: SetUserSubscriptionPayload) => Promise<boolean>;
  isSaving: boolean;
}

function EditSubscriptionFormContent({
  targetUser,
  onClose,
  onSave,
  isSaving,
}: FormContentProps) {
  const [tier, setTier] = useState<SubscriptionTier>(
    () => targetUser.subscription_tier || "FREE"
  );
  const [expiresAt, setExpiresAt] = useState<string>(() => {
    if (targetUser.subscription_expires_at) {
      const d = new Date(targetUser.subscription_expires_at);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    return "";
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    let isoExpires: string | null = null;
    if (tier !== "FREE" && expiresAt) {
      try {
        isoExpires = new Date(expiresAt).toISOString();
      } catch {
        setErrorMsg("Format tanggal kedaluwarsa tidak valid.");
        return;
      }
    }

    const ok = await onSave(targetUser.id, {
      tier,
      expires_at: isoExpires,
    });
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
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-champagne-gold/20 text-champagne-dark">
              <Crown className="size-4" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-champagne-dark">
              Billing &amp; Subscription
            </span>
          </div>
          <h2
            id="edit-sub-modal-title"
            className="mt-1 font-cormorant text-2xl font-bold text-charcoal-900"
          >
            Ubah Paket Langganan
          </h2>
          <p className="text-xs text-charcoal-500">
            Perbarui tingkat paket akun{" "}
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
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-600">
            Pilih Tingkat Paket:
          </span>

          {TIERS.map((t) => {
            const isSelected = tier === t.tier;
            return (
              <label
                key={t.tier}
                className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition ${
                  isSelected
                    ? "border-champagne bg-white shadow-xs"
                    : "border-champagne-light/70 bg-ivory-100/40 hover:bg-ivory-100"
                }`}
              >
                <input
                  type="radio"
                  name="subscription_tier"
                  value={t.tier}
                  checked={isSelected}
                  onChange={() => setTier(t.tier)}
                  disabled={isSaving}
                  className="mt-1 size-4 text-champagne-dark focus:ring-champagne"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-charcoal-900">
                      {t.label}
                    </span>
                    <Badge variant={t.badgeVariant} className="text-[9px] py-0">
                      {t.tier}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-charcoal-500 leading-snug">
                    {t.desc}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Expiration Date Input (only relevant for PREMIUM and VIP) */}
        {tier !== "FREE" ? (
          <div className="rounded-2xl border border-champagne-light/80 bg-white/80 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-800">
              <Calendar className="size-3.5 text-champagne-dark" />
              <span>Masa Berlaku Paket (Opsional)</span>
            </div>
            <p className="text-[11px] text-charcoal-500 leading-snug">
              Kosongkan tanggal jika langganan bersifat permanen (tanpa batas waktu).
            </p>
            <Input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              disabled={isSaving}
              className="bg-ivory-50 text-xs"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-champagne-light/50 bg-ivory-100/50 p-3 text-[11px] text-charcoal-500">
            Paket FREE tidak memiliki masa kedaluwarsa.
          </div>
        )}

        {/* Actions */}
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
                Simpan Paket
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function EditSubscriptionModal({
  open,
  onClose,
  targetUser,
  onSave,
  isSaving,
}: EditSubscriptionModalProps) {
  if (!open || !targetUser) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-sub-modal-title"
    >
      <EditSubscriptionFormContent
        key={targetUser.id}
        targetUser={targetUser}
        onClose={onClose}
        onSave={onSave}
        isSaving={isSaving}
      />
    </div>
  );
}

"use client";

import React from "react";
import { Check, Heart, Mail, UserCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { UserProfile, UserSummary } from "@/types/auth";
import type { CoupleInvitationList, CoupleLink } from "@/types/couple";

interface CoupleStatusBannerProps {
  user: UserProfile | null;
  couple: CoupleLink | null;
  invitations: CoupleInvitationList;
  isLoading: boolean;
  isMutating: boolean;
  onOpenModal: () => void;
  onAcceptInvitation: (id: string) => Promise<boolean>;
}

function getDisplayName(person?: UserSummary | null): string {
  if (!person) return "Pasangan";
  const full = [person.first_name, person.last_name].filter(Boolean).join(" ").trim();
  return full || person.email;
}

export const CoupleStatusBanner: React.FC<CoupleStatusBannerProps> = ({
  user,
  couple,
  invitations,
  isLoading,
  isMutating,
  onOpenModal,
  onAcceptInvitation,
}) => {
  if (isLoading) return null;

  const partner: UserSummary | null = couple
    ? couple.requester.id === user?.id
      ? couple.partner
      : couple.requester
    : user?.partner ?? null;

  // 1. High-priority banner: Incoming invitation waiting for confirmation
  if (!partner && invitations.incoming.length > 0) {
    const firstIncoming = invitations.incoming[0];
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-champagne bg-gradient-to-r from-champagne-soft via-ivory-50 to-champagne-soft/60 px-5 py-4 soft-shadow">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-champagne text-charcoal-900 shadow-xs">
            <Mail className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-champagne-dark">
                Undangan Pasangan Masuk
              </span>
              <Badge variant="default" className="text-[10px]">
                Menunggu Respon Anda
              </Badge>
            </div>
            <p className="mt-0.5 text-sm text-charcoal-800">
              <strong className="font-semibold text-charcoal-900">
                {getDisplayName(firstIncoming.requester)}
              </strong>{" "}
              ({firstIncoming.requester.email}) mengundang Anda untuk mengelola pernikahan bersama.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            size="sm"
            disabled={isMutating}
            onClick={() => void onAcceptInvitation(firstIncoming.id)}
          >
            <Check className="mr-1.5 size-3.5" />
            Terima Undangan
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenModal}
          >
            Detail
          </Button>
        </div>
      </div>
    );
  }

  // 2. Partner already linked: Subtle luxury status bar
  if (partner) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-champagne-light/80 bg-ivory-50/90 px-5 py-3.5 soft-shadow">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sage-soft text-sage-dark border border-sage/30">
            <UserCheck className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-charcoal-900">
                Terhubung dengan {getDisplayName(partner)}
              </span>
              <Badge variant="success" className="text-[10px] py-0">
                Couple Synced
              </Badge>
            </div>
            <p className="text-xs text-charcoal-500">
              Workspace pernikahan ini disinkronkan bersama {partner.email}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenModal}
          className="shrink-0 text-xs"
        >
          Kelola Pasangan
        </Button>
      </div>
    );
  }

  // 3. Not linked yet: Prompt to invite partner
  const hasOutgoing = invitations.outgoing.length > 0;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-champagne-light bg-gradient-to-r from-ivory-50 via-champagne-soft/30 to-ivory-50 px-5 py-4 soft-shadow">
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-champagne-soft border border-champagne-light text-champagne-dark">
          <Heart className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-charcoal-900">
              {hasOutgoing
                ? "Menunggu Konfirmasi Pasangan"
                : "Hubungkan Akun dengan Pasangan Anda"}
            </h3>
            {hasOutgoing && (
              <Badge variant="default" className="text-[10px]">
                {invitations.outgoing.length} Terkirim
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-charcoal-600">
            {hasOutgoing
              ? `Undangan telah dikirim ke ${invitations.outgoing[0].partner.email}.`
              : "Undang pasangan Anda agar dapat menyusun daftar tamu, anggaran, dan checklist bersama-sama."}
          </p>
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        onClick={onOpenModal}
        className="shrink-0"
      >
        <UserPlus className="mr-1.5 size-3.5" />
        {hasOutgoing ? "Lihat Status Undangan" : "Undang Pasangan"}
      </Button>
    </div>
  );
};


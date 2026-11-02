"use client";

import React, { useState } from "react";
import {
  Check,
  Heart,
  Loader2,
  Mail,
  Send,
  Sparkles,
  Unlink,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/lib/services/auth.service";
import { useSession } from "@/context/auth-context";
import type { UserSummary } from "@/types/auth";
import type { CoupleInvitationList, CoupleLink } from "@/types/couple";

interface CouplePartnerModalProps {
  open: boolean;
  onClose: () => void;
  couple: CoupleLink | null;
  invitations: CoupleInvitationList;
  isMutating: boolean;
  error: string | null;
  successMsg: string | null;
  onClearFeedback: () => void;
  onInvite: (email: string) => Promise<boolean>;
  onAccept: (invitationId: string) => Promise<boolean>;
  onReject: (invitationId: string) => Promise<boolean>;
  onCancel: (invitationId: string) => Promise<boolean>;
  onUnlink: () => Promise<boolean>;
}

function formatPersonName(person?: UserSummary | null): string {
  if (!person) return "Pengguna";
  const full = [person.first_name, person.last_name].filter(Boolean).join(" ").trim();
  return full || person.email;
}

export const CouplePartnerModal: React.FC<CouplePartnerModalProps> = ({
  open,
  onClose,
  couple,
  invitations,
  isMutating,
  error,
  successMsg,
  onClearFeedback,
  onInvite,
  onAccept,
  onReject,
  onCancel,
  onUnlink,
}) => {
  const { user, refresh: refreshSession } = useSession();
  const [activeSection, setActiveSection] = useState<"couple" | "profile">("couple");
  const [partnerEmail, setPartnerEmail] = useState("");

  // Profile form state initialized from current user when switching to profile tab
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);

  if (!open) return null;

  const partnerSummary: UserSummary | null = couple
    ? couple.requester.id === user?.id
      ? couple.partner
      : couple.requester
    : user?.partner ?? null;

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerEmail.trim()) return;
    const ok = await onInvite(partnerEmail.trim());
    if (ok) setPartnerEmail("");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMsg(null);
    setProfileErr(null);
    try {
      await authService.updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });
      await refreshSession();
      setProfileMsg("Profil Anda berhasil diperbarui.");
    } catch (err) {
      setProfileErr(
        err instanceof Error ? err.message : "Gagal memperbarui profil."
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSwitchSection = (section: "couple" | "profile") => {
    onClearFeedback();
    setProfileMsg(null);
    setProfileErr(null);
    if (section === "profile" && user) {
      setFirstName(user.first_name ?? "");
      setLastName(user.last_name ?? "");
    }
    setActiveSection(section);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="couple-modal-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-champagne-light bg-ivory-50 text-charcoal-900 shadow-2xl">
        {/* Top luxury accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-champagne-light via-champagne to-champagne-dark" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-champagne-light/60 px-6 pt-5 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-champagne-soft text-champagne-dark">
                <Heart className="size-4 fill-champagne-dark/20" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-champagne-dark">
                Atelier Concierge
              </span>
            </div>
            <h2
              id="couple-modal-title"
              className="mt-1 font-cormorant text-2xl font-bold text-charcoal-900"
            >
              Pasangan &amp; Profil Pernikahan
            </h2>
            <p className="text-xs text-charcoal-500">
              Kelola tautan akun pasangan Anda untuk berkolaborasi merencanakan hari bahagia.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-charcoal-500 transition hover:bg-champagne/20 hover:text-charcoal-900"
            aria-label="Tutup dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Section Switcher Tabs */}
        <div className="flex gap-2 border-b border-champagne-light/50 bg-ivory-100/60 px-6 py-2.5">
          <button
            type="button"
            onClick={() => handleSwitchSection("couple")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              activeSection === "couple"
                ? "bg-champagne text-charcoal-900 shadow-xs"
                : "text-charcoal-600 hover:bg-champagne/15 hover:text-charcoal-900"
            }`}
          >
            <Users className="size-3.5" />
            <span>Tautan Pasangan</span>
            {invitations.incoming.length > 0 && (
              <span className="ml-1 inline-flex size-4 items-center justify-center rounded-full bg-charcoal-900 text-[10px] font-bold text-ivory-50">
                {invitations.incoming.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => handleSwitchSection("profile")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              activeSection === "profile"
                ? "bg-champagne text-charcoal-900 shadow-xs"
                : "text-charcoal-600 hover:bg-champagne/15 hover:text-charcoal-900"
            }`}
          >
            <Sparkles className="size-3.5" />
            <span>Profil Saya</span>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-5">
          {activeSection === "couple" ? (
            <>
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-xs font-medium text-red-700">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="rounded-xl border border-sage/40 bg-sage-soft px-4 py-3 text-xs font-medium text-sage-dark">
                  {successMsg}
                </div>
              )}

              {/* Active Couple State */}
              {partnerSummary ? (
                <div className="rounded-2xl border border-champagne-light bg-gradient-to-br from-ivory-50 via-champagne-soft/40 to-ivory-100 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="success" className="gap-1">
                      <UserCheck className="size-3" />
                      Pasangan Terhubung
                    </Badge>
                    <span className="text-[11px] text-charcoal-500">
                      Sinkronisasi Aktif
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="rounded-xl border border-champagne-light/70 bg-white/80 p-3.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-champagne-dark">
                        Akun Anda
                      </span>
                      <p className="mt-1 font-cormorant text-lg font-bold text-charcoal-900 truncate">
                        {formatPersonName(user)}
                      </p>
                      <p className="text-xs text-charcoal-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <div className="rounded-xl border border-champagne-light/70 bg-white/80 p-3.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-champagne-dark">
                        Pasangan Anda
                      </span>
                      <p className="mt-1 font-cormorant text-lg font-bold text-charcoal-900 truncate">
                        {formatPersonName(partnerSummary)}
                      </p>
                      <p className="text-xs text-charcoal-500 truncate">
                        {partnerSummary.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-champagne-light/60 pt-3">
                    <span className="text-xs text-charcoal-500">
                      Ingin mengganti tautan akun pasangan?
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isMutating}
                      onClick={() => void onUnlink()}
                      className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      {isMutating ? (
                        <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                      ) : (
                        <Unlink className="mr-1.5 size-3.5" />
                      )}
                      Putuskan Tautan
                    </Button>
                  </div>
                </div>
              ) : (
                /* Invite Partner Form */
                <form
                  onSubmit={handleInviteSubmit}
                  className="rounded-2xl border border-champagne-light bg-ivory-100/50 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <UserPlus className="size-4 text-champagne-dark" />
                    <h3 className="text-sm font-semibold text-charcoal-900">
                      Undang Pasangan Anda
                    </h3>
                  </div>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    Masukkan alamat email pasangan Anda yang sudah terdaftar di JadiSah untuk berbagi workspace pernikahan bersama.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-charcoal-400" />
                      <Input
                        type="email"
                        required
                        placeholder="email.pasangan@contoh.com"
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        disabled={isMutating}
                        className="pl-9 bg-ivory-50"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isMutating || !partnerEmail.trim()}
                      className="shrink-0"
                    >
                      {isMutating ? (
                        <>
                          <Loader2 className="mr-1.5 size-4 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="mr-1.5 size-3.5" />
                          Kirim Undangan
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* Incoming Invitations */}
              {invitations.incoming.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-600">
                    Undangan Masuk ({invitations.incoming.length})
                  </h4>
                  <div className="space-y-2">
                    {invitations.incoming.map((inv) => (
                      <div
                        key={inv.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-champagne bg-champagne-soft/40 p-3.5"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-charcoal-900 truncate">
                            {formatPersonName(inv.requester)}
                          </p>
                          <p className="text-xs text-charcoal-500 truncate">
                            {inv.requester.email} mengundang Anda sebagai pasangan
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            type="button"
                            size="sm"
                            disabled={isMutating}
                            onClick={() => void onAccept(inv.id)}
                          >
                            <Check className="mr-1 size-3.5" />
                            Terima
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isMutating}
                            onClick={() => void onReject(inv.id)}
                          >
                            <X className="mr-1 size-3.5" />
                            Tolak
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outgoing Invitations */}
              {invitations.outgoing.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-600">
                    Undangan Terkirim ({invitations.outgoing.length})
                  </h4>
                  <div className="space-y-2">
                    {invitations.outgoing.map((inv) => (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-champagne-light bg-white/80 p-3.5"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-charcoal-900 truncate">
                              {formatPersonName(inv.partner)}
                            </p>
                            <Badge variant="default" className="text-[10px]">
                              Menunggu Konfirmasi
                            </Badge>
                          </div>
                          <p className="text-xs text-charcoal-500 truncate">
                            {inv.partner.email}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isMutating}
                          onClick={() => void onCancel(inv.id)}
                          className="shrink-0 text-xs"
                        >
                          Batalkan
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Profile Edit Form */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {profileErr && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                  {profileErr}
                </div>
              )}
              {profileMsg && (
                <div className="rounded-xl border border-sage/40 bg-sage-soft px-4 py-3 text-xs font-medium text-sage-dark">
                  {profileMsg}
                </div>
              )}

              <div className="rounded-2xl border border-champagne-light/80 bg-ivory-100/50 p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-champagne-dark">
                    Email Terdaftar
                  </span>
                  <p className="text-sm font-semibold text-charcoal-900 truncate">
                    {user?.email}
                  </p>
                </div>
                <Badge variant="default">
                  Paket {user?.subscription_tier || "FREE"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="profile-first-name"
                    className="text-xs font-semibold text-charcoal-800"
                  >
                    Nama Depan
                  </label>
                  <Input
                    id="profile-first-name"
                    type="text"
                    placeholder="Contoh: Sarah"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSavingProfile}
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="profile-last-name"
                    className="text-xs font-semibold text-charcoal-800"
                  >
                    Nama Belakang
                  </label>
                  <Input
                    id="profile-last-name"
                    type="text"
                    placeholder="Contoh: Amanda"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSavingProfile}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isSavingProfile}>
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="mr-1.5 size-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan Profil"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


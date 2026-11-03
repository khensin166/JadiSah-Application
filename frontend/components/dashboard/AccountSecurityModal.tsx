"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Laptop,
  Loader2,
  Lock,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/lib/services/auth.service";
import type { AuthSession } from "@/types/auth";

interface AccountSecurityModalProps {
  open: boolean;
  onClose: () => void;
  userEmail?: string;
}

const PASSWORD_RULES = [
  { id: "len", label: "Minimal 8 karakter", test: (v: string) => v.length >= 8 },
  { id: "upper", label: "Huruf besar (A-Z)", test: (v: string) => /[A-Z]/.test(v) },
  { id: "number", label: "Angka (0-9)", test: (v: string) => /\d/.test(v) },
  { id: "symbol", label: "Simbol (!@#$...)", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

function getDeviceIcon(ua?: string) {
  if (!ua) return <Laptop className="size-4" />;
  const lower = ua.toLowerCase();
  if (lower.includes("mobile") || lower.includes("android") || lower.includes("iphone")) {
    return <Smartphone className="size-4" />;
  }
  return <Laptop className="size-4" />;
}

export function AccountSecurityModal({
  open,
  onClose,
  userEmail,
}: AccountSecurityModalProps) {
  const [activeTab, setActiveTab] = useState<"password" | "sessions">("password");

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revokeOthers, setRevokeOthers] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  // Sessions state
  const [sessions, setSessions] = useState<AuthSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isRevokingSessions, setIsRevokingSessions] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionSuccess, setSessionSuccess] = useState<string | null>(null);

  const allRulesPass = PASSWORD_RULES.every((r) => r.test(newPassword));
  const confirmMismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;

  // Load sessions when switching to sessions tab
  useEffect(() => {
    if (open && activeTab === "sessions") {
      void fetchSessions();
    }
  }, [open, activeTab]);

  if (!open) return null;

  async function fetchSessions() {
    setIsLoadingSessions(true);
    setSessionError(null);
    try {
      const data = await authService.listSessions();
      setSessions(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSessionError(err.message);
      } else {
        setSessionError("Gagal memuat sesi aktif.");
      }
    } finally {
      setIsLoadingSessions(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (!allRulesPass) {
      setPassError("Kata sandi baru belum memenuhi kriteria keamanan.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsChangingPass(true);
    try {
      await authService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        revoke_other_sessions: revokeOthers,
      });
      setPassSuccess("Kata sandi berhasil diperbarui!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPassError(err.message);
      } else {
        setPassError("Gagal memperbarui kata sandi. Periksa kembali kata sandi saat ini.");
      }
    } finally {
      setIsChangingPass(false);
    }
  }

  async function handleRevokeOtherSessions() {
    setIsRevokingSessions(true);
    setSessionError(null);
    setSessionSuccess(null);
    try {
      await authService.revokeOtherSessions();
      setSessionSuccess("Semua sesi perangkat lain berhasil dicabut.");
      await fetchSessions();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSessionError(err.message);
      } else {
        setSessionError("Gagal mencabut sesi perangkat lain.");
      }
    } finally {
      setIsRevokingSessions(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="security-modal-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-champagne-light bg-ivory-50 text-charcoal-900 shadow-2xl">
        {/* Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-champagne-light via-champagne to-champagne-dark" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-champagne-light/60 px-6 pt-5 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-champagne-soft text-champagne-dark">
                <ShieldCheck className="size-4" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-champagne-dark">
                Keamanan Akun
              </span>
            </div>
            <h2
              id="security-modal-title"
              className="mt-1 font-cormorant text-2xl font-bold text-charcoal-900"
            >
              Pengaturan Keamanan &amp; Sesi
            </h2>
            <p className="text-xs text-charcoal-500">
              Kelola proteksi kata sandi dan pantau akses masuk akun{" "}
              {userEmail && <strong className="text-charcoal-900">{userEmail}</strong>}
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

        {/* Nav Tabs */}
        <div className="flex border-b border-champagne-light/60 bg-white/60 px-6">
          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={`flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition -mb-px mr-6 ${
              activeTab === "password"
                ? "border-champagne-dark text-charcoal-900"
                : "border-transparent text-charcoal-500 hover:text-charcoal-800"
            }`}
          >
            <KeyRound className="size-3.5" />
            <span>Ganti Kata Sandi</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sessions")}
            className={`flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition -mb-px ${
              activeTab === "sessions"
                ? "border-champagne-dark text-charcoal-900"
                : "border-transparent text-charcoal-500 hover:text-charcoal-800"
            }`}
          >
            <Globe className="size-3.5" />
            <span>Sesi Masuk Aktif</span>
            {sessions.length > 0 && (
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-champagne-soft text-champagne-dark border-champagne/30">
                {sessions.length}
              </Badge>
            )}
          </button>
        </div>

        {/* Tab 1: Ganti Kata Sandi */}
        {activeTab === "password" && (
          <form onSubmit={handleChangePassword} className="px-6 py-5 space-y-4">
            {passError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                <AlertCircle className="size-4 shrink-0" />
                <span>{passError}</span>
              </div>
            )}
            {passSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-sage/40 bg-sage-soft px-4 py-3 text-xs font-medium text-sage-dark">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            {/* Current Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="curr-password"
                className="text-xs font-semibold uppercase tracking-wider text-charcoal-700"
              >
                Kata Sandi Saat Ini
              </label>
              <div className="relative">
                <Input
                  id="curr-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi lama Anda"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={isChangingPass}
                  className="bg-white text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-charcoal-400 hover:text-charcoal-700 transition"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="security-new-pass"
                className="text-xs font-semibold uppercase tracking-wider text-charcoal-700"
              >
                Kata Sandi Baru
              </label>
              <Input
                id="security-new-pass"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isChangingPass}
                className="bg-white text-xs"
              />
            </div>

            {/* Rules */}
            <div className="rounded-xl border border-champagne-light/70 bg-ivory-100/60 p-3 space-y-1.5">
              <span className="block text-[11px] font-medium text-charcoal-600">
                Kriteria Keamanan:
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                {PASSWORD_RULES.map((r) => {
                  const pass = r.test(newPassword);
                  return (
                    <div
                      key={r.id}
                      className={`flex items-center gap-1.5 transition ${
                        pass ? "text-sage-dark font-medium" : "text-charcoal-400"
                      }`}
                    >
                      {pass ? <Check className="size-3 text-sage-dark" /> : <X className="size-3" />}
                      <span>{r.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="security-confirm-pass"
                className="text-xs font-semibold uppercase tracking-wider text-charcoal-700"
              >
                Konfirmasi Kata Sandi Baru
              </label>
              <Input
                id="security-confirm-pass"
                type={showPassword ? "text" : "password"}
                placeholder="Ulangi kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isChangingPass}
                className={`bg-white text-xs ${
                  confirmMismatch ? "border-red-400 focus-visible:ring-red-400" : ""
                }`}
              />
              {confirmMismatch && (
                <p className="text-[11px] text-red-600">Konfirmasi kata sandi belum sama.</p>
              )}
            </div>

            {/* Revoke Others Option */}
            <label className="flex items-start gap-2.5 rounded-xl border border-champagne-light/70 bg-white p-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 size-4 rounded border-champagne text-champagne-dark focus:ring-champagne"
                checked={revokeOthers}
                onChange={(e) => setRevokeOthers(e.target.checked)}
                disabled={isChangingPass}
              />
              <div className="text-xs">
                <span className="font-semibold text-charcoal-900">
                  Keluarkan dari perangkat lain
                </span>
                <p className="text-charcoal-500 mt-0.5 leading-snug">
                  Demi keamanan, seluruh sesi login di browser atau perangkat lain akan otomatis dinonaktifkan.
                </p>
              </div>
            </label>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-champagne-light/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isChangingPass}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isChangingPass || !currentPassword || !allRulesPass || confirmMismatch}
              >
                {isChangingPass ? (
                  <>
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Lock className="mr-1.5 size-4" />
                    Perbarui Kata Sandi
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Sesi Masuk Aktif */}
        {activeTab === "sessions" && (
          <div className="px-6 py-5 space-y-4">
            {sessionError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                <AlertCircle className="size-4 shrink-0" />
                <span>{sessionError}</span>
              </div>
            )}
            {sessionSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-sage/40 bg-sage-soft px-4 py-3 text-xs font-medium text-sage-dark">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{sessionSuccess}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-600">
                Perangkat Terhubung ({sessions.length})
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={fetchSessions}
                disabled={isLoadingSessions}
                className="h-7 text-xs text-charcoal-600 gap-1 hover:bg-champagne/20"
              >
                <RefreshCw className={`size-3 ${isLoadingSessions ? "animate-spin" : ""}`} />
                <span>Segarkan</span>
              </Button>
            </div>

            {isLoadingSessions ? (
              <div className="flex flex-col items-center justify-center py-8 text-charcoal-400">
                <Loader2 className="size-6 animate-spin text-champagne-dark mb-2" />
                <p className="text-xs">Memeriksa daftar sesi aktif...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="rounded-2xl border border-champagne-light bg-white p-6 text-center text-xs text-charcoal-500">
                Tidak ada sesi lain yang tercatat selain sesi browser saat ini.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="flex items-center justify-between rounded-2xl border border-champagne-light/70 bg-white p-3.5 transition hover:border-champagne"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-champagne-soft text-champagne-dark">
                        {getDeviceIcon(sess.user_agent)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-charcoal-900 truncate">
                            {sess.ip_address || "Browser Sesi"}
                          </span>
                          {sess.is_current && (
                            <Badge variant="outline" className="text-[9px] py-0 bg-sage-soft text-sage-dark border-sage/40">
                              Sesi Ini
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-charcoal-500 truncate">
                          <Clock className="size-3 shrink-0" />
                          <span>
                            {sess.last_access
                              ? new Date(sess.last_access).toLocaleString("id-ID")
                              : "Aktif"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Revoke All Action */}
            <div className="pt-3 border-t border-champagne-light/60 flex items-center justify-between">
              <p className="text-[11px] text-charcoal-500 max-w-[280px]">
                Mencurigai aktivitas tidak dikenal? Anda dapat mengeluarkan akun dari semua sesi lain.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRevokeOtherSessions}
                disabled={isRevokingSessions || sessions.length <= 1}
                className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                {isRevokingSessions ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Mencabut...
                  </>
                ) : (
                  <>
                    <LogOut className="size-3.5" />
                    Keluarkan Sesi Lain
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/lib/services/auth.service";

const PASSWORD_RULES = [
  { id: "len", label: "Minimal 8 karakter", test: (v: string) => v.length >= 8 },
  { id: "upper", label: "Huruf besar (A-Z)", test: (v: string) => /[A-Z]/.test(v) },
  { id: "number", label: "Angka (0-9)", test: (v: string) => /\d/.test(v) },
  { id: "symbol", label: "Simbol (!@#$...)", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const allRulesPass = PASSWORD_RULES.every((r) => r.test(password));
  const confirmMismatch = confirm.length > 0 && confirm !== password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!token) {
      setErrorMsg("Token reset password tidak ditemukan pada tautan ini.");
      return;
    }
    if (!allRulesPass) {
      setErrorMsg("Kata sandi belum memenuhi seluruh kriteria keamanan.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({ token, new_password: password });
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Gagal mereset kata sandi. Tautan mungkin telah kedaluwarsa atau tidak valid.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Card className="border-champagne-light/70 bg-white/95 shadow-md">
        <CardHeader className="space-y-2 pb-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-1">
            <AlertCircle className="size-6" />
          </div>
          <CardTitle className="text-xl font-cormorant font-bold text-charcoal-900">
            Tautan Tidak Valid
          </CardTitle>
          <CardDescription className="text-xs text-charcoal-600 leading-relaxed">
            Tautan pemulihan kata sandi tidak memuat token verifikasi yang sah atau telah kedaluwarsa.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-3 pt-2">
          <Button asChild className="w-full text-xs font-semibold">
            <Link href="/forgot-password">
              Minta Tautan Reset Baru
            </Link>
          </Button>
          <Link
            href="/login"
            className="text-xs font-medium text-charcoal-500 hover:text-charcoal-800 transition"
          >
            Kembali ke Halaman Masuk
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className="border-champagne-light/70 bg-white/95 shadow-md">
        <CardHeader className="space-y-2 pb-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-sage-soft text-sage-dark mb-1">
            <CheckCircle2 className="size-6" />
          </div>
          <CardTitle className="text-xl font-cormorant font-bold text-charcoal-900">
            Kata Sandi Diperbarui!
          </CardTitle>
          <CardDescription className="text-xs text-charcoal-600 leading-relaxed">
            Kata sandi baru Anda telah berhasil disimpan. Silakan masuk menggunakan kata sandi yang baru dibuat.
          </CardDescription>
        </CardHeader>
        <CardFooter className="pt-2">
          <Button asChild className="w-full text-xs font-semibold gap-1.5">
            <Link href="/login">
              Masuk Sekarang
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-champagne-light/70 bg-white/95 shadow-md">
      <form onSubmit={handleSubmit}>
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center gap-2 mb-1 text-champagne-dark">
            <KeyRound className="size-4" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
              Pemulihan Akses
            </span>
          </div>
          <CardTitle className="text-xl font-cormorant font-bold text-charcoal-900">
            Buat Kata Sandi Baru
          </CardTitle>
          <CardDescription className="text-xs text-charcoal-500">
            Tentukan kata sandi baru yang kuat untuk akun Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* New Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="new-password"
              className="text-xs font-semibold uppercase tracking-wider text-charcoal-700"
            >
              Kata Sandi Baru
            </label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-ivory-50/50 pr-10 text-xs"
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

          {/* Password Validation Rules */}
          <div className="rounded-xl border border-champagne-light/60 bg-ivory-100/50 p-3 space-y-1.5">
            <span className="block text-[11px] font-medium text-charcoal-600">
              Kriteria Keamanan:
            </span>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              {PASSWORD_RULES.map((r) => {
                const pass = r.test(password);
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
              htmlFor="confirm-password"
              className="text-xs font-semibold uppercase tracking-wider text-charcoal-700"
            >
              Ulangi Kata Sandi
            </label>
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Ketik ulang kata sandi baru"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              disabled={isLoading}
              className={`bg-ivory-50/50 text-xs ${
                confirmMismatch ? "border-red-400 focus-visible:ring-red-400" : ""
              }`}
            />
            {confirmMismatch && (
              <p className="text-[11px] text-red-600">Konfirmasi kata sandi belum sama.</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 pt-2">
          <Button
            type="submit"
            className="w-full text-xs font-semibold"
            disabled={isLoading || !allRulesPass || confirmMismatch}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan Kata Sandi...
              </>
            ) : (
              "Simpan Kata Sandi Baru"
            )}
          </Button>

          <div className="text-center text-xs text-charcoal-500">
            Batal ubah sandi?{" "}
            <Link href="/login" className="font-semibold text-champagne-dark hover:underline">
              Kembali ke Masuk
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory-50 p-4">
      <div className="w-full max-w-[420px]">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-champagne to-champagne-dark shadow-md flex items-center justify-center">
            <span className="text-white font-bold text-2xl font-cormorant">J</span>
          </div>
          <h1 className="text-2xl font-cormorant font-semibold text-charcoal-900 tracking-tight">
            JadiSah.
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-champagne-dark font-medium">
            Wedding Atelier Concierge
          </p>
        </div>

        <Suspense
          fallback={
            <Card className="border-champagne-light/70 bg-white/95 p-8 text-center">
              <Loader2 className="mx-auto size-6 animate-spin text-champagne-dark" />
              <p className="mt-3 text-xs text-charcoal-500">Memverifikasi tautan...</p>
            </Card>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}


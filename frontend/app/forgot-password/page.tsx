"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/lib/services/auth.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      await authService.requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Gagal mengirim permintaan reset password. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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

        <Card className="border-champagne-light/70 bg-white/95 shadow-md">
          {isSubmitted ? (
            <div>
              <CardHeader className="space-y-2 pb-4 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-champagne-soft text-champagne-dark mb-1">
                  <CheckCircle2 className="size-6" />
                </div>
                <CardTitle className="text-xl font-cormorant font-bold text-charcoal-900">
                  Instruksi Terkirim
                </CardTitle>
                <CardDescription className="text-xs text-charcoal-600 leading-relaxed">
                  Jika email <strong className="text-charcoal-900">{email}</strong> terdaftar di sistem kami,
                  Anda akan menerima tautan untuk mereset kata sandi. Silakan periksa kotak masuk atau folder spam Anda.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-col space-y-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full text-xs border-champagne-light"
                >
                  Kirim Ulang atau Ganti Email
                </Button>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-charcoal-600 hover:text-charcoal-900 transition"
                >
                  <ArrowLeft className="size-3.5" />
                  Kembali ke Halaman Masuk
                </Link>
              </CardFooter>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl font-cormorant font-bold text-charcoal-900">
                  Lupa Kata Sandi
                </CardTitle>
                <CardDescription className="text-xs text-charcoal-500">
                  Masukkan email akun Anda. Kami akan mengirimkan tautan untuk membuat kata sandi baru.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {errorMsg && (
                  <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wider text-charcoal-700"
                  >
                    Email Akun
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@domain.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="bg-ivory-50/50 pl-9 text-xs"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-charcoal-400" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button type="submit" className="w-full text-xs font-semibold" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengirim Permintaan...
                    </>
                  ) : (
                    "Kirim Tautan Reset Sandi"
                  )}
                </Button>

                <div className="text-center text-xs text-charcoal-500">
                  Ingat kata sandi Anda?{" "}
                  <Link href="/login" className="font-semibold text-champagne-dark hover:underline">
                    Masuk di sini
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}


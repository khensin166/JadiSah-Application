"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const PASSWORD_RULES = [
  { id: "len", label: "Minimal 8 karakter", test: (v: string) => v.length >= 8 },
  { id: "upper", label: "Huruf besar (A-Z)", test: (v: string) => /[A-Z]/.test(v) },
  { id: "number", label: "Angka (0-9)", test: (v: string) => /\d/.test(v) },
  { id: "symbol", label: "Simbol (!@#$...)", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, errorMsg, setErrorMsg } = useAuth();

  const allRulesPass = PASSWORD_RULES.every((r) => r.test(password));
  const confirmMismatch = confirm.length > 0 && confirm !== password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRulesPass) return setErrorMsg("Password belum memenuhi semua kriteria.");
    if (password !== confirm) return setErrorMsg("Konfirmasi password tidak cocok.");
    await register({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory-50 p-4">
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center mb-8 text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-champagne to-champagne-dark shadow-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl font-serif">J</span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-foreground tracking-tight">JadiSah.</h1>
          <p className="text-sm text-muted-foreground">Mulai rencanakan hari bahagia Anda.</p>
        </div>

        <Card className="border-border/40 shadow-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-semibold">Buat akun</CardTitle>
              <CardDescription>Daftar dengan email dan password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {errorMsg && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">Email address</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">Gunakan email aktif untuk verifikasi akun.</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Buat password yang kuat"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-background pr-10"
                  />
                  <button
                    id="toggle-register-password"
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-champagne-dark transition-colors"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <ul className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1">
                  {PASSWORD_RULES.map((rule) => {
                    const ok = rule.test(password);
                    return (
                      <li
                        key={rule.id}
                        className={cn(
                          "flex items-center gap-1.5 text-xs transition-colors",
                          ok ? "text-sage-dark" : "text-muted-foreground"
                        )}
                      >
                        {ok ? <Check className="size-3" /> : <X className="size-3" />}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium leading-none">Konfirmasi password</label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ulangi password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  disabled={isLoading}
                  aria-invalid={confirmMismatch}
                  className={cn("bg-background", confirmMismatch && "border-destructive")}
                />
                {confirmMismatch && <p className="text-xs text-destructive">Password tidak cocok.</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button id="register-submit" type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Membuat akun...
                  </>
                ) : (
                  "Daftar"
                )}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Sudah punya akun?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Masuk
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

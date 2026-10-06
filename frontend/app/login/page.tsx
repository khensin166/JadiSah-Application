"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, errorMsg } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory-50 p-4">
      <div className="w-full max-w-[400px]">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8 text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-champagne to-champagne-dark shadow-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl font-serif">J</span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-foreground tracking-tight">JadiSah.</h1>
          <p className="text-sm text-muted-foreground">Log in to your wedding workspace.</p>
        </div>

        <Card className="border-border/40 shadow-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-semibold">Welcome back</CardTitle>
              <CardDescription>Enter your credentials to continue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {errorMsg && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {errorMsg}
                </div>
              )}
              
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email address
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label 
                    htmlFor="password" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Password
                  </label>
                  <a href="#" className="text-xs font-medium text-primary hover:underline" tabIndex={-1}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password Anda"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={isLoading}
                    className="bg-background pr-10"
                  />
                  <button
                    id="toggle-password-visibility"
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-champagne-dark transition-colors"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Minimal 8 karakter.</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <a href="#" className="font-medium text-primary hover:underline">
                  Sign up
                </a>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

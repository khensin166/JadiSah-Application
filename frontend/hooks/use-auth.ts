"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService, getHomeRouteForRoles } from "../lib/services/auth.service";
import { useSession } from "../context/auth-context";
import type { LoginCredentials, RegisterPayload } from "../types/auth";

function toMessage(err: unknown, fallback: string) {
  const error = err instanceof Error ? err : new Error(String(err));
  return error.message || fallback;
}

export function useAuth() {
  const router = useRouter();
  const { refresh, clear } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /** Setelah sesi dibuat, ambil profil ke context lalu arahkan sesuai role. */
  const redirectAfterAuth = async () => {
    const profile = await refresh();
    router.push(getHomeRouteForRoles(profile?.roles));
    router.refresh();
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      await authService.login(credentials);
      await redirectAfterAuth();
    } catch (err: unknown) {
      setErrorMsg(toMessage(err, "Terjadi kesalahan saat menghubungi server."));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      await authService.register(payload);
      await redirectAfterAuth();
    } catch (err: unknown) {
      setErrorMsg(toMessage(err, "Pendaftaran gagal. Silakan coba lagi."));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err: unknown) {
      console.error("Logout failed", err);
    } finally {
      clear();
      setIsLoading(false);
      router.push("/login");
      router.refresh();
    }
  };

  return { login, register, logout, isLoading, errorMsg, setErrorMsg };
}

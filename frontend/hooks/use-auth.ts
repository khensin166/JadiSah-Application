"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService, getHomeRouteForRoles } from "../lib/services/auth.service";
import type { LoginCredentials } from "../types/auth";

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      await authService.login(credentials);
      // Ambil profil untuk menentukan role, fallback ke dashboard user
      let target = "/dashboard";
      try {
        const profile = await authService.getProfile();
        target = getHomeRouteForRoles(profile.roles);
      } catch (profileErr) {
        console.warn("Gagal mengambil profil, fallback ke /dashboard", profileErr);
      }
      router.push(target);
      router.refresh();
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err))
      setErrorMsg(error.message || "Terjadi kesalahan saat menghubungi server.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      router.push("/login");
      router.refresh();
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err))
      console.error("Logout failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    logout,
    isLoading,
    errorMsg,
  };
}

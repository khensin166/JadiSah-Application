"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "@/lib/services/auth.service";
import type { RoleName, UserProfile } from "@/types/auth";

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (...roles: RoleName[]) => boolean;
  refresh: () => Promise<UserProfile | null>;
  clear: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Menyimpan profil user yang sedang login secara global.
 * Profil diambil dari `GET /api/users/me` saat aplikasi dimuat,
 * sehingga sesi tetap terbaca setelah halaman di-refresh (cookie `limen_session`).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      return profile;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => setUser(null), []);

  useEffect(() => {
    let active = true;
    authService
      .getProfile()
      .then((profile) => {
        if (active) {
          setUser(profile);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      hasRole: (...roles) => roles.some((r) => user?.roles?.includes(r)),
      refresh,
      clear,
    }),
    [user, isLoading, refresh, clear]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSession() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useSession harus dipakai di dalam <AuthProvider>");
  return ctx;
}

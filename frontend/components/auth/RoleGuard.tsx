"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "@/context/auth-context";
import type { RoleName } from "@/types/auth";

interface RoleGuardProps {
  /** Role yang diizinkan. Kosongkan untuk sekadar mewajibkan login. */
  allow?: RoleName[];
  /** Tujuan redirect jika role tidak sesuai. */
  fallback?: string;
  children: React.ReactNode;
}

/** Guard sisi klien: memastikan user login dan memiliki role yang diizinkan. */
export function RoleGuard({ allow, fallback = "/dashboard", children }: RoleGuardProps) {
  const router = useRouter();
  const { user, isLoading, hasRole } = useSession();
  const permitted = !!user && (!allow || allow.length === 0 || hasRole(...allow));

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace("/login");
    else if (!permitted) router.replace(fallback);
  }, [isLoading, user, permitted, fallback, router]);

  if (isLoading || !permitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory-50">
        <Loader2 className="size-6 animate-spin text-champagne-dark" />
      </div>
    );
  }

  return <>{children}</>;
}

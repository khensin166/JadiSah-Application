import { NextResponse, type NextRequest } from "next/server";

/**
 * Route protection (Next.js 16 `proxy`, pengganti `middleware`).
 *
 * Pemeriksaan optimistik berbasis keberadaan cookie sesi Limen (`limen_session`).
 * Validasi sesi & role yang sebenarnya tetap dilakukan oleh backend (RBAC)
 * dan oleh <RoleGuard> di sisi klien untuk halaman /admin.
 */
const SESSION_COOKIE = "limen_session";
const PROTECTED_PREFIXES = ["/dashboard", "/admin"];
const GUEST_ONLY = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (isProtected && !hasSession) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (GUEST_ONLY.includes(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};

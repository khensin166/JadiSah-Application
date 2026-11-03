import type { RoleName } from "./auth";

/**
 * Tipe data Admin Console — mengikuti kontrak OpenAPI backend
 * (`backend/generated/api/server.gen.go` & `backend/internal/api/admin.go`).
 */

export type { RoleName };

/** Tier langganan yang valid di backend (`models.Free`, `models.Premium`, `models.VIP`). */
export type SubscriptionTier = "FREE" | "PREMIUM" | "VIP";

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = ["FREE", "PREMIUM", "VIP"];
export const ROLE_NAMES: RoleName[] = ["USER", "ADMIN", "SUPER_ADMIN"];

/** Representasi user pada daftar admin (`AdminUser`). */
export interface AdminUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  roles: RoleName[];
  subscription_tier: SubscriptionTier;
  subscription_expires_at?: string | null;
}

/** Response paginasi `GET /api/admin/users` (`AdminUserPage`). */
export interface AdminUserPage {
  items: AdminUser[];
  page: number;
  per_page: number;
  total: number;
}

/** Query parameter `GET /api/admin/users`. */
export interface AdminListUsersParams {
  /** Filter email / nama (contains, case-insensitive) */
  q?: string;
  page?: number;
  /** Maksimal 100 (dibatasi backend) */
  per_page?: number;
}

/** Role beserta daftar permission (`GET /api/admin/roles`). */
export interface AdminRole {
  name: RoleName;
  description?: string;
  permissions: string[];
}

/** Body `PUT /api/admin/users/{userId}/roles` — wajib minimal 1 role. */
export interface SetUserRolesPayload {
  roles: RoleName[];
}

/** Body `PUT /api/admin/users/{userId}/subscription`. */
export interface SetUserSubscriptionPayload {
  tier: SubscriptionTier;
  /** ISO8601. Kosongkan untuk tanpa batas waktu (otomatis null untuk FREE). */
  expires_at?: string | null;
}

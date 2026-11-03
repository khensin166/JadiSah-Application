import { apiClient } from "../api-client";
import type {
  AdminListUsersParams,
  AdminRole,
  AdminUser,
  AdminUserPage,
  SetUserRolesPayload,
  SetUserSubscriptionPayload,
} from "../../types/admin";

/**
 * Service Admin Console. Seluruh endpoint dilindungi RBAC di backend
 * (`backend/internal/api/admin.go`):
 * - `users:read`           -> listUsers
 * - `roles:read`           -> listRoles
 * - `roles:assign`         -> setUserRoles (SUPER_ADMIN)
 * - `subscriptions:update` -> setUserSubscription (SUPER_ADMIN)
 */
export const adminService = {
  /** `GET /api/admin/users?q=&page=&per_page=` */
  async listUsers(params: AdminListUsersParams = {}): Promise<AdminUserPage> {
    const query = new URLSearchParams();
    if (params.q?.trim()) query.set("q", params.q.trim());
    if (params.page) query.set("page", String(params.page));
    if (params.per_page) query.set("per_page", String(params.per_page));

    const qs = query.toString();
    return apiClient<AdminUserPage>(`/admin/users${qs ? `?${qs}` : ""}`, {
      method: "GET",
    });
  },

  /** `GET /api/admin/roles` */
  async listRoles(): Promise<AdminRole[]> {
    return apiClient<AdminRole[]>("/admin/roles", { method: "GET" });
  },

  /**
   * `PUT /api/admin/users/{userId}/roles`
   * Error 409 bila SUPER_ADMIN mencoba mencabut role SUPER_ADMIN miliknya sendiri.
   */
  async setUserRoles(userId: string, payload: SetUserRolesPayload): Promise<AdminUser> {
    return apiClient<AdminUser>(`/admin/users/${userId}/roles`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /** `PUT /api/admin/users/{userId}/subscription` */
  async setUserSubscription(
    userId: string,
    payload: SetUserSubscriptionPayload
  ): Promise<AdminUser> {
    const body: SetUserSubscriptionPayload = {
      tier: payload.tier,
      // FREE tidak memiliki masa berlaku
      expires_at: payload.tier === "FREE" ? null : payload.expires_at || null,
    };
    return apiClient<AdminUser>(`/admin/users/${userId}/subscription`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },
};


import { apiClient } from "../api-client";
import type { LoginCredentials, RoleName, UserProfile, UserSession } from "../../types/auth";

/**
 * Service to handle all authentication-related API calls.
 */
export const authService = {
  /**
   * Logs in a user using credentials.
   */
  async login(credentials: LoginCredentials): Promise<UserSession> {
    return apiClient<UserSession>("/auth/signin/credential", {
      method: "POST",
      body: JSON.stringify({
        credential: credentials.email || credentials.credential,
        password: credentials.password,
        remember_me: credentials.remember_me ?? true,
      }),
    });
  },

  /**
   * Fetches the current user's profile (including roles).
   */
  async getProfile(): Promise<UserProfile> {
    return apiClient<UserProfile>("/users/me", { method: "GET" });
  },

  /**
   * Logs out the current user session.
   */
  async logout(): Promise<void> {
    return apiClient<void>("/auth/signout", {
      method: "POST",
    });
  },
};

/**
 * Resolves the landing route for a given set of roles.
 * ADMIN / SUPER_ADMIN -> /admin, everyone else -> /dashboard.
 */
export function getHomeRouteForRoles(roles: RoleName[] = []): string {
  if (roles.includes("SUPER_ADMIN") || roles.includes("ADMIN")) return "/admin";
  return "/dashboard";
}

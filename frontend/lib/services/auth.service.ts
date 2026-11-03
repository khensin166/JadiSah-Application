import { apiClient } from "../api-client";
import type {
  AuthSession,
  ChangePasswordPayload,
  LoginCredentials,
  RegisterPayload,
  ResetPasswordPayload,
  RoleName,
  UpdateProfilePayload,
  UserProfile,
  UserSession,
} from "../../types/auth";

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
   * Registers a new account (Limen credential-password). Session cookie is set on success.
   */
  async register(payload: RegisterPayload): Promise<UserSession> {
    return apiClient<UserSession>("/auth/signup/credential", {
      method: "POST",
      body: JSON.stringify({ email: payload.email, password: payload.password }),
    });
  },

  /**
   * Fetches the current user's profile (including roles & partner).
   */
  async getProfile(): Promise<UserProfile> {
    return apiClient<UserProfile>("/users/me", { method: "GET" });
  },

  /**
   * Updates the current user's first_name / last_name.
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<{ message: string }> {
    return apiClient<{ message: string }>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Logs out the current user session.
   */
  async logout(): Promise<void> {
    return apiClient<void>("/auth/signout", {
      method: "POST",
    });
  },

  /**
   * Requests a password reset link sent to user's email.
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>("/auth/passwords/request-reset", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Resets the password using the token received from email.
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    return apiClient<{ message: string }>("/auth/passwords/reset", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Changes current password for authenticated user.
   */
  async changePassword(payload: ChangePasswordPayload): Promise<UserSession> {
    return apiClient<UserSession>("/auth/passwords/change", {
      method: "POST",
      body: JSON.stringify({
        current_password: payload.current_password,
        new_password: payload.new_password,
        revoke_other_sessions: payload.revoke_other_sessions ?? true,
      }),
    });
  },

  /**
   * Lists active sessions for current user.
   */
  async listSessions(): Promise<AuthSession[]> {
    return apiClient<AuthSession[]>("/auth/sessions", {
      method: "GET",
    });
  },

  /**
   * Revokes all active sessions for current user (except current or all).
   */
  async revokeOtherSessions(): Promise<void> {
    return apiClient<void>("/auth/revoke-sessions", {
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

export interface LoginCredentials {
  credential?: string; // Email or username
  email?: string; // Some endpoints might use email
  password: string;
  remember_me?: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

/** Role names as seeded by the backend (see backend/internal/db/seeder.go). */
export type RoleName = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface UserSession {
  id: string;
  user_id: string;
  expires_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface UserSummary {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  subscription_tier: string;
  email_verified?: boolean;
  email_verified_at?: string;
  roles?: RoleName[];
  permissions?: string[];
  partner?: UserSummary | null;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  revoke_other_sessions?: boolean;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface AuthSession {
  id: string;
  user_id?: string;
  created_at?: string;
  expires_at?: string;
  last_access?: string;
  ip_address?: string;
  user_agent?: string;
  is_current?: boolean;
  metadata?: string;
}


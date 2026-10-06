export interface LoginCredentials {
  credential?: string; // Email or username
  email?: string; // Some endpoints might use email
  password: string;
  remember_me?: boolean;
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

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  subscription_tier: string;
  email_verified_at?: string;
  roles?: RoleName[];
  permissions?: string[];
}

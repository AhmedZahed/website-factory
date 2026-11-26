export type AdminRole = "admin" | "staff";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export interface AuthSessionData {
  userId: string;
  expiresAt: number;
}

export interface AdminAccount extends AuthUser {
  password_hash: string;
  is_active: number;
}

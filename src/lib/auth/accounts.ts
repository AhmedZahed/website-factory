import type { D1Database } from "@cloudflare/workers-types";
import type { AdminAccount, AuthUser } from "./types";

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_SECONDS = 15 * 60;

export interface LoginRateLimit {
  allowed: boolean;
  retryAfterSeconds: number;
}

export async function findAccountByEmail(
  db: D1Database,
  email: string,
): Promise<AdminAccount | null> {
  return db
    .prepare(
      `SELECT id, name, email, password_hash, role, is_active
       FROM admin_accounts
       WHERE email = ?1 COLLATE NOCASE`,
    )
    .bind(email)
    .first<AdminAccount>();
}

export async function findAccountById(
  db: D1Database,
  id: string,
): Promise<AdminAccount | null> {
  return db
    .prepare(
      `SELECT id, name, email, password_hash, role, is_active
       FROM admin_accounts
       WHERE id = ?1`,
    )
    .bind(id)
    .first<AdminAccount>();
}

export function toAuthUser(account: AdminAccount): AuthUser {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
  };
}

export async function updateLastLogin(
  db: D1Database,
  id: string,
): Promise<void> {
  await db
    .prepare(
      `UPDATE admin_accounts
       SET last_login_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE id = ?1 AND is_active = 1`,
    )
    .bind(id)
    .run();
}

export async function hashClientAddress(address: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(address || "unknown"),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function consumeLoginAttempt(
  db: D1Database,
  ipKey: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): Promise<LoginRateLimit> {
  await db
    .prepare("DELETE FROM auth_login_attempts WHERE window_started_at < ?1")
    .bind(nowSeconds - 24 * 60 * 60)
    .run();

  const row = await db
    .prepare(
      `INSERT INTO auth_login_attempts (
         ip_key, attempts, window_started_at, updated_at
       )
       VALUES (?1, 1, ?2, ?2)
       ON CONFLICT(ip_key) DO UPDATE SET
         attempts = CASE
           WHEN ?2 - auth_login_attempts.window_started_at >= ?3 THEN 1
           ELSE auth_login_attempts.attempts + 1
         END,
         window_started_at = CASE
           WHEN ?2 - auth_login_attempts.window_started_at >= ?3 THEN ?2
           ELSE auth_login_attempts.window_started_at
         END,
         updated_at = ?2
       RETURNING attempts, window_started_at`,
    )
    .bind(ipKey, nowSeconds, LOGIN_WINDOW_SECONDS)
    .first<{ attempts: number; window_started_at: number }>();

  if (!row) throw new Error("Unable to record login attempt");

  const retryAfterSeconds = Math.max(
    1,
    row.window_started_at + LOGIN_WINDOW_SECONDS - nowSeconds,
  );

  return {
    allowed: row.attempts <= MAX_LOGIN_ATTEMPTS,
    retryAfterSeconds,
  };
}

export async function clearLoginAttempts(
  db: D1Database,
  ipKey: string,
): Promise<void> {
  await db
    .prepare("DELETE FROM auth_login_attempts WHERE ip_key = ?1")
    .bind(ipKey)
    .run();
}

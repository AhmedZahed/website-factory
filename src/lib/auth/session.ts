import type { AstroSession } from "astro";
import { z } from "zod";
import type { AuthSessionData } from "./types";

export const AUTH_SESSION_KEY = "auth";
export const AUTH_SESSION_TTL_SECONDS = 8 * 60 * 60;

const authSessionSchema = z.object({
  userId: z.string().min(1).max(256),
  expiresAt: z.number().int().positive(),
});

export function isAuthSessionValid(
  value: unknown,
  now = Date.now(),
): value is AuthSessionData {
  const parsed = authSessionSchema.safeParse(value);
  return parsed.success && parsed.data.expiresAt > now;
}

export async function establishAuthenticatedSession(
  session: AstroSession,
  userId: string,
  now = Date.now(),
): Promise<AuthSessionData> {
  await session.regenerate();
  const data = { userId, expiresAt: now + AUTH_SESSION_TTL_SECONDS * 1000 };
  session.set(AUTH_SESSION_KEY, data, { ttl: AUTH_SESSION_TTL_SECONDS });
  return data;
}

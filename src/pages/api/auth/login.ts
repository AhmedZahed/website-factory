import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import {
  apiError,
  isSameOriginRequest,
  jsonResponse,
  readValidatedJson,
} from "../../../lib/api/json";
import {
  clearLoginAttempts,
  consumeLoginAttempt,
  findAccountByEmail,
  hashClientAddress,
  toAuthUser,
  updateLastLogin,
} from "../../../lib/auth/accounts";
import { hashPassword, verifyPassword } from "../../../lib/auth/password";
import {
  AUTH_SESSION_TTL_SECONDS,
  establishAuthenticatedSession,
} from "../../../lib/auth/session";
import { loginSchema } from "../../../lib/validation/auth";

export const prerender = false;

let dummyPasswordHash: Promise<string> | undefined;

async function getDummyPasswordHash(): Promise<string> {
  dummyPasswordHash ??= hashPassword(
    `${crypto.randomUUID()}${crypto.randomUUID()}`,
  );
  return dummyPasswordHash;
}

export const POST: APIRoute = async ({
  request,
  clientAddress,
  session,
}) => {
  if (!session) return apiError("Authentication service unavailable", 503);
  if (!isSameOriginRequest(request)) {
    return apiError("Cross-origin request rejected", 403);
  }

  const parsedBody = await readValidatedJson(request, loginSchema);
  if (!parsedBody.success) return parsedBody.response;

  try {
    const ipKey = await hashClientAddress(clientAddress);
    const limit = await consumeLoginAttempt(
      env.DB,
      ipKey,
      Math.floor(Date.now() / 1000),
    );
    if (!limit.allowed) {
      return jsonResponse(
        { error: "Too many login attempts. Try again later." },
        429,
        { "retry-after": String(limit.retryAfterSeconds) },
      );
    }

    const account = await findAccountByEmail(env.DB, parsedBody.data.email);
    const hashToCheck = account?.password_hash ?? (await getDummyPasswordHash());
    const passwordMatches = await verifyPassword(
      parsedBody.data.password,
      hashToCheck,
    );

    if (!account || account.is_active !== 1 || !passwordMatches) {
      return apiError("Invalid email or password", 401);
    }

    await updateLastLogin(env.DB, account.id);
    await clearLoginAttempts(env.DB, ipKey);
    const authSession = await establishAuthenticatedSession(
      session,
      account.id,
    );

    return jsonResponse({
      user: toAuthUser(account),
      expiresAt: authSession.expiresAt,
      expiresInSeconds: AUTH_SESSION_TTL_SECONDS,
    });
  } catch {
    return apiError("Unable to sign in right now", 503);
  }
};

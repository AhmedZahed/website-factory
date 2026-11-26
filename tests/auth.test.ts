import assert from "node:assert/strict";
import { test } from "node:test";
import { hashPassword, verifyPassword } from "../src/lib/auth/password.ts";
import {
  canAccessPrivateRoute,
  isProtectedPath,
} from "../src/lib/auth/policy.ts";
import {
  AUTH_SESSION_KEY,
  AUTH_SESSION_TTL_SECONDS,
  establishAuthenticatedSession,
  isAuthSessionValid,
} from "../src/lib/auth/session.ts";
import { consumeLoginAttempt } from "../src/lib/auth/accounts.ts";
import { loginSchema } from "../src/lib/validation/auth.ts";

test("password hashes verify without storing the original password", async () => {
  const password = `Test-${crypto.randomUUID()}-LongPassphrase`;
  const encodedHash = await hashPassword(password);

  assert.match(encodedHash, /^pbkdf2-sha256\$600000\$/);
  assert.equal(encodedHash.includes(password), false);
  assert.equal(await verifyPassword(password, encodedHash), true);
  assert.equal(await verifyPassword(`${password}-wrong`, encodedHash), false);
});

test("private routes require authentication except health and login/logout", () => {
  assert.equal(isProtectedPath("/admin"), true);
  assert.equal(isProtectedPath("/admin/customers"), true);
  assert.equal(isProtectedPath("/admin/templates/preview/builtin-law-firms-legal"), true);
  assert.equal(isProtectedPath("/api/customers"), true);
  assert.equal(isProtectedPath("/api/auth/me"), true);
  assert.equal(isProtectedPath("/api/health"), false);
  assert.equal(isProtectedPath("/api/auth/login"), false);
  assert.equal(isProtectedPath("/api/auth/logout"), false);
});

test("staff can access only explicitly permitted customer routes", () => {
  assert.equal(
    canAccessPrivateRoute("staff", "/api/customers", "GET"),
    true,
  );
  assert.equal(
    canAccessPrivateRoute("staff", "/api/customers", "POST"),
    true,
  );
  assert.equal(
    canAccessPrivateRoute("staff", "/api/customers/123", "PATCH"),
    true,
  );
  assert.equal(canAccessPrivateRoute("staff", "/admin", "GET"), true);
  assert.equal(
    canAccessPrivateRoute("staff", "/admin/customers", "GET"),
    true,
  );
  assert.equal(
    canAccessPrivateRoute("staff", "/api/auth/me", "GET"),
    true,
  );
  assert.equal(
    canAccessPrivateRoute("staff", "/api/customers/123", "DELETE"),
    false,
  );
  assert.equal(
    canAccessPrivateRoute("staff", "/api/customers/123", "GET"),
    false,
  );
  assert.equal(
    canAccessPrivateRoute("staff", "/api/admin/accounts", "GET"),
    false,
  );
  assert.equal(
    canAccessPrivateRoute("staff", "/api/reports/export", "GET"),
    false,
  );
  assert.equal(
    canAccessPrivateRoute("staff", "/admin/websites", "GET"),
    false,
  );
  assert.equal(
    canAccessPrivateRoute("staff", "/admin/templates", "GET"),
    false,
  );
  assert.equal(
    canAccessPrivateRoute(
      "staff",
      "/admin/templates/preview/builtin-law-firms-legal",
      "GET",
    ),
    false,
  );
  assert.equal(
    canAccessPrivateRoute("staff", "/api/auth/me", "POST"),
    false,
  );
  assert.equal(
    canAccessPrivateRoute("admin", "/api/customers/123", "DELETE"),
    true,
  );
  assert.equal(
    canAccessPrivateRoute("admin", "/api/reports/export", "GET"),
    true,
  );
  assert.equal(
    canAccessPrivateRoute(
      "admin",
      "/admin/templates/preview/builtin-law-firms-legal",
      "GET",
    ),
    true,
  );
});

test("login validation rejects malformed email, empty password, and extra fields", () => {
  assert.equal(
    loginSchema.safeParse({
      email: "admin@example.invalid",
      password: "not-a-real-password",
    }).success,
    true,
  );
  assert.equal(
    loginSchema.safeParse({ email: "not-an-email", password: "x" }).success,
    false,
  );
  assert.equal(
    loginSchema.safeParse({
      email: "admin@example.invalid",
      password: "valid-password",
      role: "admin",
    }).success,
    false,
  );
});

test("expired and malformed session claims are rejected", () => {
  assert.equal(
    isAuthSessionValid({ userId: "user-1", expiresAt: 2_000 }, 1_999),
    true,
  );
  assert.equal(
    isAuthSessionValid({ userId: "user-1", expiresAt: 2_000 }, 2_000),
    false,
  );
  assert.equal(
    isAuthSessionValid({ userId: "", expiresAt: 9_000 }, 1_000),
    false,
  );
});

test("login rate limit blocks the sixth attempt and resets after its window", async () => {
  const records = new Map<string, { attempts: number; windowStartedAt: number }>();
  const db = {
    prepare() {
      return {
        bind(ipKey: string, now: number, windowSeconds: number) {
          return {
            async run() {
              return { success: true };
            },
            async first() {
              const current = records.get(ipKey);
              const expired =
                !current || now - current.windowStartedAt >= windowSeconds;
              const next = {
                attempts: expired ? 1 : current.attempts + 1,
                window_started_at: expired ? now : current.windowStartedAt,
              };
              records.set(ipKey, {
                attempts: next.attempts,
                windowStartedAt: next.window_started_at,
              });
              return next;
            },
          };
        },
      };
    },
  };

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    assert.equal(
      (await consumeLoginAttempt(db as never, "test-ip-key", 10_000)).allowed,
      true,
    );
  }
  const blocked = await consumeLoginAttempt(db as never, "test-ip-key", 10_000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 900);

  const reset = await consumeLoginAttempt(db as never, "test-ip-key", 10_900);
  assert.equal(reset.allowed, true);
  assert.equal(reset.retryAfterSeconds, 900);
});

test("login regenerates the session ID before setting authenticated state", async () => {
  const calls: string[] = [];
  let savedValue: unknown;
  let savedTtl: number | undefined;
  const session = {
    async regenerate() {
      calls.push("regenerate");
    },
    set(key: string, value: unknown, options?: { ttl?: number }) {
      calls.push(`set:${key}`);
      savedValue = value;
      savedTtl = options?.ttl;
    },
  };

  const data = await establishAuthenticatedSession(
    session as never,
    "account-1",
    10_000,
  );

  assert.deepEqual(calls, ["regenerate", `set:${AUTH_SESSION_KEY}`]);
  assert.deepEqual(savedValue, data);
  assert.equal(savedTtl, AUTH_SESSION_TTL_SECONDS);
  assert.equal(data.expiresAt, 10_000 + AUTH_SESSION_TTL_SECONDS * 1_000);
});

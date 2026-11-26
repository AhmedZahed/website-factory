import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { hashPassword } from "../src/lib/auth/password.ts";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const baseUrl =
  process.env.WEBSITE_FACTORY_AUTH_TEST_URL ?? "http://localhost:80";
const origin = new URL(baseUrl).origin;
const adminId = randomUUID();
const staffId = randomUUID();
const adminEmail = `admin-${randomUUID()}@example.invalid`;
const staffEmail = `staff-${randomUUID()}@example.invalid`;
const adminPassword = `Admin-${randomUUID()}-test-only`;
const staffPassword = `Staff-${randomUUID()}-test-only`;
let temporaryDirectory;
let seeded = false;

function sqlQuote(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

async function executeLocalD1(sql) {
  temporaryDirectory ??= await mkdtemp(
    join(tmpdir(), "website-factory-auth-test-"),
  );
  const sqlPath = join(temporaryDirectory, `query-${randomUUID()}.sql`);
  await writeFile(sqlPath, sql, {
    encoding: "utf8",
    mode: 0o600,
    flag: "wx",
  });

  const command = spawnSync(
    "pnpm",
    [
      "exec",
      "wrangler",
      "d1",
      "execute",
      "website-factory",
      "--local",
      "--file",
      sqlPath,
    ],
    { cwd: projectRoot, encoding: "utf8" },
  );
  if (command.error) throw command.error;
  if (command.status !== 0) {
    throw new Error("Local D1 test setup or cleanup failed");
  }
}

function cookieFrom(response) {
  const header = response.headers.get("set-cookie");
  assert.ok(header, "expected session cookie");
  return header.split(";")[0];
}

async function login(email, password, extraHeaders = {}) {
  return fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify({ email, password }),
  });
}

try {
  const adminHash = await hashPassword(adminPassword);
  const staffHash = await hashPassword(staffPassword);
  await executeLocalD1(
    `INSERT INTO admin_accounts (id, name, email, password_hash, role)
     VALUES (${sqlQuote(adminId)}, 'Integration Admin', ${sqlQuote(adminEmail)}, ${sqlQuote(adminHash)}, 'admin');
     INSERT INTO admin_accounts (id, name, email, password_hash, role)
     VALUES (${sqlQuote(staffId)}, 'Integration Staff', ${sqlQuote(staffEmail)}, ${sqlQuote(staffHash)}, 'staff');`,
  );
  seeded = true;

  const unauthenticatedApi = await fetch(`${baseUrl}/api/customers`);
  assert.equal(unauthenticatedApi.status, 401);

  for (const path of [
    "/admin",
    "/admin/customers",
    "/admin/websites",
    "/admin/templates",
    "/admin/orders",
  ]) {
    const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
    assert.equal(response.status, 302, `${path} should require authentication`);
    assert.equal(response.headers.get("location"), "/admin/login");
  }
  assert.equal(
    (await fetch(`${baseUrl}/api/auth/me`)).status,
    401,
  );
  assert.equal((await fetch(`${baseUrl}/api/health`)).status, 200);

  const crossOrigin = await login(adminEmail, adminPassword, {
    origin: "https://attacker.invalid",
  });
  assert.equal(crossOrigin.status, 403);

  const invalidLogin = await login(adminEmail, `${adminPassword}-wrong`);
  assert.equal(invalidLogin.status, 401);
  assert.deepEqual(await invalidLogin.json(), {
    error: "Invalid email or password",
  });

  const fixationCookie = "__Host-wf_session=00000000-0000-4000-8000-000000000000";
  const adminLogin = await login(adminEmail, adminPassword, {
    cookie: fixationCookie,
  });
  assert.equal(adminLogin.status, 200);
  const adminCookie = cookieFrom(adminLogin);
  assert.notEqual(adminCookie, fixationCookie);
  const setCookieHeader = adminLogin.headers.get("set-cookie").toLowerCase();
  assert.match(setCookieHeader, /secure/);
  assert.match(setCookieHeader, /httponly/);
  assert.match(setCookieHeader, /samesite=strict/);
  assert.match(setCookieHeader, /path=\//);
  assert.match(setCookieHeader, /max-age=28800/);

  const adminMe = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { cookie: adminCookie },
  });
  assert.equal(adminMe.status, 200);
  assert.equal((await adminMe.json()).user.role, "admin");

  const adminCustomers = await fetch(`${baseUrl}/api/customers`, {
    headers: { cookie: adminCookie },
  });
  assert.equal(adminCustomers.status, 200);
  const adminWebsitesPage = await fetch(`${baseUrl}/admin/websites`, {
    headers: { cookie: adminCookie },
  });
  assert.equal(adminWebsitesPage.status, 200);

  const adminDeleteMissing = await fetch(
    `${baseUrl}/api/customers/nonexistent-auth-test-id`,
    { method: "DELETE", headers: { cookie: adminCookie, origin } },
  );
  assert.equal(adminDeleteMissing.status, 404);

  const adminLogout = await fetch(`${baseUrl}/api/auth/logout`, {
    method: "POST",
    headers: { cookie: adminCookie, origin },
  });
  assert.equal(adminLogout.status, 204);
  const afterAdminLogout = await fetch(`${baseUrl}/api/customers`, {
    headers: { cookie: adminCookie },
  });
  assert.equal(afterAdminLogout.status, 401);

  const staffLogin = await login(staffEmail, staffPassword);
  assert.equal(staffLogin.status, 200);
  const staffCookie = cookieFrom(staffLogin);
  const staffMe = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { cookie: staffCookie },
  });
  assert.equal((await staffMe.json()).user.role, "staff");

  const staffCustomers = await fetch(`${baseUrl}/api/customers`, {
    headers: { cookie: staffCookie },
  });
  assert.equal(staffCustomers.status, 200);
  const staffAdminPage = await fetch(`${baseUrl}/admin/customers`, {
    headers: { cookie: staffCookie },
  });
  assert.equal(staffAdminPage.status, 200);
  for (const path of [
    "/admin/websites",
    "/admin/templates",
    "/admin/orders",
  ]) {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { cookie: staffCookie },
    });
    assert.equal(response.status, 403, `${path} is admin-only`);
  }

  const staffDelete = await fetch(
    `${baseUrl}/api/customers/nonexistent-auth-test-id`,
    { method: "DELETE", headers: { cookie: staffCookie, origin } },
  );
  assert.equal(staffDelete.status, 403);
  const staffUnknownNestedRoute = await fetch(
    `${baseUrl}/api/customers/123/private-export`,
    { headers: { cookie: staffCookie } },
  );
  assert.equal(staffUnknownNestedRoute.status, 403);

  const staffLogout = await fetch(`${baseUrl}/api/auth/logout`, {
    method: "POST",
    headers: { cookie: staffCookie, origin },
  });
  assert.equal(staffLogout.status, 204);

  process.stdout.write(
    "Authentication integration passed: protected routes, login, cookie flags, session rotation, logout, and admin/staff permissions.\n",
  );
} finally {
  if (seeded) {
    await executeLocalD1(
      `DELETE FROM admin_accounts WHERE id IN (${sqlQuote(adminId)}, ${sqlQuote(staffId)});`,
    );
  }
  if (temporaryDirectory) {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

# Admin authentication

Phase 3 uses the Astro Cloudflare adapter's server-side session API, backed by its automatically provisioned `SESSION` KV binding. The session ID is regenerated after login, and the session cookie is `__Host-wf_session` with Secure, HttpOnly, SameSite=Strict, Path=/, and an eight-hour lifetime.

Admin and staff credentials live in the additive `admin_accounts` D1 table. Passwords are hashed with PBKDF2-HMAC-SHA-256 using 600,000 iterations and a random 16-byte salt. The interactive `auth:create-account` command prompts without echoing the password and sends only the resulting hash to D1. It defaults to local D1; `--remote` requires typing `REMOTE` and relies on Wrangler's configured Cloudflare account.

Middleware protects every `/admin` route except `/admin/login` and every `/api` route except `/api/health`, `/api/auth/login`, and `/api/auth/logout`. Admins can use all private routes. Staff access is allowlisted to `GET /admin`, `GET /admin/customers`, `GET /api/auth/me`, `GET`/`POST /api/customers`, and `PATCH /api/customers/:id`; all other private route/action combinations are denied.

Login attempts are limited to five per client address in a 15-minute window. Only a SHA-256 digest of the client address is stored. Session claims are checked against D1 on each protected request so deactivated accounts lose access immediately.

No admin account is seeded by migration. Create the first account interactively with `pnpm --filter @workspace/website-factory run auth:create-account`.

`pnpm --filter @workspace/website-factory run test:auth:live` runs against the local preview and prompts for an existing admin account. It never creates accounts or changes customer records. A successful login updates `last_login_at` and clears rate-limit attempts for that client address; the six wrong-password attempts leave a limiter record and can block that address for the rest of its 15-minute window. The script asks for confirmation before sending credentials and never prints them.

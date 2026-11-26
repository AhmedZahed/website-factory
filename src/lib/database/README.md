# D1 database

The D1 binding is named `DB` in `wrangler.jsonc`. Schema changes belong in ordered SQL files under `migrations/`.

Apply migrations to the local Wrangler database with:

```sh
pnpm --filter @workspace/website-factory run db:migrate:local
```

This command uses `--local` and does not connect to a Cloudflare account or any other project's database. No database is provisioned or accessed automatically by the app.

Phase 2 adds `GET/POST /api/customers` and `PATCH/DELETE /api/customers/:id`. The customer API validates query/body values with Zod, uses prepared D1 statements, and caps JSON bodies at 16 KB. Phase 3 protects these endpoints with server-side admin/staff authorization; staff cannot delete customers.

`websites` existed in Phase 1 with tenant-owned columns. The new migration preserves that table and its data, adds the customer-owned fields, and uses a foreign key plus insert/update triggers so every website row has a valid customer, name, and slug. Customer deletion is blocked while websites reference it.

The Phase 3 migration adds `admin_accounts` and `auth_login_attempts` without rebuilding existing tables. Admin sessions use Astro's Cloudflare KV session driver with the automatically provisioned `SESSION` binding. No account is created by migration; use `pnpm --filter @workspace/website-factory run auth:create-account` to create one through a hidden password prompt. The command targets local D1 by default; its explicit `--remote` option requires an interactive confirmation.

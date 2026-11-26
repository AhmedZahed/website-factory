# Website Factory

An Arabic-first foundation for a multi-tenant website-building SaaS. It includes a public landing page, an admin UI preview, Cloudflare Workers SSR configuration, local D1/R2 bindings, D1 migrations, `GET /api/health`, and a Zod-validated customer API.

## Run locally

The Replit workspace uses pnpm for workspace packages:

```sh
pnpm --filter @workspace/website-factory run dev
```

The managed preview starts the same command and supplies its port.

## Local D1

Wrangler bindings are declared in `wrangler.jsonc`. The D1 database is local-only until explicitly provisioned in a Cloudflare account. Apply the schema to Wrangler's local database:

```sh
pnpm --filter @workspace/website-factory run db:migrate:local
```

This runs `wrangler d1 migrations apply website-factory --local`. It does not use credentials or connect to a remote Cloudflare database. The R2 binding `MEDIA_BUCKET` is configured for local development; no upload flow or bucket data is created.

## Check the app

- `pnpm --filter @workspace/website-factory run typecheck`
- `pnpm --filter @workspace/website-factory run build`
- `GET /api/health` returns `status`, `application`, and `environment`.
- Customer API: `GET` and `POST /api/customers`, `PATCH` and `DELETE /api/customers/:id`.
- D1 migrations: `0001_initial_schema.sql` and the additive `0002_customers_and_website_ownership.sql`.

## Project structure

- `src/components` — React UI for the landing page and admin preview
- `src/layouts` — shared Astro HTML shell and Arabic-first document defaults
- `src/pages` — server-rendered public, admin-preview, and API routes
- `src/lib/auth` — Phase 1 authentication boundary and future integration notes
- `src/lib/tenants` — tenant-isolation guidance for future server operations
- `src/lib/database` — Cloudflare binding types and schema documentation
- `src/lib/validation` — Zod API response schemas
- `src/styles` — reserved for shared styles; current visual theme is `src/index.css`
- `migrations` — ordered D1 SQL migrations
- `public` — static public assets
- `wrangler.jsonc` — local Cloudflare D1 and R2 binding configuration

## Deliberately out of scope

Authentication, website CRUD, templates, custom domains, payments, subscriptions, AI generation, and production deployment are not implemented. Admin UI routes remain preview-only shells. The customer API is unauthenticated as explicitly scoped for Phase 2 and must not be treated as private or production-ready access control.

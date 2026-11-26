# Initial relational schema

The D1 migration creates `users`, `tenants`, `websites`, `website_settings`, `domains`, `templates`, `orders`, and `subscriptions`.

- IDs and timestamps are text; timestamps are UTC ISO-8601 strings.
- `users.password_hash` is for a future password hash only; no login or password storage flow exists.
- `orders.amount` is an integer in the currency's minor unit (for example, halalas for SAR).
- Composite foreign keys keep orders and subscriptions attached to a website belonging to the same tenant.
- Customer, tenant, website, order, and subscription records are retained by restrictive deletion rules. Website settings and domain rows cascade only with website deletion; template removal preserves websites by clearing their template reference.
- JSON settings are validated with SQLite's `json_valid`.

The migration defines schema only. It creates no users, tenant data, or Cloudflare account resources.

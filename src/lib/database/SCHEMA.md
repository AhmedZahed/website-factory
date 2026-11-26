# Initial relational schema

The initial D1 migration creates `users`, `tenants`, `websites`, `website_settings`, `domains`, `templates`, `orders`, and `subscriptions`. The next migration adds `customers` and customer ownership fields to the existing `websites` table.

- IDs and timestamps are text; timestamps are UTC ISO-8601 strings.
- `users.password_hash` is for a future password hash only; no login or password storage flow exists.
- `orders.amount` is an integer in the currency's minor unit (for example, halalas for SAR).
- Composite foreign keys keep orders and subscriptions attached to a website belonging to the same tenant.
- Customer, tenant, website, order, and subscription records are retained by restrictive deletion rules. Website settings and domain rows cascade only with website deletion; template removal preserves websites by clearing their template reference.
- JSON settings are validated with SQLite's `json_valid`.

The initial migration defines schema only. It creates no users, tenant data, or Cloudflare account resources.

The customer migration is additive: it keeps the original `websites` columns and backfills `name`, `slug`, and `customer_id` from existing website/tenant rows. Website insert/update triggers require a real customer plus non-empty name and slug, while a foreign key and index enforce ownership and lookup.

`customers.phone` and `customers.email` are nullable for legacy tenants that had no contact details. API-created customers are validated server-side; IDs and timestamps are server-owned. Customer deletion is restricted while any website references that customer.

# Initial relational schema

The initial D1 migration creates `users`, `tenants`, `websites`, `website_settings`, `domains`, `templates`, `orders`, and `subscriptions`. Later migrations add `customers`, customer ownership fields to the existing `websites` table, and separate admin authentication tables.

- IDs and timestamps are text; timestamps are UTC ISO-8601 strings.
- Phase 3 leaves `users` and its existing role constraint untouched. Admin and staff credentials are stored in the separate `admin_accounts` table.
- `orders.amount` is an integer in the currency's minor unit (for example, halalas for SAR).
- Composite foreign keys keep orders and subscriptions attached to a website belonging to the same tenant.
- Customer, tenant, website, order, and subscription records are retained by restrictive deletion rules. Website settings and domain rows cascade only with website deletion; template removal preserves websites by clearing their template reference.
- JSON settings are validated with SQLite's `json_valid`.

The initial migration defines schema only. It creates no users, tenant data, or Cloudflare account resources.

The customer migration is additive: it keeps the original `websites` columns and backfills `name`, `slug`, and `customer_id` from existing website/tenant rows. Website insert/update triggers require a real customer plus non-empty name and slug, while a foreign key and index enforce ownership and lookup.

`customers.phone` and `customers.email` are nullable for legacy tenants that had no contact details. API-created customers are validated server-side; IDs and timestamps are server-owned. Customer deletion is restricted while any website references that customer.

The admin-auth migration adds only `admin_accounts` and `auth_login_attempts`; it creates no credentials and does not rewrite existing customer, tenant, user, or website rows. Session data is stored by Astro's Cloudflare KV session driver through the adapter-managed `SESSION` binding.

Phase 4A adds `website_pages`, `website_sections`, and `website_page_sections` in migration `0004_template_engine.sql`. Pages are localized by `ar`/`en`; sections can be reused across pages for the same website. Composite foreign keys prevent attaching a page and section from different websites. The migration only creates new tables/indexes and inserts built-in template rows with `INSERT OR IGNORE`; it does not update or delete existing rows.

Website customization uses the existing `website_settings.settings_json` column and is validated by the versioned template customization schema. The preview pages use static demo data and do not query customer, website, or authentication records.

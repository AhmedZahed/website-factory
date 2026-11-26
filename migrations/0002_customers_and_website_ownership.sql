CREATE TABLE customers (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 120),
  phone TEXT,
  email TEXT,
  business_name TEXT NOT NULL CHECK (length(trim(business_name)) BETWEEN 1 AND 160),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE UNIQUE INDEX idx_customers_email_unique
  ON customers(email COLLATE NOCASE)
  WHERE email IS NOT NULL AND trim(email) <> '';
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_name ON customers(name COLLATE NOCASE);
CREATE INDEX idx_customers_business_name ON customers(business_name COLLATE NOCASE);
CREATE INDEX idx_customers_created_at ON customers(created_at);

-- Preserve existing Phase 1 websites by mapping each website's tenant to a
-- customer record derived from the tenant's existing business name.
INSERT INTO customers (
  id, name, phone, email, business_name, status, created_at, updated_at
)
SELECT
  'legacy-tenant-' || t.id,
  t.business_name,
  NULL,
  NULL,
  t.business_name,
  CASE WHEN t.status = 'active' THEN 'active' ELSE 'inactive' END,
  t.created_at,
  t.created_at
FROM tenants AS t
WHERE EXISTS (
  SELECT 1 FROM websites AS w WHERE w.tenant_id = t.id
)
ON CONFLICT(id) DO NOTHING;

-- Keep the existing table and all Phase 1 columns intact. The guards below
-- provide NOT NULL/ownership enforcement for these additive columns without
-- a table rebuild.
ALTER TABLE websites
  ADD COLUMN customer_id TEXT REFERENCES customers(id) ON DELETE RESTRICT;
ALTER TABLE websites ADD COLUMN name TEXT;
ALTER TABLE websites ADD COLUMN slug TEXT;

UPDATE websites
SET
  customer_id = 'legacy-tenant-' || tenant_id,
  name = title,
  slug = 'legacy-' || lower(hex(id));

CREATE INDEX idx_websites_customer_id ON websites(customer_id);
CREATE UNIQUE INDEX idx_websites_slug_unique
  ON websites(slug)
  WHERE slug IS NOT NULL;

CREATE TRIGGER websites_require_customer_on_insert
BEFORE INSERT ON websites
WHEN
  NEW.customer_id IS NULL
  OR NOT EXISTS (SELECT 1 FROM customers WHERE id = NEW.customer_id)
  OR NEW.name IS NULL
  OR length(trim(NEW.name)) = 0
  OR NEW.slug IS NULL
  OR length(trim(NEW.slug)) = 0
  OR NEW.slug <> lower(NEW.slug)
  OR NEW.slug GLOB '*[^a-z0-9-]*'
  OR NEW.slug LIKE '-%'
  OR NEW.slug LIKE '%-'
BEGIN
  SELECT RAISE(ABORT, 'website requires a valid customer, name, and slug');
END;

CREATE TRIGGER websites_require_customer_on_update
BEFORE UPDATE OF customer_id, name, slug ON websites
WHEN
  NEW.customer_id IS NULL
  OR NOT EXISTS (SELECT 1 FROM customers WHERE id = NEW.customer_id)
  OR NEW.name IS NULL
  OR length(trim(NEW.name)) = 0
  OR NEW.slug IS NULL
  OR length(trim(NEW.slug)) = 0
  OR NEW.slug <> lower(NEW.slug)
  OR NEW.slug GLOB '*[^a-z0-9-]*'
  OR NEW.slug LIKE '-%'
  OR NEW.slug LIKE '%-'
BEGIN
  SELECT RAISE(ABORT, 'website requires a valid customer, name, and slug');
END;

PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  email TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (instr(email, '@') > 1),
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer'
    CHECK (role IN ('admin', 'customer')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE tenants (
  id TEXT PRIMARY KEY NOT NULL,
  owner_id TEXT NOT NULL
    REFERENCES users(id) ON DELETE RESTRICT,
  business_name TEXT NOT NULL CHECK (length(trim(business_name)) > 0),
  slug TEXT NOT NULL UNIQUE
    CHECK (
      length(slug) BETWEEN 2 AND 63
      AND slug = lower(slug)
      AND slug NOT GLOB '*[^a-z0-9-]*'
      AND slug NOT LIKE '-%'
      AND slug NOT LIKE '%-'
    ),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE templates (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  slug TEXT NOT NULL UNIQUE
    CHECK (
      length(slug) BETWEEN 2 AND 63
      AND slug = lower(slug)
      AND slug NOT GLOB '*[^a-z0-9-]*'
      AND slug NOT LIKE '-%'
      AND slug NOT LIKE '%-'
    ),
  category TEXT NOT NULL CHECK (length(trim(category)) > 0),
  preview_image TEXT,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE websites (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL
    REFERENCES tenants(id) ON DELETE RESTRICT,
  template_id TEXT
    REFERENCES templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL CHECK (length(trim(title)) > 0),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  primary_domain TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (id, tenant_id)
);

CREATE TABLE website_settings (
  id TEXT PRIMARY KEY NOT NULL,
  website_id TEXT NOT NULL UNIQUE
    REFERENCES websites(id) ON DELETE CASCADE,
  settings_json TEXT NOT NULL DEFAULT '{}'
    CHECK (json_valid(settings_json)),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE domains (
  id TEXT PRIMARY KEY NOT NULL,
  website_id TEXT NOT NULL
    REFERENCES websites(id) ON DELETE CASCADE,
  hostname TEXT NOT NULL COLLATE NOCASE UNIQUE
    CHECK (
      length(hostname) BETWEEN 3 AND 253
      AND instr(hostname, '.') > 0
      AND instr(hostname, ' ') = 0
    ),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'verified', 'failed')),
  verified_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL
    REFERENCES tenants(id) ON DELETE RESTRICT,
  website_id TEXT NOT NULL,
  package TEXT NOT NULL CHECK (length(trim(package)) > 0),
  amount INTEGER NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'SAR'
    CHECK (length(currency) = 3 AND currency = upper(currency)),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (website_id, tenant_id)
    REFERENCES websites(id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL
    REFERENCES tenants(id) ON DELETE RESTRICT,
  website_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'trialing'
    CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'expired')),
  starts_at TEXT NOT NULL,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CHECK (expires_at IS NULL OR expires_at > starts_at),
  FOREIGN KEY (website_id, tenant_id)
    REFERENCES websites(id, tenant_id) ON DELETE RESTRICT
);

CREATE INDEX idx_tenants_owner_id ON tenants(owner_id);
CREATE INDEX idx_websites_tenant_id ON websites(tenant_id);
CREATE INDEX idx_websites_template_id ON websites(template_id);
CREATE INDEX idx_websites_status ON websites(status);
CREATE INDEX idx_website_settings_website_id ON website_settings(website_id);
CREATE INDEX idx_domains_website_id ON domains(website_id);
CREATE INDEX idx_domains_status ON domains(status);
CREATE INDEX idx_orders_tenant_created ON orders(tenant_id, created_at);
CREATE INDEX idx_orders_website_id ON orders(website_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_subscriptions_tenant_id ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_website_id ON subscriptions(website_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

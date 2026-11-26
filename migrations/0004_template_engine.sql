-- Phase 4A: add reusable page/section structures without rebuilding existing tables.
CREATE TABLE website_pages (
  id TEXT PRIMARY KEY NOT NULL,
  website_id TEXT NOT NULL
    REFERENCES websites(id) ON DELETE CASCADE,
  slug TEXT NOT NULL
    CHECK (
      length(slug) BETWEEN 1 AND 120
      AND slug = lower(slug)
      AND slug NOT GLOB '*[^a-z0-9-]*'
      AND slug NOT LIKE '-%'
      AND slug NOT LIKE '%-'
    ),
  title TEXT NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 200),
  locale TEXT NOT NULL CHECK (locale IN ('ar', 'en')),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (website_id, slug, locale),
  UNIQUE (id, website_id)
);

CREATE TABLE website_sections (
  id TEXT PRIMARY KEY NOT NULL,
  website_id TEXT NOT NULL
    REFERENCES websites(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL CHECK (length(trim(section_type)) BETWEEN 1 AND 80),
  content_json TEXT NOT NULL DEFAULT '{}'
    CHECK (json_valid(content_json)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (id, website_id)
);

CREATE TABLE website_page_sections (
  website_id TEXT NOT NULL,
  page_id TEXT NOT NULL,
  section_id TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  is_visible INTEGER NOT NULL DEFAULT 1 CHECK (is_visible IN (0, 1)),
  PRIMARY KEY (page_id, section_id),
  UNIQUE (page_id, sort_order),
  FOREIGN KEY (page_id, website_id)
    REFERENCES website_pages(id, website_id) ON DELETE CASCADE,
  FOREIGN KEY (section_id, website_id)
    REFERENCES website_sections(id, website_id) ON DELETE CASCADE
);

CREATE INDEX idx_website_pages_website_locale_status
  ON website_pages(website_id, locale, status, sort_order);
CREATE INDEX idx_website_sections_website_type
  ON website_sections(website_id, section_type);
CREATE INDEX idx_website_page_sections_page_order
  ON website_page_sections(page_id, sort_order);
CREATE INDEX idx_website_page_sections_section
  ON website_page_sections(section_id);

-- Seed only new built-in rows. Existing templates are never updated or removed.
INSERT OR IGNORE INTO templates (id, name, slug, category, preview_image)
VALUES
  ('builtin-services-maintenance', 'Services & Maintenance', 'services-maintenance', 'services-maintenance', NULL),
  ('builtin-contracting-real-estate', 'Contracting & Real Estate', 'contracting-real-estate', 'contracting-real-estate', NULL),
  ('builtin-corporate-professional', 'Corporate & Professional Services', 'corporate-professional', 'corporate-professional', NULL),
  ('builtin-restaurants-cafes-juice', 'Restaurants, Cafes & Juice Shops', 'restaurants-cafes-juice', 'restaurants-cafes-juice', NULL),
  ('builtin-shops-personal-services', 'Shops & Personal Services', 'shops-personal-services', 'shops-personal-services', NULL),
  ('builtin-law-firms-legal', 'Law Firms & Legal Services', 'law-firms-legal', 'law-firms-legal', NULL);

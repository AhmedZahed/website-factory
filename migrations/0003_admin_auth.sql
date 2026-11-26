CREATE TABLE admin_accounts (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 120),
  email TEXT NOT NULL COLLATE NOCASE UNIQUE
    CHECK (length(trim(email)) BETWEEN 3 AND 254 AND instr(email, '@') > 1),
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff')),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  last_login_at TEXT
);

CREATE INDEX idx_admin_accounts_role_active
  ON admin_accounts(role, is_active);

CREATE TABLE auth_login_attempts (
  ip_key TEXT PRIMARY KEY NOT NULL,
  attempts INTEGER NOT NULL CHECK (attempts > 0),
  window_started_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_auth_login_attempts_window
  ON auth_login_attempts(window_started_at);

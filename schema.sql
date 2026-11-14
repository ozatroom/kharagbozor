CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_tj TEXT,
  description TEXT,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  price10 REAL,
  price50 REAL,
  image_key TEXT NOT NULL,
  seller TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_products_status_created ON products(status, created_at DESC);

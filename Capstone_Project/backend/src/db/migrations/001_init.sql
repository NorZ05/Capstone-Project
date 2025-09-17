-- Products table (minimal)
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  category TEXT
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  qty_on_hand INTEGER DEFAULT 0,
  location TEXT,
  last_updated TIMESTAMP DEFAULT now()
);

-- ensure one inventory row per product for simple upserts
CREATE UNIQUE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);

-- Performance / sales table (simple)
CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  qty INTEGER,
  total NUMERIC(12,2),
  created_at TIMESTAMP DEFAULT now()
);

-- Analytics events (raw telemetry)
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  source TEXT,
  metric TEXT,
  value NUMERIC,
  payload JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Anomalies detected
CREATE TABLE IF NOT EXISTS anomalies (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES analytics_events(id),
  metric TEXT,
  score NUMERIC,
  details JSONB,
  detected_at TIMESTAMP DEFAULT now(),
  resolved_at TIMESTAMP
);

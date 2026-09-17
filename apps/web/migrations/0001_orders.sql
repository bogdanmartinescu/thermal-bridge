-- ThermalBridge orders schema
-- Apply: wrangler d1 migrations apply thermalbridge-orders --remote

CREATE TABLE IF NOT EXISTS orders (
  id            TEXT PRIMARY KEY,              -- crypto.randomUUID()
  ref           TEXT NOT NULL UNIQUE,          -- TB-YYYY-NNNN human reference
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  status        TEXT NOT NULL DEFAULT 'noua',  -- noua | confirmata | expediata | livrata | anulata
  -- Customer
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  email         TEXT NOT NULL,
  judet         TEXT NOT NULL,
  localitate    TEXT NOT NULL,
  adresa        TEXT NOT NULL,
  cod_postal    TEXT NOT NULL,
  notes         TEXT,
  -- Totals
  total_bani    INTEGER NOT NULL               -- sum of (qty * unit_price_bani) for all items
);

CREATE TABLE IF NOT EXISTS order_items (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id        TEXT NOT NULL REFERENCES orders(id),
  printer_slug    TEXT NOT NULL,
  qty             INTEGER NOT NULL CHECK(qty > 0),
  unit_price_bani INTEGER NOT NULL CHECK(unit_price_bani >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_slug
  ON order_items(printer_slug);

CREATE INDEX IF NOT EXISTS idx_orders_status
  ON orders(status);

-- Sequence counter for TB-YYYY-NNNN references, keyed by year
CREATE TABLE IF NOT EXISTS order_seq (
  year   INTEGER PRIMARY KEY,
  seq    INTEGER NOT NULL DEFAULT 0
);

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  site_type VARCHAR(50) NOT NULL CHECK (site_type IN ('brownfield', 'greenfield', 'commercial', 'residential', 'mixed_use')),
  acres DECIMAL(10,2) NOT NULL,
  price INTEGER NOT NULL,
  region VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  planning_status VARCHAR(50) NOT NULL CHECK (planning_status IN ('outline_permission', 'full_permission', 'no_permission', 'pending')),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_properties_site_type ON properties(site_type);
CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_acres ON properties(acres);

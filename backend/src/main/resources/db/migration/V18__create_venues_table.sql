-- Create pg_trgm extension for similarity and ILIKE performance
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Venues catalog to enable reuse and verification
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    times_used INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_venue_name_city_state_country UNIQUE (name, city, state, country),
    CONSTRAINT chk_venue_times_used_non_negative CHECK (times_used >= 0)
);

-- Keep updated_at in sync
CREATE TRIGGER trg_venues_updated_at
    BEFORE UPDATE ON venues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for search and ordering
CREATE INDEX IF NOT EXISTS idx_venues_name_trgm ON venues USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_venues_times_used ON venues (times_used DESC);

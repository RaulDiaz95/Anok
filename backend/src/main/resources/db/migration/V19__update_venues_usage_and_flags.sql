-- Ensure pg_trgm is available for similarity-based ranking
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add new tracking and admin flags
ALTER TABLE venues
    ADD COLUMN IF NOT EXISTS usage_count INT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS created_by_admin BOOLEAN NOT NULL DEFAULT FALSE,
    ALTER COLUMN verified SET DEFAULT FALSE;

-- Backfill existing rows with sane defaults
UPDATE venues SET usage_count = COALESCE(usage_count, times_used, 0);
UPDATE venues SET verified = COALESCE(verified, FALSE);
UPDATE venues SET created_by_admin = COALESCE(created_by_admin, FALSE);

-- Indexes to support ranking
CREATE INDEX IF NOT EXISTS idx_venues_usage_count ON venues (usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_venues_name_trgm_v2 ON venues USING GIN (name gin_trgm_ops);

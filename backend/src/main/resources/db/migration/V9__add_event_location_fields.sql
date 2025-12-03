-- Add structured location fields for events
ALTER TABLE events
    ADD COLUMN IF NOT EXISTS venue_zip_code VARCHAR(50) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS venue_state VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS venue_country VARCHAR(255) NOT NULL DEFAULT '';

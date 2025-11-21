-- Add structured event scheduling and content fields
ALTER TABLE events
    ADD COLUMN IF NOT EXISTS event_date DATE DEFAULT CURRENT_DATE NOT NULL,
    ADD COLUMN IF NOT EXISTS flyer_url TEXT DEFAULT '' NOT NULL,
    ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT TRUE NOT NULL,
    ADD COLUMN IF NOT EXISTS start_time TIME DEFAULT '00:00' NOT NULL,
    ADD COLUMN IF NOT EXISTS event_length_hours INT DEFAULT 0 NOT NULL,
    ADD COLUMN IF NOT EXISTS end_time TIME,
    ADD COLUMN IF NOT EXISTS about TEXT DEFAULT '' NOT NULL,
    ADD COLUMN IF NOT EXISTS all_ages BOOLEAN DEFAULT TRUE NOT NULL,
    ADD COLUMN IF NOT EXISTS venue_name VARCHAR(255) DEFAULT '' NOT NULL,
    ADD COLUMN IF NOT EXISTS venue_address TEXT DEFAULT '' NOT NULL,
    ADD COLUMN IF NOT EXISTS capacity INT DEFAULT 0 NOT NULL CHECK (capacity >= 0);

-- Performers table for structured performer data
CREATE TABLE IF NOT EXISTS event_performers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    performer_name VARCHAR(255) NOT NULL,
    genre1 VARCHAR(100),
    genre2 VARCHAR(100),
    performer_link TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_event_performers_event_id ON event_performers(event_id);

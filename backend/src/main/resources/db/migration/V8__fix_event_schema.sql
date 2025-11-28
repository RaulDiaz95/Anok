-- Align events table with Event entity (nullable flyer, ensure columns exist)
ALTER TABLE events
    ADD COLUMN IF NOT EXISTS event_date DATE NOT NULL DEFAULT CURRENT_DATE,
    ADD COLUMN IF NOT EXISTS flyer_url TEXT,
    ADD COLUMN IF NOT EXISTS is_live BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS start_time TIME NOT NULL DEFAULT '00:00',
    ADD COLUMN IF NOT EXISTS event_length_hours INT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS end_time TIME,
    ADD COLUMN IF NOT EXISTS about TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS all_ages BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS alcohol BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS venue_name VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS venue_address TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS capacity INT NOT NULL DEFAULT 0 CHECK (capacity >= 0),
    ALTER COLUMN flyer_url DROP NOT NULL;

-- Ensure performer_link remains nullable
ALTER TABLE event_performers
    ALTER COLUMN performer_link DROP NOT NULL;

-- Ensure genre constraints match entity
ALTER TABLE event_genres
    ALTER COLUMN label TYPE VARCHAR(25),
    ALTER COLUMN order_index SET NOT NULL;

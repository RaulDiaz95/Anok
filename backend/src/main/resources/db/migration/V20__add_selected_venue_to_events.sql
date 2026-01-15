ALTER TABLE events
    ADD COLUMN IF NOT EXISTS selected_venue_id UUID NULL REFERENCES venues(id);

CREATE INDEX IF NOT EXISTS idx_events_selected_venue ON events(selected_venue_id);

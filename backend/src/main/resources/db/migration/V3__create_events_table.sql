-- Basic events table for MVP submissions
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_datetime TIMESTAMP NOT NULL,

    venue_name VARCHAR(255) NOT NULL,
    venue_address TEXT NOT NULL,
    capacity INT DEFAULT 0 NOT NULL CHECK (capacity >= 0),
    age_restriction VARCHAR(50) DEFAULT 'ALL' NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_events_event_datetime ON events(event_datetime DESC);
CREATE INDEX idx_events_owner_id ON events(owner_id);

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE event_genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_event_genres_event_id ON event_genres(event_id);
CREATE INDEX idx_event_genres_order ON event_genres(event_id, order_index);

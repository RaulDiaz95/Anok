-- Track likes, dislikes, and reports per event
CREATE TABLE IF NOT EXISTS event_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    reaction_type VARCHAR(16) NOT NULL CHECK (reaction_type IN ('LIKE', 'DISLIKE', 'REPORT')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_reaction_user_event_type UNIQUE (user_id, event_id, reaction_type)
);

CREATE INDEX IF NOT EXISTS idx_event_reactions_event_type ON event_reactions(event_id, reaction_type);

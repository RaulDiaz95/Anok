-- Ensure uniqueness aligns with service toggle logic (one reaction per type per user/event)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'uk_event_reaction_user_event'
    ) THEN
        ALTER TABLE event_reactions DROP CONSTRAINT uk_event_reaction_user_event;
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_reaction_user_event_type'
    ) THEN
        ALTER TABLE event_reactions
            ADD CONSTRAINT uk_reaction_user_event_type UNIQUE (user_id, event_id, reaction_type);
    END IF;
END$$;

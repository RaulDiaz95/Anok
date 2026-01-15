-- Align reaction uniqueness with toggle logic: only one reaction per user per event
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_reaction_user_event_type'
    ) THEN
        ALTER TABLE event_reactions DROP CONSTRAINT uk_reaction_user_event_type;
    END IF;
END$$;

-- Remove any older constraint name used previously
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_event_reaction_user_event'
    ) THEN
        ALTER TABLE event_reactions DROP CONSTRAINT uk_event_reaction_user_event;
    END IF;
END$$;

ALTER TABLE event_reactions
    ADD CONSTRAINT uk_reaction_user_event UNIQUE (user_id, event_id);

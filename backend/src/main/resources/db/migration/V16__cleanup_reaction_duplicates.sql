-- Clean up legacy duplicate reactions per user/event and enforce single reaction rule

-- Remove extras, keeping priority: REPORT > DISLIKE > LIKE
WITH ranked AS (
    SELECT
        id,
        user_id,
        event_id,
        reaction_type,
        ROW_NUMBER() OVER (
            PARTITION BY user_id, event_id
            ORDER BY
                CASE
                    WHEN reaction_type = 'REPORT' THEN 1
                    WHEN reaction_type = 'DISLIKE' THEN 2
                    WHEN reaction_type = 'LIKE' THEN 3
                    ELSE 4
                END
        ) AS rn
    FROM event_reactions
)
DELETE FROM event_reactions
WHERE id IN (
    SELECT id FROM ranked WHERE rn > 1
);

-- Ensure the correct uniqueness constraint exists (one reaction per user/event)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_reaction_user_event_type'
    ) THEN
        ALTER TABLE event_reactions DROP CONSTRAINT uk_reaction_user_event_type;
    END IF;
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_event_reaction_user_event'
    ) THEN
        ALTER TABLE event_reactions DROP CONSTRAINT uk_event_reaction_user_event;
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_reaction_user_event'
    ) THEN
        ALTER TABLE event_reactions
            ADD CONSTRAINT uk_reaction_user_event UNIQUE (user_id, event_id);
    END IF;
END$$;

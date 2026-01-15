ALTER TABLE events ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'PENDING_REVIEW';

-- Existing live events should be marked approved/live
UPDATE events SET status = 'APPROVED' WHERE is_live = true;
-- Non-live events fallback to pending review
UPDATE events SET status = 'PENDING_REVIEW' WHERE status IS NULL;

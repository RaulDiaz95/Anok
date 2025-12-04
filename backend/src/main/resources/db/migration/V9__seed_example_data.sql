-- Seed example data for local development
-- This creates a demo user and event for testing purposes

-- Create example user
-- Email: demo@anok.com
-- Password: password123
INSERT INTO users (id, email, email_normalized, password_hash, full_name, is_active, validated_user, trusted_validator, failed_login_attempts)
VALUES (
    'a0000000-0000-0000-0000-000000000001'::UUID,
    'demo@anok.com',
    'demo@anok.com',
    '$2a$12$3BefKccrtsukQ4OuEZUOB.IcKrSQjV1eLECWrwHV93usm2DELrleW', -- BCrypt hash for "123qwe!@#QWE"
    'Demo User',
    TRUE,
    FALSE,
    FALSE,
    0
);

-- Assign ROLE_USER to demo user
INSERT INTO user_roles (user_id, role_id)
SELECT
    'a0000000-0000-0000-0000-000000000001'::UUID,
    id
FROM roles
WHERE name = 'ROLE_USER';

-- Create example event
INSERT INTO events (
    id,
    owner_id,
    title,
    description,
    event_datetime,
    event_date,
    start_time,
    end_time,
    event_length_hours,
    flyer_url,
    is_live,
    about,
    all_ages,
    alcohol,
    venue_name,
    venue_address,
    capacity
) VALUES (
    'b0000000-0000-0000-0000-000000000001'::UUID,
    'a0000000-0000-0000-0000-000000000001'::UUID,
    'Summer Music Festival 2025',
    'Join us for an amazing night of live music!',
    '2030-07-15 20:00:00'::TIMESTAMP,
    '2030-07-15'::DATE,
    '20:00'::TIME,
    '23:00'::TIME,
    3,
    'https://d1kkytjp746b3d.cloudfront.net/uploads/98a67b3d-6f63-4d47-ba0a-683f92b08bef.jpg',
    TRUE,
    'Experience the best local talent in an intimate venue. This event features multiple genres including rock, electronic, and indie music. Food and drinks will be available for purchase.',
    FALSE, -- Not all ages
    TRUE,  -- Serves alcohol
    'The Underground',
    '123 Main Street, Downtown, City, State 12345',
    200
);

-- Add performers to the example event
INSERT INTO event_performers (event_id, performer_name, genre1, genre2, performer_link)
VALUES
    ('b0000000-0000-0000-0000-000000000001'::UUID, 'The Electric Waves', 'Electronic', 'Dance', 'https://example.com/electricwaves'),
    ('b0000000-0000-0000-0000-000000000001'::UUID, 'Indie Soul Collective', 'Indie', 'Soul', 'https://example.com/indiesoul'),
    ('b0000000-0000-0000-0000-000000000001'::UUID, 'Rock Revolution', 'Rock', 'Alternative', 'https://example.com/rockrevolution');

-- Add genres to the example event
INSERT INTO event_genres (event_id, label, order_index)
VALUES
    ('b0000000-0000-0000-0000-000000000001'::UUID, 'Electronic', 0),
    ('b0000000-0000-0000-0000-000000000001'::UUID, 'Rock', 1),
    ('b0000000-0000-0000-0000-000000000001'::UUID, 'Indie', 2);

-- Comments
COMMENT ON TABLE users IS 'Example user credentials: demo@anok.com / password123';

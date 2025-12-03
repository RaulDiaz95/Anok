-- Ensure pgcrypto is available to generate bcrypt hashes
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    v_user_id  UUID   := 'adb14aaf-1891-46c3-b39c-96a192d83cf9';
    v_role_id  BIGINT;
BEGIN
    -- Upsert seed user with new email/password
    INSERT INTO users (
        id,
        email,
        email_normalized,
        password_hash,
        full_name,
        is_active,
        validated_user,
        trusted_validator,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        'rulodipu@hotmail.com',
        'rulodipu@hotmail.com.com',
        crypt('oefkr!*ecdhq!xQa3rH', gen_salt('bf', 12)),
        'raul',
        TRUE,
        TRUE,
        FALSE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
      SET email            = EXCLUDED.email,
          email_normalized = EXCLUDED.email_normalized,
          password_hash    = EXCLUDED.password_hash,
          full_name        = EXCLUDED.full_name,
          is_active        = EXCLUDED.is_active,
          validated_user   = EXCLUDED.validated_user,
          trusted_validator= EXCLUDED.trusted_validator,
          updated_at       = NOW();

    -- Ensure ROLE_USER is linked
    SELECT id INTO v_role_id FROM roles WHERE name = 'ROLE_USER' LIMIT 1;
    IF v_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id)
        SELECT v_user_id, v_role_id
        WHERE NOT EXISTS (
            SELECT 1 FROM user_roles WHERE user_id = v_user_id AND role_id = v_role_id
        );
    END IF;
END $$;

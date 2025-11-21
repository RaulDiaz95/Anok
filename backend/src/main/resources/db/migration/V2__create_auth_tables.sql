-- Authentication and Authorization Schema
-- Phase 1: Minimal MVP with security essentials

-- Users table with UUID primary key
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Authentication fields
    email VARCHAR(255) NOT NULL,
    email_normalized VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(60) NOT NULL,  -- BCrypt hash length

    -- Profile fields
    full_name VARCHAR(255),

    -- Account status
    is_active BOOLEAN DEFAULT TRUE NOT NULL,

    -- Security: Account lockout protection
    failed_login_attempts INT DEFAULT 0 NOT NULL,
    locked_until TIMESTAMP,

    -- Future-proof fields (Phase 2+)
    validated_user BOOLEAN DEFAULT FALSE NOT NULL,
    trusted_validator BOOLEAN DEFAULT FALSE NOT NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_failed_attempts CHECK (failed_login_attempts >= 0)
);

-- Roles table for RBAC
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT chk_role_name_format CHECK (name ~ '^ROLE_[A-Z_]+$')
);

-- Many-to-many relationship between users and roles
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    PRIMARY KEY (user_id, role_id)
);

-- Performance indexes
CREATE UNIQUE INDEX idx_users_email_normalized ON users(email_normalized) WHERE is_active = TRUE;
CREATE INDEX idx_users_is_active ON users(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_users_locked_until ON users(locked_until) WHERE locked_until IS NOT NULL;
CREATE INDEX idx_users_created_at ON users(created_at DESC);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed initial roles
INSERT INTO roles (name, description) VALUES
    ('ROLE_USER', 'Standard user with basic permissions'),
    ('ROLE_SUPPORT', 'Support team member (future use)'),
    ('ROLE_ADMIN', 'System administrator (future use)');

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts with authentication and profile information';
COMMENT ON COLUMN users.email_normalized IS 'Lowercased and trimmed email for case-insensitive lookups';
COMMENT ON COLUMN users.failed_login_attempts IS 'Counter for brute force protection, resets on successful login';
COMMENT ON COLUMN users.locked_until IS 'Account locked until this timestamp (NULL = not locked)';
COMMENT ON COLUMN users.validated_user IS 'Future: KYC or trusted source validation';
COMMENT ON COLUMN users.trusted_validator IS 'Future: Official event validator status';

COMMENT ON TABLE roles IS 'Available roles in the system for RBAC';
COMMENT ON TABLE user_roles IS 'Assignment of roles to users (many-to-many)';

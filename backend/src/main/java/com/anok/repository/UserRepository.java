package com.anok.repository;

import com.anok.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for User entity operations.
 * Provides database access methods for user authentication and management.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Find a user by email (case-insensitive).
     * Uses the email_normalized column for efficient lookup.
     *
     * @param email the email address to search for
     * @return Optional containing the user if found
     */
    @Query("SELECT u FROM User u WHERE u.emailNormalized = LOWER(:email)")
    Optional<User> findByEmail(@Param("email") String email);

    /**
     * Find a user by normalized email.
     * Direct lookup on the indexed email_normalized column.
     *
     * @param emailNormalized the normalized (lowercase, trimmed) email
     * @return Optional containing the user if found
     */
    Optional<User> findByEmailNormalized(String emailNormalized);

    /**
     * Check if a user exists with the given email (case-insensitive).
     *
     * @param email the email address to check
     * @return true if a user with this email exists
     */
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.emailNormalized = LOWER(:email)")
    boolean existsByEmail(@Param("email") String email);

    /**
     * Find a user by email with roles eagerly fetched.
     * Useful for authentication to avoid N+1 queries.
     *
     * @param emailNormalized the normalized email address
     * @return Optional containing the user with roles if found
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.emailNormalized = :emailNormalized")
    Optional<User> findByEmailNormalizedWithRoles(@Param("emailNormalized") String emailNormalized);
}

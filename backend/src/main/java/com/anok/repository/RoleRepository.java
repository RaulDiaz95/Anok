package com.anok.repository;

import com.anok.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Role entity operations.
 * Provides database access methods for role management.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Find a role by its name.
     *
     * @param name the role name (e.g., "ROLE_USER")
     * @return Optional containing the role if found
     */
    Optional<Role> findByName(String name);

    /**
     * Check if a role exists with the given name.
     *
     * @param name the role name to check
     * @return true if a role with this name exists
     */
    boolean existsByName(String name);
}

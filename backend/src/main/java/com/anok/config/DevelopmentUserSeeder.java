package com.anok.config;

import com.anok.model.Role;
import com.anok.model.User;
import com.anok.repository.RoleRepository;
import com.anok.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Seeds development/demo users for local testing.
 * Only runs in non-production environments.
 */
@Component
@Profile("!prod")
@Order(2) // Run after AdminSeeder
public class DevelopmentUserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DevelopmentUserSeeder(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));

        // Seed demo user
        seedUser(
                UUID.fromString("a0000000-0000-0000-0000-000000000001"),
                "demo@anok.com",
                "123qwe!@#QWE",
                "Demo User",
                userRole,
                false
        );

        // Seed raul user (validated)
        seedUser(
                UUID.fromString("adb14aaf-1891-46c3-b39c-96a192d83cf9"),
                "rulodipu@hotmail.com",
                "oefkr!*ecdhq!xQa3rH",
                "raul",
                userRole,
                true
        );
    }

    private void seedUser(UUID id, String email, String password, String fullName, Role role, boolean validated) {
        if (userRepository.findByEmailNormalized(email).isEmpty()) {
            User user = new User();
            user.setId(id);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(password));
            user.setFullName(fullName);
            user.addRole(role);
            user.setIsActive(true);
            user.setValidatedUser(validated);
            userRepository.save(user);
        }
    }
}

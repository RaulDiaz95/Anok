package com.anok.config;

import com.anok.model.Role;
import com.anok.model.User;
import com.anok.repository.RoleRepository;
import com.anok.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(1) // Run first to ensure ROLE_SUPERUSER exists
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Role superuserRole = roleRepository.findByName("ROLE_SUPERUSER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_SUPERUSER", "Superuser with moderation access")));

        userRepository.findByEmailNormalized("admin@anok.com").orElseGet(() -> {
            User admin = new User();
            admin.setEmail("admin@anok.com");
            admin.setPasswordHash(passwordEncoder.encode("oefkr!*ecdhq!xQa3rH."));
            admin.addRole(superuserRole);
            admin.setIsActive(true);
            return userRepository.save(admin);
        });
    }
}

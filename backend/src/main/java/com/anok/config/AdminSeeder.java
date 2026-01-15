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
@Order(1) // Run first to ensure ROLE_ADMIN exists
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
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN", "Administrator with moderation access")));

        User admin = userRepository.findByEmailNormalized("admin@anok.com").orElseGet(() -> {
            User newAdmin = new User();
            newAdmin.setEmail("admin@anok.com");
            newAdmin.setPasswordHash(passwordEncoder.encode("oefkr!*ecdhq!xQa3rH."));
            newAdmin.setIsActive(true);
            return userRepository.save(newAdmin);
        });
        if (!admin.getRoles().contains(adminRole)) {
            admin.addRole(adminRole);
            userRepository.save(admin);
        }
    }
}

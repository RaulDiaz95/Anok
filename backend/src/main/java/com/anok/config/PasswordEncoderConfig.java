package com.anok.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuration for password encoding.
 * Uses BCrypt with configurable strength for secure password hashing.
 */
@Configuration
public class PasswordEncoderConfig {

    @Value("${security.password.bcrypt-strength:12}")
    private int bcryptStrength;

    /**
     * Creates a BCrypt password encoder bean.
     * Default strength is 12 (recommended for production).
     *
     * @return PasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(bcryptStrength);
    }
}

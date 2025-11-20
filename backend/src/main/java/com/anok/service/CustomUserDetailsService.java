package com.anok.service;

import com.anok.model.User;
import com.anok.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.stream.Collectors;

/**
 * Custom UserDetailsService implementation that loads user details from the database.
 * Implements Spring Security's UserDetailsService interface.
 */
@Service
@Transactional(readOnly = true)
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Load user by username (email in our case).
     * Called by Spring Security during authentication.
     *
     * @param email user's email address
     * @return UserDetails object
     * @throws UsernameNotFoundException if user not found
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Find user by email (normalized for case-insensitive lookup)
        User user = userRepository.findByEmailNormalizedWithRoles(email.toLowerCase())
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + email));

        // Check if account is locked
        if (user.isLocked()) {
            throw new RuntimeException("Account is temporarily locked. Please try again later.");
        }

        // Build Spring Security UserDetails
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .disabled(!user.getIsActive())
                .accountExpired(false)
                .accountLocked(user.getLockedUntil() != null &&
                              user.getLockedUntil().isAfter(LocalDateTime.now()))
                .credentialsExpired(false)
                .authorities(buildAuthorities(user))
                .build();
    }

    /**
     * Build granted authorities from user roles.
     *
     * @param user user entity
     * @return collection of granted authorities
     */
    private Collection<? extends GrantedAuthority> buildAuthorities(User user) {
        return user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());
    }
}

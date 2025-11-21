package com.anok.service;

import com.anok.dto.LoginRequest;
import com.anok.dto.RegisterRequest;
import com.anok.dto.UserDTO;
import com.anok.exception.ResourceNotFoundException;
import com.anok.exception.ValidationException;
import com.anok.model.Role;
import com.anok.model.User;
import com.anok.repository.RoleRepository;
import com.anok.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for handling authentication operations.
 */
@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Register a new user.
     *
     * @param request registration request
     * @return created user DTO
     */
    @Transactional
    public UserDTO register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setIsActive(true);

        // Assign default ROLE_USER
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new ResourceNotFoundException("Default role not found"));
        user.addRole(userRole);

        // Save user
        User savedUser = userRepository.save(user);

        return UserDTO.fromUser(savedUser);
    }

    /**
     * Authenticate user and generate JWT tokens.
     *
     * @param request login request
     * @return JWT access token
     */
    public String login(LoginRequest request) {
        try {
            // Authenticate using Spring Security
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            // Get user details
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Generate access token
            String accessToken = jwtService.generateAccessToken(userDetails);

            // Reset failed login attempts on successful login
            userRepository.findByEmailNormalized(request.getEmail().toLowerCase())
                    .ifPresent(user -> {
                        user.resetFailedAttempts();
                        userRepository.save(user);
                    });

            return accessToken;

        } catch (BadCredentialsException e) {
            // Handle failed login attempt
            userRepository.findByEmailNormalized(request.getEmail().toLowerCase())
                    .ifPresent(user -> {
                        user.incrementFailedAttempts();
                        // Lock account after 5 failed attempts
                        if (user.getFailedLoginAttempts() >= 5) {
                            user.lockAccount(30); // Lock for 30 minutes
                        }
                        userRepository.save(user);
                    });

            throw new BadCredentialsException("Invalid email or password");
        }
    }

    /**
     * Get current user information.
     *
     * @param email user's email
     * @return user DTO
     */
    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmailNormalized(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return UserDTO.fromUser(user);
    }
}

package com.anok.service;

import com.anok.dto.GoogleAuthResult;
import com.anok.dto.LoginRequest;
import com.anok.dto.RegisterRequest;
import com.anok.dto.UserDTO;
import com.anok.exception.ResourceNotFoundException;
import com.anok.exception.ValidationException;
import com.anok.model.Role;
import com.anok.model.User;
import com.anok.repository.RoleRepository;
import com.anok.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.UUID;

/**
 * Service for handling authentication operations.
 */
@Service
public class AuthenticationService {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);

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

    @Autowired
    private UserDetailsService userDetailsService;

    @Value("${google.client-id:}")
    private String googleClientId;

    private final NetHttpTransport googleTransport = new NetHttpTransport();
    private final GsonFactory gsonFactory = GsonFactory.getDefaultInstance();

    @jakarta.annotation.PostConstruct
    void logGoogleClientId() {
        if (googleClientId == null || googleClientId.isBlank()) {
            log.warn("Google client ID is not configured. Google login will fail until GOOGLE_CLIENT_ID is set.");
        } else {
            log.info("Google client ID configured");
        }
    }

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

    /**
     * Authenticate or register a user via Google ID token.
     *
     * @param idTokenString Google ID token from Google Identity Services
     * @return GoogleAuthResult containing the user and generated JWT
     */
    @Transactional
    public GoogleAuthResult loginWithGoogle(String idTokenString) {
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new ValidationException("Google client ID is not configured");
        }

        GoogleIdToken idToken;
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(googleTransport, gsonFactory)
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            idToken = verifier.verify(idTokenString);
        } catch (GeneralSecurityException | java.io.IOException e) {
            throw new ValidationException("Could not verify Google ID token");
        }

        if (idToken == null || idToken.getPayload() == null) {
            throw new ValidationException("Invalid Google ID token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        Boolean emailVerified = payload.getEmailVerified();
        String fullName = (String) payload.get("name");

        if (email == null || email.isBlank()) {
            throw new ValidationException("Google account is missing an email address");
        }
        if (emailVerified == null || !emailVerified) {
            throw new ValidationException("Google email is not verified");
        }

        User user = userRepository.findByEmailNormalizedWithRoles(email.toLowerCase()).orElse(null);

        if (user == null) {
            // Create new user with default ROLE_USER
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new ResourceNotFoundException("Default role not found"));

            user = new User();
            user.setEmail(email);
            user.setFullName(fullName != null && !fullName.isBlank() ? fullName : email);
            user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setIsActive(true);
            user.setValidatedUser(true);
            user.setTrustedValidator(false);
            user.addRole(userRole);
        } else {
            // Update basic profile data if missing
            if (user.getFullName() == null || user.getFullName().isBlank()) {
                user.setFullName(fullName != null && !fullName.isBlank() ? fullName : email);
            }
            user.resetFailedAttempts();
            user.setIsActive(true);
        }

        User savedUser = userRepository.save(user);

        // Generate JWT and return result
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String accessToken = jwtService.generateAccessToken(userDetails);

        return new GoogleAuthResult(UserDTO.fromUser(savedUser), accessToken);
    }
}

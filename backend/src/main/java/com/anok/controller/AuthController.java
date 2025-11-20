package com.anok.controller;

import com.anok.dto.AuthResponse;
import com.anok.dto.LoginRequest;
import com.anok.dto.RegisterRequest;
import com.anok.dto.UserDTO;
import com.anok.service.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for authentication endpoints.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;

    /**
     * Register a new user.
     *
     * @param request registration request
     * @return auth response with user data
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserDTO user = authenticationService.register(request);
        AuthResponse response = new AuthResponse("User registered successfully", user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Login user and set JWT cookie.
     *
     * @param request login request
     * @param response HTTP response for setting cookies
     * @return auth response with user data
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        // Authenticate and generate token
        String accessToken = authenticationService.login(request);

        // Get user data
        UserDTO user = authenticationService.getCurrentUser(request.getEmail());

        // Set JWT in HttpOnly cookie
        Cookie cookie = new Cookie("access_token", accessToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set to true in production with HTTPS
        cookie.setPath("/api");
        cookie.setMaxAge(3600); // 1 hour
        // cookie.setSameSite("Strict"); // Requires Servlet 6.0+
        response.addCookie(cookie);

        AuthResponse authResponse = new AuthResponse("Login successful", user);
        return ResponseEntity.ok(authResponse);
    }

    /**
     * Logout user by clearing JWT cookie.
     *
     * @param response HTTP response for clearing cookies
     * @return success message
     */
    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(HttpServletResponse response) {
        // Clear access token cookie
        Cookie cookie = new Cookie("access_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/api");
        cookie.setMaxAge(0); // Delete cookie
        response.addCookie(cookie);

        AuthResponse authResponse = new AuthResponse("Logout successful", null);
        return ResponseEntity.ok(authResponse);
    }

    /**
     * Get current authenticated user.
     *
     * @return user data
     */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        UserDTO user = authenticationService.getCurrentUser(email);
        return ResponseEntity.ok(user);
    }
}

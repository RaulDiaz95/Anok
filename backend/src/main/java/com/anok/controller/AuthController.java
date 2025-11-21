package com.anok.controller;

import com.anok.dto.AuthResponse;
import com.anok.dto.LoginRequest;
import com.anok.dto.RegisterRequest;
import com.anok.dto.UserDTO;
import com.anok.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseCookie;

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
            HttpServletRequest servletRequest,
            HttpServletResponse response
    ) {
        // Authenticate and generate token
        String accessToken = authenticationService.login(request);

        // Get user data
        UserDTO user = authenticationService.getCurrentUser(request.getEmail());

        boolean secure = isSecureRequest(servletRequest);
        ResponseCookie.ResponseCookieBuilder cookieBuilder = ResponseCookie.from("access_token", accessToken)
                .httpOnly(true)
                .secure(secure)
                .path("/api")
                .maxAge(3600);

        // Only set SameSite=None for secure connections (requires HTTPS)
        // For localhost, omit SameSite to allow browser default (Lax)
        if (secure) {
            cookieBuilder.sameSite("None");
        }

        response.addHeader("Set-Cookie", cookieBuilder.build().toString());

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
    public ResponseEntity<AuthResponse> logout(HttpServletRequest servletRequest, HttpServletResponse response) {
        boolean secure = isSecureRequest(servletRequest);
        ResponseCookie.ResponseCookieBuilder cookieBuilder = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(secure)
                .path("/api")
                .maxAge(0);

        // Only set SameSite=None for secure connections (requires HTTPS)
        // For localhost, omit SameSite to allow browser default (Lax)
        if (secure) {
            cookieBuilder.sameSite("None");
        }

        response.addHeader("Set-Cookie", cookieBuilder.build().toString());

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

    private boolean isSecureRequest(HttpServletRequest request) {
        String host = request.getServerName();
        return request.isSecure()
                || host == null
                || (!host.equals("localhost") && !host.equals("127.0.0.1"));
    }
}

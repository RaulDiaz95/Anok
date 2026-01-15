package com.anok.dto;

/**
 * DTO for authentication response.
 */
public class AuthResponse {

    private String message;
    private UserDTO user;
    private String token;

    // Constructors
    public AuthResponse() {
    }

    public AuthResponse(String message, UserDTO user) {
        this.message = message;
        this.user = user;
    }

    public AuthResponse(String message, UserDTO user, String token) {
        this.message = message;
        this.user = user;
        this.token = token;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

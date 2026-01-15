package com.anok.dto;

/**
 * Result container for Google authentication containing the authenticated user and generated token.
 */
public class GoogleAuthResult {
    private UserDTO user;
    private String token;

    public GoogleAuthResult(UserDTO user, String token) {
        this.user = user;
        this.token = token;
    }

    public UserDTO getUser() {
        return user;
    }

    public String getToken() {
        return token;
    }
}

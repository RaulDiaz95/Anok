package com.anok.dto;

import com.anok.model.User;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * DTO for user information (without sensitive data).
 */
public class UserDTO {

    private UUID id;
    private String email;
    private String fullName;
    private Boolean isActive;
    private Boolean validatedUser;
    private Boolean trustedValidator;
    private Set<String> roles;
    private LocalDateTime createdAt;

    // Constructors
    public UserDTO() {
    }

    /**
     * Create UserDTO from User entity.
     *
     * @param user User entity
     * @return UserDTO
     */
    public static UserDTO fromUser(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setIsActive(user.getIsActive());
        dto.setValidatedUser(user.getValidatedUser());
        dto.setTrustedValidator(user.getTrustedValidator());
        dto.setRoles(user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet()));
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getValidatedUser() {
        return validatedUser;
    }

    public void setValidatedUser(Boolean validatedUser) {
        this.validatedUser = validatedUser;
    }

    public Boolean getTrustedValidator() {
        return trustedValidator;
    }

    public void setTrustedValidator(Boolean trustedValidator) {
        this.trustedValidator = trustedValidator;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

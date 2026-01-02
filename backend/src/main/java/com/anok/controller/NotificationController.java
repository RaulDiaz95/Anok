package com.anok.controller;

import com.anok.dto.NotificationResponse;
import com.anok.exception.ResourceNotFoundException;
import com.anok.model.NotificationType;
import com.anok.service.NotificationService;
import com.anok.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> listNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "false") boolean unreadOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        UUID userId = resolveUserId(authentication);
        return ResponseEntity.ok(notificationService.getUserNotifications(userId, unreadOnly, page, size));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> unreadCount(Authentication authentication) {
        UUID userId = resolveUserId(authentication);
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }

    @PostMapping("/mark-read/{id}")
    public ResponseEntity<NotificationResponse> markRead(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        UUID userId = resolveUserId(authentication);
        return ResponseEntity.ok(notificationService.markAsRead(id, userId));
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<Void> markAllRead(Authentication authentication) {
        UUID userId = resolveUserId(authentication);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/archive/{id}")
    public ResponseEntity<NotificationResponse> archive(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        UUID userId = resolveUserId(authentication);
        return ResponseEntity.ok(notificationService.archiveNotification(id, userId));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERUSER')")
    public ResponseEntity<NotificationResponse> createForUser(
            @RequestBody AdminNotificationRequest request
    ) {
        return ResponseEntity.ok(notificationService.createNotification(
                request.getUserId(),
                request.getTitle(),
                request.getMessage(),
                request.getType()
        ));
    }

    private UUID resolveUserId(Authentication authentication) {
        return userRepository.findByEmailNormalized(authentication.getName().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
    }

    public static class AdminNotificationRequest {
        private UUID userId;
        private String title;
        private String message;
        private NotificationType type;

        public UUID getUserId() {
            return userId;
        }

        public void setUserId(UUID userId) {
            this.userId = userId;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public NotificationType getType() {
            return type;
        }

        public void setType(NotificationType type) {
            this.type = type;
        }
    }
}

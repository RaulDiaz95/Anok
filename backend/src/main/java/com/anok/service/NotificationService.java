package com.anok.service;

import com.anok.dto.NotificationResponse;
import com.anok.exception.ResourceNotFoundException;
import com.anok.model.Notification;
import com.anok.model.NotificationType;
import com.anok.model.User;
import com.anok.repository.NotificationRepository;
import com.anok.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public NotificationResponse createNotification(UUID userId, String title, String message, NotificationType type) {
        return createNotification(userId, title, message, type, null);
    }

    @Transactional
    public NotificationResponse createNotification(UUID userId, String title, String message, NotificationType type, String actionUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type == null ? NotificationType.INFO : type);
        notification.setActionUrl(actionUrl);
        Notification saved = notificationRepository.save(notification);
        return toResponse(saved);
    }

    public List<NotificationResponse> getUserNotifications(UUID userId, boolean unreadOnly, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Notification> notifications = unreadOnly
                ? notificationRepository.findUnreadByUserId(userId, pageable)
                : notificationRepository.findActiveByUserId(userId, pageable);
        return notifications.getContent()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(UUID userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    @Transactional
    public NotificationResponse markAsRead(UUID notificationId, UUID userId) {
        Notification notification = getUserNotification(notificationId, userId);
        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return toResponse(saved);
    }

    @Transactional
    public void markAllAsRead(UUID userId) {
        List<Notification> notifications = notificationRepository.findUnreadByUserId(userId, PageRequest.of(0, Integer.MAX_VALUE)).getContent();
        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public NotificationResponse archiveNotification(UUID notificationId, UUID userId) {
        Notification notification = getUserNotification(notificationId, userId);
        notification.setArchived(true);
        Notification saved = notificationRepository.save(notification);
        return toResponse(saved);
    }

    public void notifyUsersByRole(String roleName, String title, String message, NotificationType type) {
        List<User> users = userRepository.findAllByRoleName(roleName);
        for (User user : users) {
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setType(type == null ? NotificationType.INFO : type);
            notification.setActionUrl(null);
            notificationRepository.save(notification);
        }
    }

    public void notifyUsersByRoles(List<String> roleNames, String title, String message, NotificationType type) {
        java.util.Set<UUID> notified = new java.util.HashSet<>();
        for (String roleName : roleNames) {
            List<User> users = userRepository.findAllByRoleName(roleName);
            for (User user : users) {
                if (!notified.add(user.getId())) {
                    continue;
                }
                Notification notification = new Notification();
                notification.setUser(user);
                notification.setTitle(title);
                notification.setMessage(message);
                notification.setType(type == null ? NotificationType.INFO : type);
                notification.setActionUrl(null);
                notificationRepository.save(notification);
            }
        }
    }

    private Notification getUserNotification(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found");
        }
        return notification;
    }

    private NotificationResponse toResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setActionUrl(notification.getActionUrl());
        response.setType(notification.getType());
        response.setRead(notification.getRead());
        response.setArchived(notification.getArchived());
        response.setCreatedAt(notification.getCreatedAt());
        response.setUpdatedAt(notification.getUpdatedAt());
        return response;
    }
}

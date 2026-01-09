package com.anok.service;

import com.anok.exception.ResourceNotFoundException;
import com.anok.model.Event;
import com.anok.model.EventReaction;
import com.anok.model.EventReactionType;
import com.anok.model.NotificationType;
import com.anok.model.User;
import com.anok.repository.EventReactionRepository;
import com.anok.repository.EventRepository;
import com.anok.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class EventReactionService {

    private final EventReactionRepository reactionRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public EventReactionService(EventReactionRepository reactionRepository, EventRepository eventRepository, UserRepository userRepository, NotificationService notificationService) {
        this.reactionRepository = reactionRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public void reportEvent(UUID eventId, String reporterEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        User user = userRepository.findByEmailNormalized(reporterEmail.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        EventReaction reaction = reactionRepository.findByUser_IdAndEvent_Id(user.getId(), eventId)
                .orElseGet(EventReaction::new);
        reaction.setUser(user);
        reaction.setEvent(event);
        reaction.setReactionType(EventReactionType.REPORT);
        reactionRepository.save(reaction);

        String message = "Event reported: " + event.getTitle();
        notificationService.notifyUsersByRoles(
                java.util.List.of("ROLE_SUPERUSER", "ROLE_ADMIN"),
                "Event reported",
                message,
                NotificationType.FLAGGED_EVENT
        );
    }
}

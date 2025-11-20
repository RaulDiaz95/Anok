package com.anok.service;

import com.anok.dto.EventRequest;
import com.anok.dto.EventResponse;
import com.anok.exception.ResourceNotFoundException;
import com.anok.model.Event;
import com.anok.model.User;
import com.anok.repository.EventRepository;
import com.anok.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    public EventResponse createEvent(EventRequest request, String ownerEmail) {
        User owner = userRepository.findByEmailNormalized(ownerEmail.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Event event = new Event();
        event.setOwner(owner);
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDateTime(request.getEventDateTime());
        event.setVenueName(request.getVenueName());
        event.setVenueAddress(request.getVenueAddress());
        event.setCapacity(request.getCapacity());
        event.setAgeRestriction(request.getAgeRestriction());

        Event saved = eventRepository.save(event);
        return toResponse(saved);
    }

    public List<EventResponse> listUpcomingEvents() {
        LocalDateTime now = LocalDateTime.now();
        return eventRepository.findAllByEventDateTimeAfterOrderByEventDateTimeAsc(now)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public EventResponse getEvent(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        return toResponse(event);
    }

    private EventResponse toResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setEventDateTime(event.getEventDateTime());
        response.setVenueName(event.getVenueName());
        response.setVenueAddress(event.getVenueAddress());
        response.setCapacity(event.getCapacity());
        response.setAgeRestriction(event.getAgeRestriction());
        if (event.getOwner() != null) {
            response.setOwnerId(event.getOwner().getId());
            response.setOwnerName(event.getOwner().getFullName());
        }
        return response;
    }
}

package com.anok.controller;

import com.anok.dto.EventRequest;
import com.anok.dto.EventResponse;
import com.anok.dto.PageResponse;
import com.anok.service.EventService;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService eventService;
    private final com.anok.service.EventReactionService eventReactionService;

    public EventController(EventService eventService, com.anok.service.EventReactionService eventReactionService) {
        this.eventService = eventService;
        this.eventReactionService = eventReactionService;
    }

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventRequest request,
            Authentication authentication
    ) {
        EventResponse response = eventService.createEvent(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<PageResponse<EventResponse>> listEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(eventService.listUpcomingEvents(page, size));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<EventResponse>> listMyEvents(Authentication authentication) {
        return ResponseEntity.ok(eventService.listUserEvents(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEvent(@PathVariable UUID id, Authentication authentication) {
        String viewerEmail = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(eventService.getEvent(id, viewerEmail));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable UUID id,
            @Valid @RequestBody EventRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(eventService.updateEvent(id, request, authentication.getName()));
    }

    @PatchMapping("/{id}/live")
    public ResponseEntity<EventResponse> updateLiveStatus(
            @PathVariable UUID id,
            @RequestBody LiveStatusRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(eventService.updateLiveStatus(id, request.isLive(), authentication.getName()));
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<Void> reportEvent(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        eventReactionService.reportEvent(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    public static class LiveStatusRequest {
        @JsonProperty("isLive")
        private boolean isLive;

        public boolean isLive() {
            return isLive;
        }

        public void setLive(boolean live) {
            isLive = live;
        }
    }
}

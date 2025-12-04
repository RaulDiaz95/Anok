package com.anok.controller;

import com.anok.dto.EventResponse;
import com.anok.model.EventStatus;
import com.anok.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/events")
@PreAuthorize("hasRole('SUPERUSER')")
public class AdminEventController {

    private final EventService eventService;

    public AdminEventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<EventResponse>> listPending() {
        return ResponseEntity.ok(eventService.findByStatus(EventStatus.PENDING_REVIEW));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(eventService.getEvent(id));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<EventResponse> approve(@PathVariable UUID id) {
        return ResponseEntity.ok(eventService.approve(id));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<EventResponse> reject(@PathVariable UUID id) {
        return ResponseEntity.ok(eventService.reject(id));
    }
}

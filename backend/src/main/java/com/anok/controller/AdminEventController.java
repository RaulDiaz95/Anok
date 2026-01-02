package com.anok.controller;

import com.anok.dto.EventResponse;
import com.anok.model.EventStatus;
import com.anok.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/events")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPERUSER')")
public class AdminEventController {

    private final EventService eventService;

    public AdminEventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<EventResponse>> listAll() {
        return ResponseEntity.ok(eventService.findAllAdmin());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<EventResponse>> listPending() {
        return ResponseEntity.ok(eventService.findByStatus(EventStatus.PENDING_REVIEW));
    }

    @GetMapping("/live")
    public ResponseEntity<List<EventResponse>> listLive() {
        return ResponseEntity.ok(eventService.findByStatus(EventStatus.APPROVED));
    }

    @GetMapping("/disabled")
    public ResponseEntity<List<EventResponse>> listDisabled() {
        return ResponseEntity.ok(eventService.findByStatus(EventStatus.DISABLED));
    }

    @GetMapping("/deleted")
    public ResponseEntity<List<EventResponse>> listDeleted() {
        return ResponseEntity.ok(eventService.findByStatus(EventStatus.DELETED));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(eventService.getEventAdmin(id));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<EventResponse> approve(@PathVariable UUID id, Authentication authentication) {
        return ResponseEntity.ok(eventService.approve(id, authentication.getName()));
    }

    @PatchMapping("/{id}/disable")
    public ResponseEntity<EventResponse> disable(@PathVariable UUID id, Authentication authentication) {
        return ResponseEntity.ok(eventService.disable(id, authentication.getName()));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<EventResponse> reject(@PathVariable UUID id, Authentication authentication) {
        return ResponseEntity.ok(eventService.reject(id, authentication.getName()));
    }

    @PatchMapping("/{id}/delete")
    public ResponseEntity<EventResponse> delete(@PathVariable UUID id, Authentication authentication) {
        return ResponseEntity.ok(eventService.delete(id, authentication.getName()));
    }

    @PatchMapping("/{id}/request-changes")
    public ResponseEntity<EventResponse> requestChanges(
            @PathVariable UUID id,
            @RequestBody RequestChangesRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(eventService.requestChanges(id, authentication.getName(), request.getAdminNotes()));
    }

    public static class RequestChangesRequest {
        private String adminNotes;

        public String getAdminNotes() {
            return adminNotes;
        }

        public void setAdminNotes(String adminNotes) {
            this.adminNotes = adminNotes;
        }
    }
}

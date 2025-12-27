package com.anok.controller;

import com.anok.dto.VenueInsightsResponse;
import com.anok.dto.VenueResponse;
import com.anok.service.AdminVenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/venues")
@PreAuthorize("hasRole('SUPERUSER')")
public class AdminVenueController {

    @Autowired
    private AdminVenueService adminVenueService;

    @GetMapping("/insights")
    public ResponseEntity<VenueInsightsResponse> getInsights() {
        return ResponseEntity.ok(adminVenueService.getInsights());
    }

    @GetMapping("/top")
    public ResponseEntity<List<VenueResponse>> getTop(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(adminVenueService.getTopVenues(PageRequest.of(0, Math.max(1, Math.min(limit, 50)))));
    }

    @PostMapping("/{venueId}/verify")
    public ResponseEntity<Void> verify(@PathVariable UUID venueId) {
        adminVenueService.verifyVenue(venueId);
        return ResponseEntity.noContent().build();
    }
}

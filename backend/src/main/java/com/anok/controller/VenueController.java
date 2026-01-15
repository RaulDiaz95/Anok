package com.anok.controller;

import com.anok.dto.VenueResponse;
import com.anok.dto.VenueSuggestionsResponse;
import com.anok.dto.VenueProfileResponse;
import com.anok.dto.SimilarVenueResponse;
import com.anok.service.SmartVenueService;
import com.anok.service.VenueService;
import com.anok.service.VenueProfileService;
import com.anok.service.VenueSimilarityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/venues")
public class VenueController {

    @Autowired
    private VenueService venueService;

    @Autowired
    private SmartVenueService smartVenueService;
    @Autowired
    private VenueProfileService venueProfileService;
    @Autowired
    private VenueSimilarityService venueSimilarityService;

    @GetMapping("/search")
    public ResponseEntity<List<VenueResponse>> search(
            @RequestParam("query") String query,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "state", required = false) String state
    ) {
        List<VenueResponse> results = venueService.searchVenues(query, city, state);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/smart-suggestions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VenueSuggestionsResponse> smartSuggestions(
            @RequestParam(value = "userId", required = false) UUID userId,
            Principal principal
    ) {
        VenueSuggestionsResponse res = smartVenueService.getSuggestionsForUser(userId);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VenueProfileResponse> getVenueProfile(@PathVariable UUID id) {
        return ResponseEntity.ok(venueProfileService.getVenueProfile(id));
    }

    @GetMapping("/{id}/similar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SimilarVenueResponse>> getSimilarVenues(@PathVariable UUID id) {
        return ResponseEntity.ok(venueSimilarityService.getSimilarVenues(id));
    }
}

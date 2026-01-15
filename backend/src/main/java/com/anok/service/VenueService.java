package com.anok.service;

import com.anok.dto.VenueResponse;
import com.anok.model.Venue;
import com.anok.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class VenueService {
    @Autowired
    private VenueRepository venueRepository;

    @Transactional(readOnly = true)
    public List<VenueResponse> searchVenues(String query, String city, String state) {
        if (query == null || query.trim().length() < 3) {
            return Collections.emptyList();
        }
        String q = query.trim();
        List<Venue> venues;
        if ((city != null && !city.isBlank()) || (state != null && !state.isBlank())) {
            venues = venueRepository.searchRanked(q, nullToEmpty(city), nullToEmpty(state));
        } else {
            venues = venueRepository.searchBasic(q);
        }
        // Fallback safety: sort by usageCount desc, verified desc, name asc
        venues.sort(
                Comparator.comparing(Venue::getUsageCount, Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing((Venue v) -> Boolean.TRUE.equals(v.getVerified()) ? 0 : 1)
                        .thenComparing(Venue::getName, String.CASE_INSENSITIVE_ORDER)
        );
        return venues.stream().map(VenueResponse::new).toList();
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }
}

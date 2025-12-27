package com.anok.service;

import com.anok.dto.VenueInsightsResponse;
import com.anok.dto.VenueResponse;
import com.anok.model.Venue;
import com.anok.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminVenueService {

    @Autowired
    private VenueRepository venueRepository;

    @Transactional(readOnly = true)
    public VenueInsightsResponse getInsights() {
        VenueInsightsResponse res = new VenueInsightsResponse();
        res.setTotalVenues(venueRepository.count());
        res.setVerified(venueRepository.countByVerifiedTrue());
        res.setUnverified(venueRepository.countByVerifiedFalse());
        res.setTopVenues(map(venueRepository.findAllByOrderByUsageCountDesc(Pageable.ofSize(5))));
        res.setRecentVenues(map(venueRepository.findRecent(Pageable.ofSize(5))));
        res.setNeedsVerification(map(venueRepository.findByVerifiedFalseOrderByCreatedAtDesc()));
        res.setUsedLast30Days(map(venueRepository.findUsedLast30Days(LocalDate.now().minusDays(30))));
        return res;
    }

    @Transactional(readOnly = true)
    public List<VenueResponse> getTopVenues(Pageable pageable) {
        return map(venueRepository.findAllByOrderByUsageCountDesc(pageable));
    }

    @Transactional
    public void verifyVenue(UUID id) {
        venueRepository.findById(id).ifPresent(venue -> {
            venue.setVerified(true);
            venueRepository.save(venue);
        });
    }

    private List<VenueResponse> map(List<Venue> venues) {
        return venues.stream().map(VenueResponse::new).collect(Collectors.toList());
    }
}

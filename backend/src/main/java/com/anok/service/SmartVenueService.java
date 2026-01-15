package com.anok.service;

import com.anok.dto.VenueResponse;
import com.anok.dto.VenueSuggestionsResponse;
import com.anok.model.Venue;
import com.anok.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SmartVenueService {

    @Autowired
    private VenueRepository venueRepository;

    @Transactional(readOnly = true)
    public VenueSuggestionsResponse getSuggestionsForUser(UUID userId) {
        VenueSuggestionsResponse res = new VenueSuggestionsResponse();

        LocalDate fromDate = LocalDate.now().minusDays(60);
        List<Venue> popularRecently = venueRepository.findPopularLast60Days(fromDate, PageRequest.of(0, 6));
        List<Venue> verifiedRecommended = venueRepository.findByVerifiedTrueOrderByUsageCountDesc(PageRequest.of(0, 6));

        List<Venue> userHistory = userId != null ? venueRepository.findUserHistory(userId) : new ArrayList<>();
        List<Venue> nearUser = userId != null ? venueRepository.findNearUser(userId, PageRequest.of(0, 6)) : new ArrayList<>();

        res.setPopularRecently(mapWithScore(popularRecently, userId, userHistory, nearUser));
        res.setVerifiedRecommended(mapWithScore(verifiedRecommended, userId, userHistory, nearUser));
        res.setUserHistory(mapWithScore(userHistory, userId, userHistory, nearUser));
        res.setTopNearUser(mapWithScore(nearUser, userId, userHistory, nearUser));
        return res;
    }

    private List<VenueResponse> mapWithScore(List<Venue> venues, UUID userId, List<Venue> history, List<Venue> near) {
        return venues.stream()
                .sorted(Comparator.comparingDouble((Venue v) -> -computeScore(v, userId, history, near)))
                .map(VenueResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Deterministic ranking formula approximating "smart" recommendations.
     */
    private double computeScore(Venue v, UUID userId, List<Venue> history, List<Venue> near) {
        double score = 0;
        int usage = v.getUsageCount() != null ? v.getUsageCount() : 0;
        score += usage * 4;
        if (Boolean.TRUE.equals(v.getVerified())) {
            score += 20;
        } else {
            score -= 2;
        }
        score += Math.min(usage, 50); // popularity cap
        boolean inHistory = history.stream().anyMatch(h -> h.getId().equals(v.getId()));
        boolean isNear = near.stream().anyMatch(h -> h.getId().equals(v.getId()));
        if (inHistory) score += 30;
        if (isNear) score += 15;
        // slight recency approximation
        score += 5;
        return score;
    }
}

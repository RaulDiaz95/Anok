package com.anok.service;

import com.anok.dto.SimilarVenueResponse;
import com.anok.model.Venue;
import com.anok.model.VenuePhoto;
import com.anok.repository.VenuePhotoRepository;
import com.anok.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class VenueSimilarityService {

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private VenuePhotoRepository venuePhotoRepository;

    @Transactional(readOnly = true)
    public List<SimilarVenueResponse> getSimilarVenues(UUID venueId) {
        Venue target = venueRepository.findById(venueId).orElse(null);
        if (target == null) {
            return Collections.emptyList();
        }
        List<Venue> others = venueRepository.findAll().stream()
                .filter(v -> !v.getId().equals(venueId))
                .toList();

        List<ScoredVenue> scored = new ArrayList<>();
        for (Venue v : others) {
            double score = calculateSimilarity(target, v);
            if (score >= 30) {
                scored.add(new ScoredVenue(v, score));
            }
        }

        return scored.stream()
                .sorted(Comparator.comparingDouble((ScoredVenue sv) -> sv.score).reversed())
                .limit(8)
                .map(sv -> {
                    String hero = extractHeroPhoto(sv.venue);
                    return new SimilarVenueResponse(sv.venue, sv.score, hero);
                })
                .collect(Collectors.toList());
    }

    private String extractHeroPhoto(Venue venue) {
        if (venue.getPhotos() != null && !venue.getPhotos().isEmpty()) {
            VenuePhoto photo = venue.getPhotos().get(0);
            return photo != null ? photo.getUrl() : null;
        }
        // Fallback fetch to avoid lazy issues when list is not initialized
        return venuePhotoRepository.findAllByVenue_IdOrderByCreatedAtAsc(venue.getId())
                .stream()
                .findFirst()
                .map(VenuePhoto::getUrl)
                .orElse(null);
    }

    private double calculateSimilarity(Venue a, Venue b) {
        double score = 0;
        if (equalsIgnoreCase(a.getCity(), b.getCity())) score += 25;
        if (equalsIgnoreCase(a.getState(), b.getState())) score += 15;
        if (equalsIgnoreCase(a.getCountry(), b.getCountry())) score += 10;

        int ua = a.getUsageCount() != null ? a.getUsageCount() : 0;
        int ub = b.getUsageCount() != null ? b.getUsageCount() : 0;
        score += 0.5 * Math.min(ua, ub);

        if (Boolean.TRUE.equals(a.getVerified()) && Boolean.TRUE.equals(b.getVerified())) score += 10;

        if (a.getCapacity() != null && b.getCapacity() != null && a.getCapacity() > 0 && b.getCapacity() > 0) {
            double diff = Math.abs(a.getCapacity() - b.getCapacity());
            double avg = (a.getCapacity() + b.getCapacity()) / 2.0;
            if (avg > 0 && (diff / avg) < 0.3) {
                score += 5;
            }
        }

        score += nameSimilarity(a.getName(), b.getName()) * 20;

        return Math.min(100, score);
    }

    private double nameSimilarity(String a, String b) {
        if (a == null || b == null) return 0;
        Set<String> sa = toTrigrams(a);
        Set<String> sb = toTrigrams(b);
        if (sa.isEmpty() || sb.isEmpty()) return 0;
        Set<String> inter = new HashSet<>(sa);
        inter.retainAll(sb);
        Set<String> union = new HashSet<>(sa);
        union.addAll(sb);
        return union.isEmpty() ? 0 : (double) inter.size() / union.size();
    }

    private Set<String> toTrigrams(String s) {
        String cleaned = s.toLowerCase().replaceAll("[^a-z0-9 ]", " ").trim();
        if (cleaned.length() < 2) return Collections.emptySet();
        Set<String> grams = new HashSet<>();
        for (int i = 0; i < cleaned.length() - 1; i++) {
            grams.add(cleaned.substring(i, i + 2));
        }
        return grams;
    }

    private boolean equalsIgnoreCase(String a, String b) {
        if (a == null || b == null) return false;
        return a.equalsIgnoreCase(b);
    }

    private record ScoredVenue(Venue venue, double score) {}
}

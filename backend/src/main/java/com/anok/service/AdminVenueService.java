package com.anok.service;

import com.anok.dto.VenueInsightsResponse;
import com.anok.dto.VenueResponse;
import com.anok.dto.VenueUpdateRequest;
import com.anok.exception.ResourceNotFoundException;
import com.anok.exception.ValidationException;
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

    @Transactional
    public VenueResponse updateVenue(UUID id, VenueUpdateRequest request) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found"));

        String name = normalize(request.getName(), venue.getName());
        if (isBlank(name)) {
            throw new ValidationException("name", "Venue name is required");
        }
        String address = normalize(request.getAddress(), venue.getAddress());
        if (isBlank(address)) {
            throw new ValidationException("address", "Venue address is required");
        }
        String city = normalize(request.getCity(), venue.getCity());
        if (isBlank(city)) {
            throw new ValidationException("city", "City is required");
        }
        String state = normalize(request.getState(), venue.getState());
        if (isBlank(state)) {
            throw new ValidationException("state", "State is required");
        }
        String country = normalize(request.getCountry(), venue.getCountry());
        if (isBlank(country)) {
            throw new ValidationException("country", "Country is required");
        }
        String postalCode = normalize(request.getPostalCode(), venue.getPostalCode());
        if (isBlank(postalCode)) {
            throw new ValidationException("postalCode", "Postal code is required");
        }
        Integer usageCount = request.getUsageCount() != null ? request.getUsageCount() : venue.getUsageCount();
        if (usageCount != null && usageCount < 0) {
            throw new ValidationException("usageCount", "Usage count cannot be negative");
        }
        Integer capacity = request.getCapacity() != null ? request.getCapacity() : venue.getCapacity();
        if (capacity != null && capacity < 0) {
            throw new ValidationException("capacity", "Capacity cannot be negative");
        }

        venue.setName(name);
        venue.setAddress(address);
        venue.setCity(city);
        venue.setState(state);
        venue.setCountry(country);
        venue.setPostalCode(postalCode);
        venue.setUsageCount(usageCount != null ? usageCount : 0);
        venue.setCapacity(capacity);

        if (request.getVerified() != null) {
            venue.setVerified(request.getVerified());
        }
        if (request.getCreatedByAdmin() != null) {
            venue.setCreatedByAdmin(request.getCreatedByAdmin());
        }
        if (request.getDescription() != null) {
            String trimmedDescription = request.getDescription().trim();
            venue.setDescription(trimmedDescription.isEmpty() ? null : trimmedDescription);
        }
        if (request.getLatitude() != null) {
            venue.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            venue.setLongitude(request.getLongitude());
        }

        Venue saved = venueRepository.save(venue);
        return new VenueResponse(saved);
    }

    private List<VenueResponse> map(List<Venue> venues) {
        return venues.stream().map(VenueResponse::new).collect(Collectors.toList());
    }

    private String normalize(String value, String fallback) {
        if (value == null) {
            return fallback;
        }
        return value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}

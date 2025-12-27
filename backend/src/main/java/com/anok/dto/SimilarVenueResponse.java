package com.anok.dto;

import com.anok.model.Venue;

import java.util.UUID;

/**
 * Compact DTO for similar venue recommendations.
 */
public class SimilarVenueResponse {
    private UUID id;
    private String name;
    private String city;
    private String state;
    private String country;
    private boolean verified;
    private int usageCount;
    private double similarityScore;
    private String heroPhoto;

    public SimilarVenueResponse(Venue venue, double similarityScore, String heroPhoto) {
        this.id = venue.getId();
        this.name = venue.getName();
        this.city = venue.getCity();
        this.state = venue.getState();
        this.country = venue.getCountry();
        this.verified = Boolean.TRUE.equals(venue.getVerified());
        this.usageCount = venue.getUsageCount() != null ? venue.getUsageCount() : 0;
        this.similarityScore = similarityScore;
        this.heroPhoto = heroPhoto;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getCountry() {
        return country;
    }

    public boolean isVerified() {
        return verified;
    }

    public int getUsageCount() {
        return usageCount;
    }

    public double getSimilarityScore() {
        return similarityScore;
    }

    public String getHeroPhoto() {
        return heroPhoto;
    }
}

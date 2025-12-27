package com.anok.dto;

import com.anok.model.Venue;

import java.util.UUID;

public class VenueResponse {
    private UUID id;
    private String name;
    private String city;
    private String state;
    private String country;
    private String address;
    private String postalCode;
    private boolean verified;
    private int usageCount;
    private Integer capacity;

    public VenueResponse(Venue venue) {
        this.id = venue.getId();
        this.name = venue.getName();
        this.city = venue.getCity();
        this.state = venue.getState();
        this.country = venue.getCountry();
        this.address = venue.getAddress();
        this.postalCode = venue.getPostalCode();
        this.verified = Boolean.TRUE.equals(venue.getVerified());
        this.usageCount = venue.getUsageCount() != null ? venue.getUsageCount() : 0;
        this.capacity = venue.getCapacity();
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

    public String getAddress() {
        return address;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public boolean isVerified() {
        return verified;
    }

    public int getUsageCount() {
        return usageCount;
    }

    public Integer getCapacity() {
        return capacity;
    }
}

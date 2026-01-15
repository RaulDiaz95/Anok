package com.anok.dto;

import com.anok.model.Venue;
import com.anok.model.VenuePhoto;

import java.util.List;
import java.util.UUID;

public class VenueProfileResponse {
    private UUID id;
    private String name;
    private String city;
    private String state;
    private String country;
    private String address;
    private String postal;
    private boolean verified;
    private int usageCount;
    private String description;
    private Integer capacity;
    private Double latitude;
    private Double longitude;
    private List<String> photos;
    private List<EventResponse> upcomingEvents;
    private List<EventResponse> pastEvents;
    private List<SimilarVenueResponse> similarVenues;

    public VenueProfileResponse(Venue venue) {
        this.id = venue.getId();
        this.name = venue.getName();
        this.city = venue.getCity();
        this.state = venue.getState();
        this.country = venue.getCountry();
        this.address = venue.getAddress();
        this.postal = venue.getPostalCode();
        this.verified = Boolean.TRUE.equals(venue.getVerified());
        this.usageCount = venue.getUsageCount() != null ? venue.getUsageCount() : 0;
        this.description = venue.getDescription();
        this.capacity = venue.getCapacity();
        this.latitude = venue.getLatitude();
        this.longitude = venue.getLongitude();
        this.photos = venue.getPhotos() != null
                ? venue.getPhotos().stream().map(VenuePhoto::getUrl).toList()
                : List.of();
        this.similarVenues = List.of();
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

    public String getPostal() {
        return postal;
    }

    public boolean isVerified() {
        return verified;
    }

    public int getUsageCount() {
        return usageCount;
    }

    public String getDescription() {
        return description;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public List<String> getPhotos() {
        return photos;
    }

    public void setPhotos(List<String> photos) {
        this.photos = photos;
    }

    public List<SimilarVenueResponse> getSimilarVenues() {
        return similarVenues;
    }

    public void setSimilarVenues(List<SimilarVenueResponse> similarVenues) {
        this.similarVenues = similarVenues;
    }

    public List<EventResponse> getUpcomingEvents() {
        return upcomingEvents;
    }

    public void setUpcomingEvents(List<EventResponse> upcomingEvents) {
        this.upcomingEvents = upcomingEvents;
    }

    public List<EventResponse> getPastEvents() {
        return pastEvents;
    }

    public void setPastEvents(List<EventResponse> pastEvents) {
        this.pastEvents = pastEvents;
    }

    public void setPostal(String postal) {
        this.postal = postal;
    }
}

package com.anok.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class EventRequest {

    @NotBlank
    @Size(max = 255)
    private String title;

    @Size(max = 4000)
    private String description;

    @NotNull
    @Future
    private LocalDateTime eventDateTime;

    @NotBlank
    @Size(max = 255)
    private String venueName;

    @NotBlank
    private String venueAddress;

    @NotNull
    @Min(0)
    private Integer capacity;

    @NotBlank
    @Size(max = 50)
    private String ageRestriction;

    @Size(max = 50)
    private List<@NotBlank @Size(max = 25) String> genres = new ArrayList<>();

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getEventDateTime() {
        return eventDateTime;
    }

    public void setEventDateTime(LocalDateTime eventDateTime) {
        this.eventDateTime = eventDateTime;
    }

    public String getVenueName() {
        return venueName;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public String getVenueAddress() {
        return venueAddress;
    }

    public void setVenueAddress(String venueAddress) {
        this.venueAddress = venueAddress;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getAgeRestriction() {
        return ageRestriction;
    }

    public void setAgeRestriction(String ageRestriction) {
        this.ageRestriction = ageRestriction;
    }

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }
}

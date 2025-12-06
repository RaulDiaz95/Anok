package com.anok.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.anok.model.EventStatus;

public class EventResponse {

    private UUID id;
    private String title;
    private String flyerUrl;
    private LocalDate eventDate;
    private LocalTime startTime;
    private Integer eventLengthHours;
    private LocalTime endTime;
    @JsonProperty("isLive")
    private Boolean isLive;
    private LocalDateTime eventDateTime;
    private String venueName;
    private String venueAddress;
    private String venueZipCode;
    private String venueState;
    private String venueCountry;
    private String about;
    private Integer capacity;
    private String ageRestriction;
    private Boolean allAges;
    private Boolean alcohol;
    private EventStatus status;
    private List<String> genres = new ArrayList<>();
    private List<PerformerResponse> performers = new ArrayList<>();
    private UUID ownerId;
    private String ownerName;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFlyerUrl() {
        return flyerUrl;
    }

    public void setFlyerUrl(String flyerUrl) {
        this.flyerUrl = flyerUrl;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public Integer getEventLengthHours() {
        return eventLengthHours;
    }

    public void setEventLengthHours(Integer eventLengthHours) {
        this.eventLengthHours = eventLengthHours;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Boolean getLive() {
        return isLive;
    }

    public void setLive(Boolean live) {
        isLive = live;
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

    public String getVenueZipCode() {
        return venueZipCode;
    }

    public void setVenueZipCode(String venueZipCode) {
        this.venueZipCode = venueZipCode;
    }

    public String getVenueState() {
        return venueState;
    }

    public void setVenueState(String venueState) {
        this.venueState = venueState;
    }

    public String getVenueCountry() {
        return venueCountry;
    }

    public void setVenueCountry(String venueCountry) {
        this.venueCountry = venueCountry;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
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

    public Boolean getAllAges() {
        return allAges;
    }

    public void setAllAges(Boolean allAges) {
        this.allAges = allAges;
    }

    public Boolean getAlcohol() {
        return alcohol;
    }

    public void setAlcohol(Boolean alcohol) {
        this.alcohol = alcohol;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }

    public List<PerformerResponse> getPerformers() {
        return performers;
    }

    public void setPerformers(List<PerformerResponse> performers) {
        this.performers = performers;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public static class PerformerResponse {
        private UUID id;
        private String performerName;
        private String genre1;
        private String genre2;
        private String genre3;
        private String performerLink;

        public UUID getId() {
            return id;
        }

        public void setId(UUID id) {
            this.id = id;
        }

        public String getPerformerName() {
            return performerName;
        }

        public void setPerformerName(String performerName) {
            this.performerName = performerName;
        }

        public String getGenre1() {
            return genre1;
        }

        public void setGenre1(String genre1) {
            this.genre1 = genre1;
        }

        public String getGenre2() {
            return genre2;
        }

        public void setGenre2(String genre2) {
            this.genre2 = genre2;
        }

        public String getGenre3() {
            return genre3;
        }

        public void setGenre3(String genre3) {
            this.genre3 = genre3;
        }

        public String getPerformerLink() {
            return performerLink;
        }

        public void setPerformerLink(String performerLink) {
            this.performerLink = performerLink;
        }
    }
}

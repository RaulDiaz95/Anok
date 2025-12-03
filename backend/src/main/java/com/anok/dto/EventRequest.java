package com.anok.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class EventRequest {

    @NotBlank
    @Size(max = 255)
    private String title;

    private String flyerUrl;

    @NotNull
    private LocalDate eventDate;

    @NotNull
    private LocalTime startTime;

    @NotNull
    @Min(0)
    private Integer eventLengthHours;

    private LocalTime endTime;

    @NotNull
    @JsonProperty("isLive")
    private Boolean isLive;

    @NotBlank
    @Size(max = 255)
    private String venueName;

    @NotBlank
    private String venueAddress;

    @NotBlank
    @Size(max = 50)
    private String venueZipCode;

    @NotBlank
    @Size(max = 255)
    private String venueState;

    @NotBlank
    @Size(max = 255)
    private String venueCountry;

    @NotBlank
    @Size(max = 4000)
    private String about;

    @NotNull
    @Min(0)
    private Integer capacity;

    @NotNull
    private Boolean allAges;

    @NotNull
    private Boolean alcohol;

    @Size(max = 50)
    private List<@NotBlank @Size(max = 25) String> genres = new ArrayList<>();

    @NotEmpty
    @Valid
    private List<PerformerRequest> performers = new ArrayList<>();

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

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }

    public List<PerformerRequest> getPerformers() {
        return performers;
    }

    public void setPerformers(List<PerformerRequest> performers) {
        this.performers = performers;
    }

    public static class PerformerRequest {
        @NotBlank
        @Size(max = 255)
        private String performerName;

        @Size(max = 100)
        private String genre1;

        @Size(max = 100)
        private String genre2;

        @Size(max = 1000)
        private String performerLink;

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

        public String getPerformerLink() {
            return performerLink;
        }

        public void setPerformerLink(String performerLink) {
            this.performerLink = performerLink;
        }
    }
}

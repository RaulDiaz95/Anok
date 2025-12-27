package com.anok.dto;

import java.util.List;

public class VenueInsightsResponse {
    private long totalVenues;
    private long verified;
    private long unverified;
    private List<VenueResponse> topVenues;
    private List<VenueResponse> recentVenues;
    private List<VenueResponse> needsVerification;
    private List<VenueResponse> usedLast30Days;

    public long getTotalVenues() {
        return totalVenues;
    }

    public void setTotalVenues(long totalVenues) {
        this.totalVenues = totalVenues;
    }

    public long getVerified() {
        return verified;
    }

    public void setVerified(long verified) {
        this.verified = verified;
    }

    public long getUnverified() {
        return unverified;
    }

    public void setUnverified(long unverified) {
        this.unverified = unverified;
    }

    public List<VenueResponse> getTopVenues() {
        return topVenues;
    }

    public void setTopVenues(List<VenueResponse> topVenues) {
        this.topVenues = topVenues;
    }

    public List<VenueResponse> getRecentVenues() {
        return recentVenues;
    }

    public void setRecentVenues(List<VenueResponse> recentVenues) {
        this.recentVenues = recentVenues;
    }

    public List<VenueResponse> getNeedsVerification() {
        return needsVerification;
    }

    public void setNeedsVerification(List<VenueResponse> needsVerification) {
        this.needsVerification = needsVerification;
    }

    public List<VenueResponse> getUsedLast30Days() {
        return usedLast30Days;
    }

    public void setUsedLast30Days(List<VenueResponse> usedLast30Days) {
        this.usedLast30Days = usedLast30Days;
    }
}

package com.anok.dto;

import java.util.List;

public class VenueSuggestionsResponse {
    private List<VenueResponse> topNearUser;
    private List<VenueResponse> popularRecently;
    private List<VenueResponse> userHistory;
    private List<VenueResponse> verifiedRecommended;

    public List<VenueResponse> getTopNearUser() {
        return topNearUser;
    }

    public void setTopNearUser(List<VenueResponse> topNearUser) {
        this.topNearUser = topNearUser;
    }

    public List<VenueResponse> getPopularRecently() {
        return popularRecently;
    }

    public void setPopularRecently(List<VenueResponse> popularRecently) {
        this.popularRecently = popularRecently;
    }

    public List<VenueResponse> getUserHistory() {
        return userHistory;
    }

    public void setUserHistory(List<VenueResponse> userHistory) {
        this.userHistory = userHistory;
    }

    public List<VenueResponse> getVerifiedRecommended() {
        return verifiedRecommended;
    }

    public void setVerifiedRecommended(List<VenueResponse> verifiedRecommended) {
        this.verifiedRecommended = verifiedRecommended;
    }
}

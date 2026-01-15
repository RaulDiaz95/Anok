package com.anok.service;

import com.anok.dto.EventResponse;
import com.anok.dto.VenueProfileResponse;
import com.anok.exception.ResourceNotFoundException;
import com.anok.model.Event;
import com.anok.model.EventStatus;
import com.anok.model.Venue;
import com.anok.repository.EventRepository;
import com.anok.repository.VenuePhotoRepository;
import com.anok.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VenueProfileService {

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private VenuePhotoRepository venuePhotoRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventService eventService;

    @Autowired
    private VenueSimilarityService venueSimilarityService;

    @Transactional(readOnly = true)
    public VenueProfileResponse getVenueProfile(UUID venueId) {
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found"));
        VenueProfileResponse response = new VenueProfileResponse(venue);
        response.setPastEvents(mapEvents(getPastEvents(venueId)));
        response.setUpcomingEvents(mapEvents(getUpcomingEvents(venueId)));
        response.setPostal(null);
        var photos = venuePhotoRepository.findAllByVenue_IdOrderByCreatedAtAsc(venueId);
        response.setPhotos(photos.stream().map(p -> p.getUrl()).toList());
        response.setSimilarVenues(venueSimilarityService.getSimilarVenues(venueId));
        return response;
    }

    @Transactional(readOnly = true)
    public List<Event> getUpcomingEvents(UUID venueId) {
        return eventRepository.findAllBySelectedVenue_IdAndStatusAndEventDateAfterOrderByEventDateAsc(
                venueId, EventStatus.APPROVED, LocalDate.now()
        );
    }

    @Transactional(readOnly = true)
    public List<Event> getPastEvents(UUID venueId) {
        return eventRepository.findTop10BySelectedVenue_IdAndStatusAndEventDateBeforeOrderByEventDateDesc(
                venueId, EventStatus.APPROVED, LocalDate.now()
        );
    }

    private List<EventResponse> mapEvents(List<Event> events) {
        return events.stream()
                .sorted(Comparator.comparing(Event::getEventDate))
                .map(eventService::toResponsePublic)
                .collect(Collectors.toList());
    }
}

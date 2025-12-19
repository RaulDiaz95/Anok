package com.anok.service;

import com.anok.dto.EventRequest;
import com.anok.dto.EventResponse;
import com.anok.dto.PageResponse;
import com.anok.exception.ResourceNotFoundException;
import com.anok.exception.ValidationException;
import com.anok.model.Event;
import com.anok.model.EventGenre;
import com.anok.model.EventPerformer;
import com.anok.model.EventStatus;
import com.anok.model.User;
import com.anok.repository.EventRepository;
import com.anok.repository.UserRepository;
import com.anok.validation.GenreCatalog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;

    public EventService(EventRepository eventRepository, UserRepository userRepository, S3Service s3Service) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.s3Service = s3Service;
    }

    @Transactional
    public EventResponse createEvent(EventRequest request, String ownerEmail) {
        User owner = userRepository.findByEmailNormalized(ownerEmail.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Event event = new Event();
        event.setOwner(owner);
        applyEventRequest(event, request, true);
        event.setStatus(EventStatus.PENDING_REVIEW);
        event.setLive(false);

        Event saved = eventRepository.save(event);
        return toResponse(saved);
    }

    @Transactional
    public EventResponse updateEvent(UUID eventId, EventRequest request, String ownerEmail) {
        Event event = eventRepository.findByIdAndOwner_EmailNormalized(eventId, ownerEmail.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found or not owned by user"));
        // Any edit triggers re-review
        applyEventRequest(event, request, false);
        event.setStatus(EventStatus.PENDING_REVIEW);
        event.setLive(false);
        Event saved = eventRepository.save(event);
        return toResponse(saved);
    }

    public List<EventResponse> listUserEvents(String ownerEmail) {
        String normalizedEmail = ownerEmail.toLowerCase();
        return eventRepository.findAllByOwner_EmailNormalizedOrderByEventDateTimeDesc(normalizedEmail)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventResponse updateLiveStatus(UUID eventId, Boolean isLive, String ownerEmail) {
        Event event = eventRepository.findByIdAndOwner_EmailNormalized(eventId, ownerEmail.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found or not owned by user"));
        if (event.getStatus() != EventStatus.APPROVED && event.getStatus() != EventStatus.LIVE) {
            throw new IllegalStateException("Event must be approved before toggling live state");
        }
        event.setLive(Boolean.TRUE.equals(isLive));
        if (Boolean.TRUE.equals(isLive)) {
            event.setStatus(EventStatus.LIVE);
        }
        Event saved = eventRepository.save(event);
        return toResponse(saved);
    }

    public List<EventResponse> listUpcomingEvents() {
        // Use UTC date and include a 1-day grace window to avoid timezone cutoffs for "today"
        LocalDate utcToday = LocalDate.now(ZoneOffset.UTC).minusDays(1);
        return eventRepository.findAllByEventDateGreaterThanEqualAndIsLiveTrueOrderByEventDateTimeAsc(utcToday)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PageResponse<EventResponse> listUpcomingEvents(int page, int size) {
        // Use UTC date and include a 1-day grace window to avoid timezone cutoffs for "today"
        LocalDate utcToday = LocalDate.now(ZoneOffset.UTC).minusDays(1);
        Pageable pageable = PageRequest.of(page, size);
        Page<Event> eventPage = eventRepository.findAllByEventDateGreaterThanEqualAndIsLiveTrueOrderByEventDateTimeAsc(utcToday, pageable);
        List<EventResponse> content = eventPage.getContent()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        PageResponse<EventResponse> response = new PageResponse<>();
        response.setContent(content);
        response.setPage(eventPage.getNumber());
        response.setSize(eventPage.getSize());
        response.setTotalElements(eventPage.getTotalElements());
        response.setTotalPages(eventPage.getTotalPages());
        response.setHasNext(eventPage.hasNext());
        response.setHasPrevious(eventPage.hasPrevious());
        return response;
    }

    public EventResponse getEvent(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        return toResponse(event);
    }

    public List<EventResponse> findByStatus(EventStatus status) {
        return eventRepository.findAllByStatusOrderByCreatedAtAsc(status)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventResponse approve(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        event.setStatus(EventStatus.APPROVED);
        event.setLive(true);
        Event saved = eventRepository.save(event);
        return toResponse(saved);
    }

    @Transactional
    public EventResponse reject(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        event.setStatus(EventStatus.REJECTED);
        event.setLive(false);
        Event saved = eventRepository.save(event);
        return toResponse(saved);
    }

    private void applyEventRequest(Event event, EventRequest request, boolean isCreate) {
        validateRequest(request);
        LocalTime computedEndTime = request.getEndTime();
        if (computedEndTime == null && request.getStartTime() != null && request.getEventLengthHours() != null) {
            computedEndTime = request.getStartTime().plusHours(request.getEventLengthHours());
        }

        event.setTitle(request.getTitle().trim());
        event.setDescription(request.getAbout().trim());
        event.setAbout(request.getAbout().trim());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEventLengthHours(request.getEventLengthHours());
        event.setEndTime(computedEndTime);
        event.setEventDateTime(request.getEventDate().atTime(request.getStartTime()));
        String flyer = request.getFlyerUrl();
        event.setFlyerUrl(flyer == null ? "" : flyer.trim());
        if (isCreate) {
            event.setLive(false);
            event.setStatus(EventStatus.PENDING_REVIEW);
        } else {
            event.setLive(Boolean.TRUE.equals(request.getLive()));
        }
        event.setVenueName(request.getVenueName().trim());
        event.setVenueAddress(request.getVenueAddress().trim());
        event.setVenueZipCode(request.getVenueZipCode().trim());
        event.setVenueState(request.getVenueState().trim());
        event.setVenueCountry(request.getVenueCountry().trim());
        event.setVenueCity(request.getVenueCity().trim());
        event.setCapacity(request.getCapacity());
        event.setAllAges(request.getAllAges());
        event.setAlcohol(request.getAlcohol());
        event.setAgeRestriction(Boolean.TRUE.equals(request.getAllAges()) ? "ALL" : "18+");
        applyGenres(event, request.getGenres());
        applyPerformers(event, request.getPerformers());
        if (request.getEventDate() != null && request.getStartTime() != null) {
            event.setEventDateTime(request.getEventDate().atTime(request.getStartTime()));
        }
    }

    private EventResponse toResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setFlyerUrl(s3Service.generateSignedGetUrl(event.getFlyerUrl()));
        response.setEventDate(event.getEventDate());
        response.setStartTime(event.getStartTime());
        response.setEventLengthHours(event.getEventLengthHours());
        response.setEndTime(event.getEndTime());
        response.setLive(event.getLive());
        response.setEventDateTime(event.getEventDateTime());
        response.setVenueName(event.getVenueName());
        response.setVenueAddress(event.getVenueAddress());
        response.setVenueZipCode(event.getVenueZipCode());
        response.setVenueState(event.getVenueState());
        response.setVenueCountry(event.getVenueCountry());
        response.setVenueCity(event.getVenueCity());
        response.setAbout(event.getAbout());
        response.setCapacity(event.getCapacity());
        response.setAllAges(event.getAllAges());
        response.setAlcohol(event.getAlcohol());
        response.setAgeRestriction(event.getAgeRestriction());
        response.setStatus(event.getStatus());
        if (event.getGenres() != null) {
            List<String> genreLabels = event.getGenres().stream()
                    .sorted(Comparator.comparing(EventGenre::getOrderIndex))
                    .map(EventGenre::getLabel)
                    .collect(Collectors.toList());
            response.setGenres(genreLabels);
        }
        if (event.getPerformers() != null) {
            List<EventResponse.PerformerResponse> performerResponses = event.getPerformers().stream()
                    .map(performer -> {
                        EventResponse.PerformerResponse dto = new EventResponse.PerformerResponse();
                        dto.setId(performer.getId());
                        dto.setPerformerName(performer.getPerformerName());
                        dto.setGenre1(performer.getGenre1());
                        dto.setGenre2(performer.getGenre2());
                        dto.setGenre3(performer.getGenre3());
                        dto.setPerformerLink(performer.getPerformerLink());
                        return dto;
                    })
                    .collect(Collectors.toList());
            response.setPerformers(performerResponses);
        }
        if (event.getOwner() != null) {
            response.setOwnerId(event.getOwner().getId());
            response.setOwnerName(event.getOwner().getFullName());
        }
        return response;
    }

    private void validateRequest(EventRequest request) {
        if (request == null) {
            throw new ValidationException("Invalid event request");
        }
        if (request.getTitle() != null && request.getTitle().trim().isEmpty()) {
            throw new ValidationException("title", "Title cannot be empty");
        }
        if (request.getAbout() != null && request.getAbout().trim().isEmpty()) {
            throw new ValidationException("about", "Description cannot be empty");
        }
        if (request.getEventDate() != null && request.getEventDate().isBefore(LocalDate.now())) {
            throw new ValidationException("Event date cannot be in the past");
        }
        if (request.getEventLengthHours() != null && request.getEventLengthHours() < 1) {
            throw new ValidationException("Event must last at least 1 hour");
        }
        if (request.getEventDate() != null && request.getStartTime() != null) {
            if (request.getEventDate().isEqual(LocalDate.now()) && request.getStartTime().isBefore(LocalTime.now())) {
                throw new ValidationException("startTime", "Start time cannot be earlier than the current time");
            }
            LocalTime computedEnd = request.getEndTime();
            if (computedEnd == null && request.getEventLengthHours() != null) {
                computedEnd = request.getStartTime().plusHours(request.getEventLengthHours());
            }
            if (computedEnd != null && computedEnd.isBefore(request.getStartTime())) {
                throw new ValidationException("Invalid time range");
            }
        }
        if (request.getVenueZipCode() != null && !request.getVenueZipCode().trim().matches("\\d{5}")) {
            throw new ValidationException("venueZipCode", "Postal code must be exactly 5 digits");
        }
        if (request.getGenres() == null || request.getGenres().isEmpty()) {
            throw new ValidationException("genres", "At least one genre is required");
        }
        for (String genre : request.getGenres()) {
            if (!GenreCatalog.isAllowed(genre)) {
                throw new ValidationException("genres", "Invalid genre: " + genre);
            }
        }
    }

    private void applyGenres(Event event, List<String> genres) {
        event.getGenres().clear();
        if (genres == null || genres.isEmpty()) {
            return;
        }
        List<EventGenre> eventGenres = new ArrayList<>();
        for (int i = 0; i < genres.size(); i++) {
            String label = genres.get(i);
            if (label == null) {
                continue;
            }
            label = label.trim();
            if (label.isEmpty()) {
                continue;
            }
            if (!GenreCatalog.isAllowed(label)) {
                continue;
            }
            EventGenre genre = new EventGenre();
            genre.setEvent(event);
            genre.setLabel(label);
            genre.setOrderIndex(i);
            eventGenres.add(genre);
        }
        event.getGenres().addAll(eventGenres);
    }

    private void applyPerformers(Event event, List<EventRequest.PerformerRequest> performers) {
        event.getPerformers().clear();
        if (performers == null || performers.isEmpty()) {
            return;
        }
        List<EventPerformer> eventPerformers = new ArrayList<>();
        for (EventRequest.PerformerRequest performerRequest : performers) {
            if (performerRequest == null) {
                continue;
            }
            String performerName = performerRequest.getPerformerName();
            if (performerName == null || performerName.trim().isEmpty()) {
                continue;
            }
            EventPerformer performer = new EventPerformer();
            performer.setEvent(event);
            performer.setPerformerName(performerName.trim());
            performer.setGenre1(trimToNull(performerRequest.getGenre1()));
            performer.setGenre2(trimToNull(performerRequest.getGenre2()));
            performer.setGenre3(trimToNull(performerRequest.getGenre3()));
            performer.setPerformerLink(trimToNull(performerRequest.getPerformerLink()));
            eventPerformers.add(performer);
        }
        event.getPerformers().addAll(eventPerformers);
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

package com.anok.config;

import com.anok.model.*;
import com.anok.repository.EventRepository;
import com.anok.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

/**
 * Seeds sample events for local development and testing.
 * Only runs in non-production environments.
 */
@Component
@Profile("!prod")
@Order(3) // Run after users are seeded
public class SampleEventSeeder implements CommandLineRunner {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public SampleEventSeeder(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        // Get demo user as event owner
        User demoOwner = userRepository.findByEmailNormalized("demo@anok.com")
                .orElseThrow(() -> new RuntimeException("Demo user not found"));

        User raulOwner = userRepository.findByEmailNormalized("rulodipu@hotmail.com")
                .orElseThrow(() -> new RuntimeException("Raul user not found"));

        // Create approved event
        createApprovedEvent(demoOwner);

        // Create pending review event
        createPendingEvent(raulOwner);
    }

    private void createApprovedEvent(User owner) {
        UUID eventId = UUID.fromString("b0000000-0000-0000-0000-000000000001");

        if (eventRepository.findById(eventId).isPresent()) {
            return;
        }

        Event event = new Event();
        event.setId(eventId);
        event.setOwner(owner);
        event.setTitle("Summer Music Festival 2025");
        event.setDescription("Join us for an amazing night of live music!");
        event.setEventDateTime(LocalDateTime.of(2030, 7, 15, 20, 0));
        event.setEventDate(LocalDate.of(2030, 7, 15));
        event.setStartTime(LocalTime.of(20, 0));
        event.setEndTime(LocalTime.of(23, 0));
        event.setEventLengthHours(3);
        event.setFlyerUrl("https://d1kkytjp746b3d.cloudfront.net/uploads/98a67b3d-6f63-4d47-ba0a-683f92b08bef.jpg");
        event.setLive(true);
        event.setStatus(EventStatus.APPROVED);
        event.setAbout("Experience the best local talent in an intimate venue. This event features multiple genres including rock, electronic, and indie music. Food and drinks will be available for purchase.");
        event.setAllAges(false);
        event.setAlcohol(true);
        event.setVenueName("The Underground");
        event.setVenueAddress("123 Main Street, Downtown, City, State 12345");
        event.setVenueZipCode("12345");
        event.setVenueState("State");
        event.setVenueCountry("USA");
        event.setCapacity(200);

        // Add genres
        addGenre(event, "Electronic", 0);
        addGenre(event, "Rock", 1);
        addGenre(event, "Indie", 2);

        // Add performers
        addPerformer(event, "The Electric Waves", "Electronic", "Dance", "https://example.com/electricwaves");
        addPerformer(event, "Indie Soul Collective", "Indie", "Soul", "https://example.com/indiesoul");
        addPerformer(event, "Rock Revolution", "Rock", "Alternative", "https://example.com/rockrevolution");

        eventRepository.save(event);
    }

    private void createPendingEvent(User owner) {
        UUID eventId = UUID.fromString("b0000000-0000-0000-0000-000000000002");

        if (eventRepository.findById(eventId).isPresent()) {
            return;
        }

        Event event = new Event();
        event.setId(eventId);
        event.setOwner(owner);
        event.setTitle("Jazz Night at the Blue Note");
        event.setDescription("An evening of smooth jazz and great vibes!");
        event.setEventDateTime(LocalDateTime.of(2030, 8, 20, 19, 30));
        event.setEventDate(LocalDate.of(2030, 8, 20));
        event.setStartTime(LocalTime.of(19, 30));
        event.setEndTime(LocalTime.of(22, 30));
        event.setEventLengthHours(3);
        event.setFlyerUrl("https://d1kkytjp746b3d.cloudfront.net/uploads/413bf26c-1f66-4389-9eb3-5fd1af1f5897.jpg");
        event.setLive(false);
        event.setStatus(EventStatus.PENDING_REVIEW);
        event.setAbout("Join us for an intimate jazz performance featuring local and touring musicians. The Blue Note provides the perfect ambiance for a sophisticated evening of music. Light refreshments and a full bar available.");
        event.setAllAges(false);
        event.setAlcohol(true);
        event.setVenueName("The Blue Note Jazz Club");
        event.setVenueAddress("456 Jazz Avenue, Arts District, City, State 67890");
        event.setVenueZipCode("67890");
        event.setVenueState("State");
        event.setVenueCountry("USA");
        event.setCapacity(150);

        // Add genres
        addGenre(event, "Jazz", 0);
        addGenre(event, "Soul", 1);
        addGenre(event, "Blues", 2);

        // Add performers
        addPerformer(event, "The Jazz Quartet", "Jazz", "Bebop", "https://example.com/jazzquartet");
        addPerformer(event, "Sarah Blue", "Soul", "Jazz", "https://example.com/sarahblue");
        addPerformer(event, "The Blue Notes", "Blues", "Jazz", "https://example.com/bluenotes");

        eventRepository.save(event);
    }

    private void addGenre(Event event, String label, int orderIndex) {
        EventGenre genre = new EventGenre();
        genre.setEvent(event);
        genre.setLabel(label);
        genre.setOrderIndex(orderIndex);
        event.getGenres().add(genre);
    }

    private void addPerformer(Event event, String name, String genre1, String genre2, String link) {
        EventPerformer performer = new EventPerformer();
        performer.setEvent(event);
        performer.setPerformerName(name);
        performer.setGenre1(genre1);
        performer.setGenre2(genre2);
        performer.setPerformerLink(link);
        event.getPerformers().add(performer);
    }
}

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

    private static final String[] BASE_FLYERS = {
            "https://d1kkytjp746b3d.cloudfront.net/uploads/98a67b3d-6f63-4d47-ba0a-683f92b08bef.jpg",
            "https://d1kkytjp746b3d.cloudfront.net/uploads/413bf26c-1f66-4389-9eb3-5fd1af1f5897.jpg",
            "https://d1kkytjp746b3d.cloudfront.net/uploads/c8493201-f068-43eb-9b3d-8c9e32ddb1e3.jpg",
            "https://d1kkytjp746b3d.cloudfront.net/uploads/fc76394a-cc4d-4e88-896f-122487459e74.jpg",
            "https://d1kkytjp746b3d.cloudfront.net/uploads/26fd07cc-edfd-4009-a146-ffb1c60296cc.jpg",
            "https://d1kkytjp746b3d.cloudfront.net/uploads/f3db8688-29d9-4a72-91bf-e826aaf49c09.avif"
    };

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

        System.out.println("========================================");
        System.out.println("Seeding events by use case...");
        System.out.println("========================================");

        // USE CASE 1: Currently happening event (updates to today's date on each server restart)
        System.out.println("✓ Creating 1 'LIVE NOW' event for today");
        createTodayEvent(demoOwner);
        System.out.println("✓ Creating 1 'TODAY (STARTED EARLIER)' event");
        createTodayStartedEvent(demoOwner);
        System.out.println("✓ Creating 1 'TODAY (UPCOMING IN HOURS)' event");
        createTodayUpcomingEvent(demoOwner);

        // USE CASE 2: Already approved events (for infinite scroll testing)
        // Page size is 20, so 35 events = 2 full pages (20 + 15)
        System.out.println("✓ Creating 35 approved events for infinite scroll testing");
        for (int i = 1; i <= 35; i++) {
            createEvent(i, demoOwner, EventStatus.APPROVED, true, 2040);
        }

        // USE CASE 3: Events that need approval (for admin review testing)
        System.out.println("✓ Creating 10 pending events for admin approval testing");
        for (int i = 36; i <= 45; i++) {
            createEvent(i, raulOwner, EventStatus.PENDING_REVIEW, false, 2040);
        }

        System.out.println("========================================");
        System.out.println("Total events seeded: 48 (3 today variants + 35 approved + 10 pending)");
        System.out.println("========================================");
    }

    private void createTodayEvent(User owner) {
        UUID eventId = UUID.fromString("a0000000-0000-0000-0000-000000000000");

        // Delete existing "today" event if it exists (so we can update the date)
        eventRepository.findById(eventId).ifPresent(eventRepository::delete);

        LocalDate today = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        int currentHour = currentTime.getHour();

        // If before 8 PM, start at 8 PM. If after 8 PM but before 9 PM, start at next hour. Otherwise start at 8 PM.
        int startHour = (currentHour < 20) ? 20 : (currentHour < 21 ? currentHour + 1 : 20);
        int endHour = Math.min(startHour + 3, 23);

        Event event = new Event();
        event.setId(eventId);
        event.setOwner(owner);
        event.setTitle("🔴 HAPPENING TODAY - Live Music Night");
        event.setDescription("Currently happening event! This event date updates automatically on server restart to always be TODAY.");
        event.setEventDateTime(LocalDateTime.of(today, LocalTime.of(startHour, 0)));
        event.setEventDate(today);
        event.setStartTime(LocalTime.of(startHour, 0));
        event.setEndTime(LocalTime.of(endHour, 0));
        event.setEventLengthHours(endHour - startHour);
        event.setFlyerUrl(flyerForIndex(0));
        event.setLive(true);
        event.setStatus(EventStatus.APPROVED);
        event.setAbout("This is a test event for 'currently happening' functionality. The date automatically updates to today's date " +
                "every time the server restarts. Perfect for testing event filtering by date and 'happening now' features. " +
                "Features live music, full bar, and great vibes!");
        event.setAllAges(true);
        event.setAlcohol(true);
        event.setVenueName("The Main Stage");
        event.setVenueAddress("100 Live Music Blvd, Downtown, Austin, TX");
        event.setVenueZipCode("78701");
        event.setVenueState("TX");
        event.setVenueCountry("USA");
        event.setCapacity(500);

        // Add genres
        addGenre(event, "Live", 0);
        addGenre(event, "Electronic", 1);
        addGenre(event, "Rock", 2);

        // Add performers
        addPerformer(event, "The Today Show Band", "Live", "Electronic", "Rock", "https://example.com/todayband");
        addPerformer(event, "Special Guest DJ", "Electronic", "Dance", null, "https://example.com/specialdj");

        eventRepository.save(event);
    }

    private void createEvent(int index, User owner, EventStatus status, boolean isLive, int year) {
        // Generate UUID based on index
        UUID eventId = UUID.fromString(String.format("b0000000-0000-0000-0000-%012d", index));

        // Replace existing seeded event so updates to seed data always apply
        eventRepository.findById(eventId).ifPresent(eventRepository::delete);

        // Sample data arrays for variety
        String[] titles = {
            "Summer Music Festival", "Jazz Night", "Electronic Dreams", "Rock Revolution",
            "Indie Showcase", "Hip Hop Block Party", "Classical Evening", "EDM Rave",
            "Folk Music Gathering", "Metal Mayhem", "Blues & Soul Night", "Pop Extravaganza",
            "Reggae Vibes", "Country Music Fest", "Alternative Rock Show", "Latin Beats Festival"
        };

        String[] venues = {
            "The Underground", "Blue Note Club", "Electric Arena", "The Warehouse",
            "Riverside Theatre", "Downtown Stadium", "Jazz Lounge", "The Basement",
            "Open Air Pavilion", "City Hall Auditorium", "Sunset Beach Stage", "The Loft"
        };

        String[] cities = {
            "Austin", "Nashville", "Los Angeles", "New York", "Chicago",
            "Seattle", "Miami", "Portland", "Denver", "Atlanta"
        };

        String[][] genreSets = {
            {"Electronic", "Dance", "Techno"},
            {"Rock", "Alternative", "Indie"},
            {"Jazz", "Blues", "Soul"},
            {"Hip Hop", "Rap", "R&B"},
            {"Pop", "Dance", "Electronic"},
            {"Metal", "Hard Rock", "Punk"},
            {"Folk", "Acoustic", "Singer-Songwriter"},
            {"Country", "Americana", "Bluegrass"},
            {"Reggae", "Ska", "Dub"},
            {"Classical", "Orchestra", "Chamber"}
        };

        // Use modulo to cycle through arrays
        int titleIdx = index % titles.length;
        int venueIdx = index % venues.length;
        int cityIdx = index % cities.length;
        int genreIdx = index % genreSets.length;

        String city = cities[cityIdx];
        String venue = venues[venueIdx];

        // Create title based on use case
        String title;
        if (status == EventStatus.APPROVED && isLive) {
            // Approved events for infinite scroll testing
            title = "[APPROVED] " + titles[titleIdx] + " 2040";
        } else {
            // Pending events that need approval
            title = "[NEEDS APPROVAL] " + titles[titleIdx] + " 2040";
        }

        String[] genres = genreSets[genreIdx];

        // Vary event dates across different months
        int month = 7 + (index % 6); // July to December
        int day = 1 + (index % 28); // 1-28 to avoid invalid dates
        int hour = 18 + (index % 3); // 6 PM to 8 PM (so end time is 9 PM to 11 PM)

        // Create description based on use case
        String description;
        String about;
        if (status == EventStatus.APPROVED && isLive) {
            description = "Approved and live! Join us for an amazing night of " + genres[0].toLowerCase() + " music in " + year + "!";
            about = "This is an approved event for testing infinite scroll functionality. " +
                    "Experience great " + genres[0].toLowerCase() + " music in an intimate venue. " +
                    "This event features multiple talented artists. Food and drinks available.";
        } else {
            description = "Awaiting admin approval. An evening of " + genres[0].toLowerCase() + " music!";
            about = "This event is pending admin review and approval. Once approved, it will be visible to the public. " +
                    "Features " + genres[0].toLowerCase() + " music with local and touring artists. " +
                    "Full bar and refreshments available.";
        }

        Event event = new Event();
        event.setId(eventId);
        event.setOwner(owner);
        event.setTitle(title);
        event.setDescription(description);
        event.setEventDateTime(LocalDateTime.of(year, month, day, hour, 0));
        event.setEventDate(LocalDate.of(year, month, day));
        event.setStartTime(LocalTime.of(hour, 0));
        event.setEndTime(LocalTime.of(hour + 3, 0)); // End time: 9 PM to 11 PM
        event.setEventLengthHours(3);
        // Use remaining base flyers first, then fall back to picsum for additional events
        event.setFlyerUrl(flyerForIndex(index + 2));
        event.setLive(isLive);
        event.setStatus(status);
        event.setAbout(about);
        event.setAllAges(index % 3 == 0); // Every 3rd event is all ages
        event.setAlcohol(index % 3 != 0); // Alcohol when not all ages
        event.setVenueName(venue);
        event.setVenueAddress((100 + index) + " Main Street, " + city + ", TX");
        event.setVenueZipCode(String.format("78%03d", index % 1000));
        event.setVenueState("TX");
        event.setVenueCountry("USA");
        event.setCapacity(100 + (index * 10 % 300)); // Vary capacity 100-400

        // Add genres
        for (int i = 0; i < genres.length; i++) {
            addGenre(event, genres[i], i);
        }

        // Add performers
        String performerPrefix = index % 2 == 0 ? "The" : "";
        addPerformer(event, performerPrefix + " " + genres[0] + " Collective",
                genres[0], genres[1], null, "https://example.com/performer" + index);

        eventRepository.save(event);
    }

    private void createTodayStartedEvent(User owner) {
        UUID eventId = UUID.fromString("a0000000-0000-0000-0000-000000000001");
        eventRepository.findById(eventId).ifPresent(eventRepository::delete);

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now().withMinute(0).withSecond(0).withNano(0);
        int startHour = Math.max(now.getHour() - 2, 0); // started a couple of hours ago
        int endHour = Math.min(startHour + 3, 23);
        int length = Math.max(1, endHour - startHour);

        Event event = new Event();
        event.setId(eventId);
        event.setOwner(owner);
        event.setTitle("🟠 STARTED EARLIER - Afternoon Jam");
        event.setDescription("Already in progress today. Useful for testing 'happening now' logic.");
        event.setEventDateTime(LocalDateTime.of(today, LocalTime.of(startHour, 0)));
        event.setEventDate(today);
        event.setStartTime(LocalTime.of(startHour, 0));
        event.setEndTime(LocalTime.of(endHour, 0));
        event.setEventLengthHours(length);
        event.setFlyerUrl(flyerForIndex(1));
        event.setLive(true);
        event.setStatus(EventStatus.APPROVED);
        event.setAbout("An already-started event to verify that ongoing same-day events are surfaced.");
        event.setAllAges(true);
        event.setAlcohol(true);
        event.setVenueName("Afternoon Stage");
        event.setVenueAddress("300 Daylight Ave, Austin, TX");
        event.setVenueZipCode("78703");
        event.setVenueState("TX");
        event.setVenueCountry("USA");
        event.setCapacity(200);

        addGenre(event, "Rock", 0);
        addGenre(event, "Blues", 1);

        addPerformer(event, "Sunset Trio", "Rock", "Blues", null, "https://example.com/sunsettrio");

        eventRepository.save(event);
    }

    private void createTodayUpcomingEvent(User owner) {
        UUID eventId = UUID.fromString("a0000000-0000-0000-0000-000000000002");
        eventRepository.findById(eventId).ifPresent(eventRepository::delete);

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now().withMinute(0).withSecond(0).withNano(0);
        int startHour = Math.min(now.getHour() + 3, 22); // a few hours from now, leave room for end time
        int endHour = Math.min(startHour + 2, 23);
        int length = Math.max(1, endHour - startHour);

        Event event = new Event();
        event.setId(eventId);
        event.setOwner(owner);
        event.setTitle("🟢 TODAY LATER - Evening Showcase");
        event.setDescription("Upcoming later today. Good for testing that same-day future events are included.");
        event.setEventDateTime(LocalDateTime.of(today, LocalTime.of(startHour, 0)));
        event.setEventDate(today);
        event.setStartTime(LocalTime.of(startHour, 0));
        event.setEndTime(LocalTime.of(endHour, 0));
        event.setEventLengthHours(length);
        event.setFlyerUrl(flyerForIndex(2));
        event.setLive(true);
        event.setStatus(EventStatus.APPROVED);
        event.setAbout("A later-today event to validate pagination and filtering around same-day future start times.");
        event.setAllAges(false);
        event.setAlcohol(true);
        event.setVenueName("Evening Lounge");
        event.setVenueAddress("200 Sunset Blvd, Austin, TX");
        event.setVenueZipCode("78702");
        event.setVenueState("TX");
        event.setVenueCountry("USA");
        event.setCapacity(300);

        addGenre(event, "Indie", 0);
        addGenre(event, "Electronic", 1);

        addPerformer(event, "The Night Owls", "Indie", "Electronic", null, "https://example.com/nightowls");

        eventRepository.save(event);
    }

    private void addGenre(Event event, String label, int orderIndex) {
        EventGenre genre = new EventGenre();
        genre.setEvent(event);
        genre.setLabel(label);
        genre.setOrderIndex(orderIndex);
        event.getGenres().add(genre);
    }

    private void addPerformer(Event event, String name, String genre1, String genre2, String genre3, String link) {
        EventPerformer performer = new EventPerformer();
        performer.setEvent(event);
        performer.setPerformerName(name);
        performer.setGenre1(genre1);
        performer.setGenre2(genre2);
        performer.setGenre3(genre3);
        performer.setPerformerLink(link);
        event.getPerformers().add(performer);
    }

    private String flyerForIndex(int index) {
        if (index >= 0 && index < BASE_FLYERS.length) {
            return BASE_FLYERS[index];
        }
        // Deterministic Picsum fallback for variety when we exceed curated flyers
        return String.format("https://picsum.photos/seed/anok-%d/400/600", index);
    }
}

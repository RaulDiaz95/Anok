package com.anok.config;

import com.anok.model.Venue;
import com.anok.repository.VenueRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds sample venues so venue search can find the same names used by seeded events.
 * Only runs in non-production environments.
 */
@Component
@Profile("!prod")
@Order(4) // Run after events are seeded
public class SampleVenueSeeder implements CommandLineRunner {

    private final VenueRepository venueRepository;

    public SampleVenueSeeder(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    @Override
    public void run(String... args) {
        List<VenueSeed> seeds = List.of(
                new VenueSeed("The Main Stage", "100 Live Music Blvd", "78701", "Austin", "TX", "USA", 500),
                new VenueSeed("Evening Lounge", "200 Sunset Blvd", "78702", "Austin", "TX", "USA", 300),
                new VenueSeed("Afternoon Stage", "300 Daylight Ave", "78703", "Austin", "TX", "USA", 200),
                new VenueSeed("The Underground", "110 Main Street", "78704", "Austin", "TX", "USA", 250),
                new VenueSeed("Blue Note Club", "120 Main Street", "78705", "Austin", "TX", "USA", 180),
                new VenueSeed("Electric Arena", "130 Main Street", "78706", "Austin", "TX", "USA", 600),
                new VenueSeed("The Warehouse", "140 Main Street", "78707", "Austin", "TX", "USA", 400),
                new VenueSeed("Riverside Theatre", "150 Main Street", "78708", "Austin", "TX", "USA", 350),
                new VenueSeed("Downtown Stadium", "160 Main Street", "78709", "Austin", "TX", "USA", 1200),
                new VenueSeed("Jazz Lounge", "170 Main Street", "78710", "Austin", "TX", "USA", 150),
                new VenueSeed("The Basement", "180 Main Street", "78711", "Austin", "TX", "USA", 120),
                new VenueSeed("Open Air Pavilion", "190 Main Street", "78712", "Austin", "TX", "USA", 700),
                new VenueSeed("City Hall Auditorium", "200 Main Street", "78713", "Austin", "TX", "USA", 800),
                new VenueSeed("Sunset Beach Stage", "210 Main Street", "78714", "Austin", "TX", "USA", 650),
                new VenueSeed("The Loft", "220 Main Street", "78715", "Austin", "TX", "USA", 220)
        );

        for (VenueSeed seed : seeds) {
            seedVenue(seed);
        }
    }

    private void seedVenue(VenueSeed seed) {
        var existing = venueRepository
                .findByNameIgnoreCaseAndCityIgnoreCaseAndStateIgnoreCaseAndCountryIgnoreCase(
                        seed.name,
                        seed.city,
                        seed.state,
                        seed.country
                );
        if (existing.isPresent()) {
            Venue venue = existing.get();
            if (isBlank(venue.getAddress())) {
                venue.setAddress(seed.address);
            }
            if (isBlank(venue.getPostalCode())) {
                venue.setPostalCode(seed.postalCode);
            }
            if (venue.getCapacity() == null) {
                venue.setCapacity(seed.capacity);
            }
            if (Boolean.FALSE.equals(venue.getVerified())) {
                venue.setVerified(true);
            }
            if (Boolean.FALSE.equals(venue.getCreatedByAdmin())) {
                venue.setCreatedByAdmin(true);
            }
            venueRepository.save(venue);
            return;
        }
        Venue venue = new Venue();
        venue.setName(seed.name);
        venue.setAddress(seed.address);
        venue.setPostalCode(seed.postalCode);
        venue.setCity(seed.city);
        venue.setState(seed.state);
        venue.setCountry(seed.country);
        venue.setCapacity(seed.capacity);
        venue.setVerified(true);
        venue.setCreatedByAdmin(true);
        venueRepository.save(venue);
    }

    private record VenueSeed(String name, String address, String postalCode, String city, String state, String country, Integer capacity) {}

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}

package com.anok.validation;

import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;

public final class GenreCatalog {
    private static final Set<String> GENRES;

    static {
        Set<String> values = new LinkedHashSet<>();
        Collections.addAll(values,
                "Rock", "Pop", "Hip-Hop/Rap", "Classical", "Jazz",
                "Electronic", "Country", "Blues", "Reggae", "Folk",
                "R&B/Soul", "Gospel", "Funk", "World Music", "Opera"
        );
        GENRES = Collections.unmodifiableSet(values);
    }

    private GenreCatalog() {
    }

    public static Set<String> getAllowedGenres() {
        return GENRES;
    }

    public static boolean isAllowed(String genre) {
        return genre != null && GENRES.contains(genre.trim());
    }
}

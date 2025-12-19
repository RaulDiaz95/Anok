package com.anok.validation;

import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;

public final class GenreCatalog {
    private static final Set<String> GENRES;

    static {
        Set<String> values = new LinkedHashSet<>();
        Collections.addAll(values,
                "Pop", "Rock", "Hip-Hop", "Hip-Hop/Rap", "Rap", "Trap", "R&B", "R&B/Soul",
                "Electronic", "House", "Techno", "EDM", "Dance", "Drum & Bass", "Dubstep",
                "Trance", "Synthwave", "Ambient", "Experimental", "Industrial",
                "Reggaeton", "Latin", "Salsa", "Cumbia", "Banda",
                "K-pop", "J-pop",
                "Jazz", "Blues", "Soul", "Funk",
                "Classical", "Opera", "Chamber", "Symphonic",
                "Indie", "Alternative", "Folk", "Acoustic",
                "Metal", "Hard Rock", "Punk", "Emo", "Hardcore",
                "Country", "Americana",
                "World Music", "Afrobeats", "Dancehall", "Reggae",
                "Lo-fi", "Chillout"
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

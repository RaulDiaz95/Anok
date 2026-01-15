package com.anok.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;
import java.util.Set;

public class AllowedGenresValidator implements ConstraintValidator<AllowedGenres, List<String>> {

    private Set<String> allowed;

    @Override
    public void initialize(AllowedGenres constraintAnnotation) {
        this.allowed = GenreCatalog.getAllowedGenres();
    }

    @Override
    public boolean isValid(List<String> genres, ConstraintValidatorContext context) {
        if (genres == null || genres.isEmpty()) {
            return false;
        }
        for (String genre : genres) {
            if (genre == null) {
                return false;
            }
            String cleaned = genre.trim();
            if (cleaned.isEmpty()) {
                return false;
            }
            if (!allowed.contains(cleaned)) {
                return false;
            }
        }
        return true;
    }
}

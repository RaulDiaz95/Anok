package com.anok.exception;

public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(String field, String reason) {
        super(String.format("Validation failed for field '%s': %s", field, reason));
    }
}

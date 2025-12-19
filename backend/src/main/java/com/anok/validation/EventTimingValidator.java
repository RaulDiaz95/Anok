package com.anok.validation;

import com.anok.dto.EventRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;
import java.time.LocalTime;

public class EventTimingValidator implements ConstraintValidator<EventTimingValid, EventRequest> {

    @Override
    public boolean isValid(EventRequest request, ConstraintValidatorContext context) {
        if (request == null) {
            return true;
        }

        LocalDate date = request.getEventDate();
        LocalTime start = request.getStartTime();
        Integer length = request.getEventLengthHours();
        LocalTime end = request.getEndTime();

        boolean valid = true;
        context.disableDefaultConstraintViolation();

        if (date != null && date.isBefore(LocalDate.now())) {
            context.buildConstraintViolationWithTemplate("Event date cannot be in the past")
                    .addPropertyNode("eventDate").addConstraintViolation();
            valid = false;
        }

        if (length != null && length < 1) {
            context.buildConstraintViolationWithTemplate("Event must last at least 1 hour")
                    .addPropertyNode("eventLengthHours").addConstraintViolation();
            valid = false;
        }

        if (date != null && start != null) {
            if (date.isEqual(LocalDate.now()) && start.isBefore(LocalTime.now())) {
                context.buildConstraintViolationWithTemplate("Start time cannot be earlier than current time")
                        .addPropertyNode("startTime").addConstraintViolation();
                valid = false;
            }
        }

        if (start != null) {
            LocalTime computedEnd = end;
            if (computedEnd == null && length != null) {
                computedEnd = start.plusHours(length);
            }
            if (computedEnd != null && computedEnd.isBefore(start)) {
                context.buildConstraintViolationWithTemplate("Invalid time range")
                        .addPropertyNode("endTime").addConstraintViolation();
                valid = false;
            }
        }

        return valid;
    }
}

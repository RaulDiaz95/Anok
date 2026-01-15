package com.anok.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = PostalCodeValidator.class)
public @interface PostalCode {
    String message() default "Postal code must be exactly 5 digits";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

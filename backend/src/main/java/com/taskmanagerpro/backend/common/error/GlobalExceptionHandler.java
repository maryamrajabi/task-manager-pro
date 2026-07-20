package com.taskmanagerpro.backend.common.error;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.taskmanagerpro.backend.auth.exception.EmailAlreadyExistsException;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleEmailAlreadyExists(
            EmailAlreadyExistsException exception
    ) {
        HttpStatus status = HttpStatus.CONFLICT;

        ApiError error = new ApiError(
                status.value(),
                status.getReasonPhrase(),
                exception.getMessage(),
                Instant.now()
        );

        return ResponseEntity
                .status(status)
                .body(error);
    }




    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidation(
            MethodArgumentNotValidException exception
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        Map<String, String> fieldErrors = new LinkedHashMap<>();

        for (FieldError fieldError
                : exception.getBindingResult().getFieldErrors()) {

            String message = fieldError.getDefaultMessage();

            fieldErrors.putIfAbsent(
                    fieldError.getField(),
                    message != null ? message : "Invalid value"
            );
        }

        ValidationErrorResponse error =
                new ValidationErrorResponse(
                        status.value(),
                        status.getReasonPhrase(),
                        "Validation failed",
                        fieldErrors,
                        Instant.now()
                );

        return ResponseEntity
                .status(status)
                .body(error);
    }
}

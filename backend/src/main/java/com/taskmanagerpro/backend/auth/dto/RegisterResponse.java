package com.taskmanagerpro.backend.auth.dto;

import java.time.Instant;

public record RegisterResponse(
        Long id,
        String fullName,
        String email,
        Instant createdAt
) {
}

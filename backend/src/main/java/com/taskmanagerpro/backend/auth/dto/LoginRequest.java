package com.taskmanagerpro.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.taskmanagerpro.backend.auth.EmailNormalizer;

public record LoginRequest(

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    String email,

    @NotBlank(message = "Password is required")
    String password

) {

     public LoginRequest {
        email = EmailNormalizer.normalize(email);
    }

}
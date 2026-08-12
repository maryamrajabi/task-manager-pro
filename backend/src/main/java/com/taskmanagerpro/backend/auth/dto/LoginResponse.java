package com.taskmanagerpro.backend.auth.dto;

public record LoginResponse(

        Long id,

        String fullName,

        String email,

        String token

) {

}
package com.taskmanagerpro.backend.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.ExpiredJwtException;

import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService createJwtService() {

        JwtProperties properties = new JwtProperties();

        properties.setSecret(
                "change-this-secret-key-change-this-secret-key");

        properties.setExpiration(86400000);

        return new JwtService(properties);
    }


    @Test
    void shouldGenerateValidToken() {

        JwtService jwtService = createJwtService();

        String email = "test@example.com";

        String token = jwtService.generateToken(email);

        assertNotNull(token);

        assertTrue(token.split("\\.").length == 3);

        SecretKey key = Keys.hmacShaKeyFor(
                "change-this-secret-key-change-this-secret-key"
                        .getBytes());

        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        assertEquals(
                email,
                claims.getSubject()
        );
    }


    @Test
    void shouldExtractUsernameFromToken() {

        JwtService jwtService = createJwtService();

        String token = jwtService.generateToken(
                "maryam@example.com"
        );

        String username = jwtService.extractUsername(token);

        assertEquals(
                "maryam@example.com",
                username
        );
    }

    @Test
    void shouldRejectExpiredToken() {

        JwtProperties properties = new JwtProperties();

        properties.setSecret(
                "change-this-secret-key-change-this-secret-key"
        );

        properties.setExpiration(-1000);

        JwtService jwtService = new JwtService(properties);

        String token =
                jwtService.generateToken("expired@example.com");

        assertThrows(
                ExpiredJwtException.class,
                () -> jwtService.extractUsername(token)
        );
    }

}
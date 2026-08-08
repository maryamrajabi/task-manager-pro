package com.taskmanagerpro.backend.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {


    @Test
    void shouldGenerateValidToken() {

        JwtProperties properties = new JwtProperties();

        properties.setSecret(
                "change-this-secret-key-change-this-secret-key"
        );

        properties.setExpiration(86400000);


        JwtService jwtService = new JwtService(properties);


        String email = "test@example.com";


        String token = jwtService.generateToken(email);


        assertNotNull(token);

        assertTrue(token.split("\\.").length == 3);


        SecretKey key = Keys.hmacShaKeyFor(
                properties.getSecret().getBytes()
        );


        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();


        assertEquals(email, claims.getSubject());

    }

}
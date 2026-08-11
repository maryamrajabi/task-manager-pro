package com.taskmanagerpro.backend.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.never;

import io.jsonwebtoken.JwtException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void validToken_shouldAuthenticateRequest() throws Exception {

        String token = "valid-token";
        String email = "jwt.demo@example.com";

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User
                        .withUsername(email)
                        .password("ignored")
                        .authorities("ROLE_USER")
                        .build();

        when(request.getHeader("Authorization"))
                .thenReturn("Bearer " + token);

        when(jwtService.extractUsername(token))
                .thenReturn(email);

        when(userDetailsService.loadUserByUsername(email))
                .thenReturn(userDetails);

        jwtAuthenticationFilter.doFilter(
                request,
                response,
                filterChain
        );

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        assertNotNull(authentication);

        assertTrue(authentication.isAuthenticated());

        assertEquals(
                email,
                authentication.getName()
        );

        verify(jwtService)
                .extractUsername(token);

        verify(userDetailsService)
                .loadUserByUsername(email);

        verify(filterChain)
                .doFilter(request, response);
    }

    @Test
    void invalidToken_shouldReturnUnauthorized() throws Exception {

        String token = "invalid-token";

        when(request.getHeader("Authorization"))
                .thenReturn("Bearer " + token);

        when(jwtService.extractUsername(token))
                .thenThrow(new JwtException("Invalid token"));

        jwtAuthenticationFilter.doFilter(
                request,
                response,
                filterChain
        );

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        assertNull(authentication);

        verify(response)
                .sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Invalid or expired token"
                );

        verify(filterChain, never())
                .doFilter(request, response);
    }

    @Test
    void missingAuthorizationHeader_shouldContinueFilterChain() throws Exception {

        when(request.getHeader("Authorization"))
                .thenReturn(null);

        jwtAuthenticationFilter.doFilter(
                request,
                response,
                filterChain
        );

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        assertNull(authentication);

        verify(jwtService, never())
                .extractUsername(org.mockito.ArgumentMatchers.anyString());

        verify(userDetailsService, never())
                .loadUserByUsername(org.mockito.ArgumentMatchers.anyString());

        verify(filterChain)
                .doFilter(request, response);
    }

    @Test
    void nonBearerAuthorizationHeader_shouldContinueFilterChain() throws Exception {

        when(request.getHeader("Authorization"))
                .thenReturn("Basic abc123");

        jwtAuthenticationFilter.doFilter(
                request,
                response,
                filterChain
        );

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        assertNull(authentication);

        verify(jwtService, never())
                .extractUsername(org.mockito.ArgumentMatchers.anyString());

        verify(userDetailsService, never())
                .loadUserByUsername(org.mockito.ArgumentMatchers.anyString());

        verify(filterChain)
                .doFilter(request, response);
    }

}
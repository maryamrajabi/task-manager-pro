package com.taskmanagerpro.backend.auth;

import org.mockito.ArgumentCaptor;
import com.taskmanagerpro.backend.auth.dto.RegisterResponse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.taskmanagerpro.backend.auth.dto.RegisterRequest;
import com.taskmanagerpro.backend.auth.exception.EmailAlreadyExistsException;
import com.taskmanagerpro.backend.user.User;
import com.taskmanagerpro.backend.user.UserRepository;

import java.util.Optional;

import com.taskmanagerpro.backend.auth.dto.LoginResponse;
import com.taskmanagerpro.backend.auth.dto.LoginRequest;
import com.taskmanagerpro.backend.auth.exception.InvalidCredentialsException;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_whenEmailAlreadyExists_throwsException() {
        RegisterRequest request = new RegisterRequest(
                "Maryam Rajabi",
                "MARYAM@EXAMPLE.COM",
                "MyPassword123"
        );

        when(userRepository.existsByEmail("maryam@example.com"))
                .thenReturn(true);

        EmailAlreadyExistsException exception = assertThrows(
                EmailAlreadyExistsException.class,
                () -> authService.register(request)
        );

        assertEquals(
                "An account already exists for email: maryam@example.com",
                exception.getMessage()
        );

        verify(userRepository)
                .existsByEmail("maryam@example.com");

        verifyNoInteractions(passwordEncoder);

        verify(userRepository, never())
                .save(any(User.class));
    }

    @Test
    void register_whenRequestIsValid_savesUserAndReturnsResponse() {
        RegisterRequest request = new RegisterRequest(
                "  Maryam Rajabi  ",
                "MARYAM@EXAMPLE.COM",
                "MyPassword123"
        );

        when(userRepository.existsByEmail("maryam@example.com"))
                .thenReturn(false);

        when(passwordEncoder.encode("MyPassword123"))
                .thenReturn("{bcrypt}hashed-password");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        RegisterResponse response =
                authService.register(request);

        assertEquals(
                "Maryam Rajabi",
                response.fullName()
        );

        assertEquals(
                "maryam@example.com",
                response.email()
        );

        verify(passwordEncoder)
                .encode("MyPassword123");

//         verify(userRepository)
//                 .save(any(User.class));

        ArgumentCaptor<User> userCaptor =
                ArgumentCaptor.forClass(User.class);

        verify(userRepository)
                .save(userCaptor.capture());

        User savedUser = userCaptor.getValue();

        assertEquals(
                "Maryam Rajabi",
                savedUser.getFullName()
        );

        assertEquals(
                "maryam@example.com",
                savedUser.getEmail()
        );

        assertEquals(
                "{bcrypt}hashed-password",
                savedUser.getPasswordHash()
        );

    }

    @Test
    void login_shouldThrowInvalidCredentials_whenEmailDoesNotExist() {
        LoginRequest request = new LoginRequest(
            " Missing@Example.com ",
            "password123"
        );

        when(userRepository.findByEmail("missing@example.com"))
            .thenReturn(Optional.empty());

        assertThrows(
            InvalidCredentialsException.class,
            () -> authService.login(request)
        );

        verify(userRepository).findByEmail("missing@example.com");
        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void login_shouldThrowInvalidCredentials_whenPasswordIsIncorrect() {
        LoginRequest request = new LoginRequest(
            " Maryam@Example.com ",
            "wrong-password"
        );

        User user = new User(
            "Maryam Rajabi",
            "maryam@example.com",
            "{bcrypt}stored-password-hash"
        );

        when(userRepository.findByEmail("maryam@example.com"))
            .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
            "wrong-password",
            "{bcrypt}stored-password-hash"
        )).thenReturn(false);

        assertThrows(
            InvalidCredentialsException.class,
            () -> authService.login(request)
        );

        verify(userRepository).findByEmail("maryam@example.com");

        verify(passwordEncoder).matches(
            "wrong-password",
            "{bcrypt}stored-password-hash"
        );
    }

    @Test
    void login_shouldReturnUser_whenCredentialsAreValid() {
        LoginRequest request = new LoginRequest(
            " MARYAM@EXAMPLE.COM ",
            "password123"
        );

        User user = new User(
            "Maryam Rajabi",
            "maryam@example.com",
            "{bcrypt}stored-password-hash"
        );

        when(userRepository.findByEmail("maryam@example.com"))
            .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
            "password123",
            "{bcrypt}stored-password-hash"
        )).thenReturn(true);

        LoginResponse response = authService.login(request);

        assertEquals(
            "Maryam Rajabi",
            response.fullName()
        );

        assertEquals(
            "maryam@example.com",
            response.email()
        );

        verify(userRepository)
            .findByEmail("maryam@example.com");

        verify(passwordEncoder)
            .matches(
                "password123",
                "{bcrypt}stored-password-hash"
            );
    }

}

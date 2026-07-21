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
}

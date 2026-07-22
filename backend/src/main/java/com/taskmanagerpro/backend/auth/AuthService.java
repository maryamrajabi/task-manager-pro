package com.taskmanagerpro.backend.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskmanagerpro.backend.auth.dto.RegisterRequest;
import com.taskmanagerpro.backend.auth.dto.RegisterResponse;
import com.taskmanagerpro.backend.auth.exception.EmailAlreadyExistsException;
import com.taskmanagerpro.backend.user.User;
import com.taskmanagerpro.backend.user.UserRepository;

import com.taskmanagerpro.backend.auth.dto.LoginRequest;
import com.taskmanagerpro.backend.auth.dto.LoginResponse;
import com.taskmanagerpro.backend.auth.exception.InvalidCredentialsException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String normalizedFullName = request.fullName().trim();
        String normalizedEmail = EmailNormalizer.normalize(request.email());

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyExistsException(normalizedEmail);
        }

        String passwordHash = passwordEncoder.encode(
                request.password()
        );

        User user = new User(
                normalizedFullName,
                normalizedEmail,
                passwordHash
        );

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String normalizedEmail = EmailNormalizer.normalize(request.email());

        User user = userRepository.findByEmail(normalizedEmail)
            .orElseThrow(InvalidCredentialsException::new);

        boolean passwordMatches = passwordEncoder.matches(
            request.password(),
            user.getPasswordHash()
        );

        if (!passwordMatches) {
            throw new InvalidCredentialsException();
        }

        return new LoginResponse(
            user.getId(),
            user.getFullName(),
            user.getEmail()
        );
    }
}

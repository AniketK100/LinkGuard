package com.linkguard.auth;

import com.linkguard.auth.dto.AuthResponse;
import com.linkguard.auth.dto.LoginRequest;
import com.linkguard.auth.dto.RegisterRequest;
import com.linkguard.auth.dto.UserSummaryDto;
import com.linkguard.auth.entity.Role;
import com.linkguard.auth.entity.User;
import com.linkguard.auth.entity.UserStatus;
import com.linkguard.auth.repository.RefreshTokenRepository;
import com.linkguard.auth.repository.UserRepository;
import com.linkguard.auth.security.JwtTokenProvider;
import com.linkguard.auth.service.AuthServiceImpl;
import com.linkguard.common.exception.BadRequestException;
import com.linkguard.common.exception.UnauthorizedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("John Doe")
                .email("john@example.com")
                .passwordHash("hashedPassword")
                .role(Role.USER)
                .status(UserStatus.ACTIVE)
                .build();
    }

    @Test
    void testRegisterUserSuccess() {
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "password123");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        UserSummaryDto response = authService.register(request);

        assertNotNull(response);
        assertEquals("John Doe", response.getName());
        assertEquals("john@example.com", response.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUserDuplicateEmailThrowsBadRequest() {
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "password123");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("john@example.com", "password123");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(true);
        when(tokenProvider.generateAccessToken(any())).thenReturn("mockAccessToken");
        when(tokenProvider.generateRefreshToken()).thenReturn("mockRefreshToken");
        when(tokenProvider.hashToken(anyString())).thenReturn("hashedRefreshToken");
        when(tokenProvider.getRefreshExpirationInMs()).thenReturn(604800000L);
        when(tokenProvider.getAccessExpirationInSeconds()).thenReturn(900L);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mockAccessToken", response.getAccessToken());
        assertEquals("mockRefreshToken", response.getRefreshToken());
        verify(refreshTokenRepository, times(1)).save(any());
    }

    @Test
    void testLoginInvalidPasswordThrowsUnauthorized() {
        LoginRequest request = new LoginRequest("john@example.com", "wrongPassword");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }
}

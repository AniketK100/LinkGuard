package com.linkguard.auth.service;

import com.linkguard.auth.dto.*;
import com.linkguard.auth.entity.RefreshToken;
import com.linkguard.auth.entity.Role;
import com.linkguard.auth.entity.User;
import com.linkguard.auth.entity.UserStatus;
import com.linkguard.auth.repository.RefreshTokenRepository;
import com.linkguard.auth.repository.UserRepository;
import com.linkguard.auth.security.JwtTokenProvider;
import com.linkguard.auth.security.UserPrincipal;
import com.linkguard.common.exception.BadRequestException;
import com.linkguard.common.exception.ResourceNotFoundException;
import com.linkguard.common.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Override
    @Transactional
    public UserSummaryDto register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email address is already in use");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .status(UserStatus.ACTIVE)
                .emailVerified(false)
                .createdAt(Instant.now())
                .build();

        User savedUser = userRepository.save(user);
        log.info("Registered new user with email: {}", savedUser.getEmail());

        return UserSummaryDto.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (user.getStatus() == UserStatus.BANNED) {
            throw new UnauthorizedException("User account has been banned");
        }

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateAccessToken(userPrincipal);
        String rawRefreshToken = tokenProvider.generateRefreshToken();
        String hashedRefreshToken = tokenProvider.hashToken(rawRefreshToken);

        Instant refreshExpiry = Instant.now().plusMillis(tokenProvider.getRefreshExpirationInMs());

        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .userId(user.getId())
                .tokenHash(hashedRefreshToken)
                .expiresAt(refreshExpiry)
                .revoked(false)
                .createdAt(Instant.now())
                .build();

        refreshTokenRepository.save(refreshTokenEntity);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(rawRefreshToken)
                .expiresIn(tokenProvider.getAccessExpirationInSeconds())
                .user(UserSummaryDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String rawRefreshToken = request.getRefreshToken();
        String hashedRefreshToken = tokenProvider.hashToken(rawRefreshToken);

        RefreshToken refreshTokenEntity = refreshTokenRepository.findByTokenHash(hashedRefreshToken)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (refreshTokenEntity.isRevoked() || refreshTokenEntity.getExpiresAt().isBefore(Instant.now())) {
            // Token reuse detection signal: revoke all tokens for this user
            refreshTokenRepository.deleteByUserId(refreshTokenEntity.getUserId());
            throw new UnauthorizedException("Refresh token is expired or revoked. Please log in again.");
        }

        // Revoke the current refresh token (rotation)
        refreshTokenEntity.setRevoked(true);
        refreshTokenRepository.save(refreshTokenEntity);

        User user = userRepository.findById(refreshTokenEntity.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getStatus() == UserStatus.BANNED) {
            throw new UnauthorizedException("User account has been banned");
        }

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String newAccessToken = tokenProvider.generateAccessToken(userPrincipal);
        String newRawRefreshToken = tokenProvider.generateRefreshToken();
        String newHashedRefreshToken = tokenProvider.hashToken(newRawRefreshToken);

        Instant refreshExpiry = Instant.now().plusMillis(tokenProvider.getRefreshExpirationInMs());

        RefreshToken newRefreshTokenEntity = RefreshToken.builder()
                .userId(user.getId())
                .tokenHash(newHashedRefreshToken)
                .expiresAt(refreshExpiry)
                .revoked(false)
                .createdAt(Instant.now())
                .build();

        refreshTokenRepository.save(newRefreshTokenEntity);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRawRefreshToken)
                .expiresIn(tokenProvider.getAccessExpirationInSeconds())
                .user(UserSummaryDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserSummaryDto getCurrentUserSummary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return UserSummaryDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}

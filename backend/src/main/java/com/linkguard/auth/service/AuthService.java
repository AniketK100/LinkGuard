package com.linkguard.auth.service;

import com.linkguard.auth.dto.AuthResponse;
import com.linkguard.auth.dto.LoginRequest;
import com.linkguard.auth.dto.RefreshTokenRequest;
import com.linkguard.auth.dto.RegisterRequest;
import com.linkguard.auth.dto.UserSummaryDto;

public interface AuthService {
    UserSummaryDto register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    UserSummaryDto getCurrentUserSummary(Long userId);
}

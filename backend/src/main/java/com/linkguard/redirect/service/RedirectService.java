package com.linkguard.redirect.service;

import com.linkguard.redirect.dto.RedirectResultDto;
import jakarta.servlet.http.HttpServletRequest;

public interface RedirectService {
    RedirectResultDto resolveRedirect(String shortCode, HttpServletRequest request);
    RedirectResultDto verifyPasswordAndResolve(String shortCode, String password, HttpServletRequest request);
    RedirectResultDto getRedirectMetadata(String shortCode);
    boolean checkEngineHealth();
}

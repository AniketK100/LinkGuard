package com.linkguard.redirect.controller;

import com.linkguard.common.dto.ApiResponse;
import com.linkguard.redirect.dto.RedirectResultDto;
import com.linkguard.redirect.service.RedirectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "Redirect Engine", description = "High-performance public short URL resolution and redirection")
public class RedirectController {

    private final RedirectService redirectService;

    @GetMapping("/{shortCode}")
    @Operation(summary = "Core public redirect endpoint (302 Found)")
    public ResponseEntity<?> handleRedirect(@PathVariable String shortCode, HttpServletRequest request) {
        RedirectResultDto result = redirectService.resolveRedirect(shortCode, request);

        if (result.isPasswordProtected()) {
            return ResponseEntity.ok(ApiResponse.success(
                    Map.of("passwordRequired", true, "shortCode", shortCode),
                    "This link is password protected. Submit password to unlock."
            ));
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.LOCATION, result.getOriginalUrl());
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/r/{shortCode}")
    @Operation(summary = "Alternative public redirect endpoint (302 Found)")
    public ResponseEntity<?> handleAlternativeRedirect(@PathVariable String shortCode, HttpServletRequest request) {
        return handleRedirect(shortCode, request);
    }

    @PostMapping("/{shortCode}/verify")
    @Operation(summary = "Verify password for password-protected link and redirect")
    public ResponseEntity<?> verifyPasswordAndRedirect(
            @PathVariable String shortCode,
            @RequestBody PasswordVerificationRequest body,
            HttpServletRequest request) {
        RedirectResultDto result = redirectService.verifyPasswordAndResolve(shortCode, body.getPassword(), request);
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.LOCATION, result.getOriginalUrl());
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/api/v1/redirects/{shortCode}")
    @Operation(summary = "Get redirect resolution metadata (JSON payload)")
    public ResponseEntity<ApiResponse<RedirectResultDto>> getRedirectMetadata(@PathVariable String shortCode) {
        RedirectResultDto metadata = redirectService.getRedirectMetadata(shortCode);
        return ResponseEntity.ok(ApiResponse.success(metadata, "Redirect metadata retrieved"));
    }

    @GetMapping("/api/v1/redirects/health")
    @Operation(summary = "Redirect engine status health check")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEngineHealth() {
        boolean healthy = redirectService.checkEngineHealth();
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("status", healthy ? "UP" : "DOWN", "engine", "RedirectEngine-v1"),
                "Redirect engine health check"
        ));
    }

    @Data
    public static class PasswordVerificationRequest {
        private String password;
    }
}

package com.linkguard.security.controller;

import com.linkguard.auth.security.UserPrincipal;
import com.linkguard.common.dto.ApiResponse;
import com.linkguard.security.dto.ApiKeyResponse;
import com.linkguard.security.dto.BlockIpRequest;
import com.linkguard.security.dto.CreateApiKeyRequest;
import com.linkguard.security.entity.AuditLog;
import com.linkguard.security.entity.BlockedIp;
import com.linkguard.security.entity.SecurityEvent;
import com.linkguard.security.service.SecurityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/security")
@RequiredArgsConstructor
@Tag(name = "Security Module", description = "Rate limiting, threat detection, API keys, audit logging, and IP blocking")
public class SecurityController {

    private final SecurityService securityService;

    @GetMapping("/events")
    @Operation(summary = "Get security events log (paginated)")
    public ResponseEntity<ApiResponse<Page<SecurityEvent>>> getSecurityEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SecurityEvent> events = securityService.getSecurityEvents(pageable);
        return ResponseEntity.ok(ApiResponse.success(events, "Security events log retrieved"));
    }

    @GetMapping("/audit")
    @Operation(summary = "Get system audit log history (paginated)")
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Pageable pageable = PageRequest.of(page, size);
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        Page<AuditLog> auditLogs = securityService.getAuditLogs(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(auditLogs, "Audit log history retrieved"));
    }

    @PostMapping("/api-keys")
    @Operation(summary = "Generate a new API key")
    public ResponseEntity<ApiResponse<ApiKeyResponse>> createApiKey(
            @Valid @RequestBody CreateApiKeyRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        ApiKeyResponse response = securityService.createApiKey(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "API key created successfully"));
    }

    @GetMapping("/api-keys")
    @Operation(summary = "Get current user's API keys")
    public ResponseEntity<ApiResponse<List<ApiKeyResponse>>> getUserApiKeys(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        List<ApiKeyResponse> apiKeys = securityService.getUserApiKeys(userId);
        return ResponseEntity.ok(ApiResponse.success(apiKeys, "User API keys retrieved"));
    }

    @PutMapping("/api-keys/{id}")
    @Operation(summary = "Update status of an API key (ACTIVE, REVOKED, EXPIRED)")
    public ResponseEntity<ApiResponse<ApiKeyResponse>> updateApiKeyStatus(
            @PathVariable Long id,
            @RequestBody UpdateApiKeyStatusRequest body,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        ApiKeyResponse response = securityService.updateApiKeyStatus(id, body.getStatus(), userId);
        return ResponseEntity.ok(ApiResponse.success(response, "API key status updated"));
    }

    @DeleteMapping("/api-keys/{id}")
    @Operation(summary = "Delete an API key")
    public ResponseEntity<ApiResponse<Void>> deleteApiKey(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        securityService.deleteApiKey(id, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "API key deleted successfully"));
    }

    @GetMapping("/blocked-ips")
    @Operation(summary = "List all blocked IP addresses")
    public ResponseEntity<ApiResponse<List<BlockedIp>>> getBlockedIps() {
        List<BlockedIp> blockedIps = securityService.getBlockedIps();
        return ResponseEntity.ok(ApiResponse.success(blockedIps, "Blocked IPs list retrieved"));
    }

    @PostMapping("/blocked-ips")
    @Operation(summary = "Block an IP address")
    public ResponseEntity<ApiResponse<BlockedIp>> blockIp(@Valid @RequestBody BlockIpRequest request) {
        BlockedIp blockedIp = securityService.blockIp(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(blockedIp, "IP address blocked successfully"));
    }

    @DeleteMapping("/blocked-ips/{id}")
    @Operation(summary = "Unblock an IP address by ID")
    public ResponseEntity<ApiResponse<Void>> unblockIp(@PathVariable Long id) {
        securityService.unblockIp(id);
        return ResponseEntity.ok(ApiResponse.success(null, "IP address unblocked successfully"));
    }

    @Data
    public static class UpdateApiKeyStatusRequest {
        private String status;
    }
}

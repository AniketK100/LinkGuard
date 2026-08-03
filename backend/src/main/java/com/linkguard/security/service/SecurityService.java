package com.linkguard.security.service;

import com.linkguard.security.dto.ApiKeyResponse;
import com.linkguard.security.dto.BlockIpRequest;
import com.linkguard.security.dto.CreateApiKeyRequest;
import com.linkguard.security.entity.AuditLog;
import com.linkguard.security.entity.BlockedIp;
import com.linkguard.security.entity.SecurityEvent;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SecurityService {
    Page<SecurityEvent> getSecurityEvents(Pageable pageable);
    Page<AuditLog> getAuditLogs(Long userId, Pageable pageable);
    ApiKeyResponse createApiKey(CreateApiKeyRequest request, Long userId);
    List<ApiKeyResponse> getUserApiKeys(Long userId);
    ApiKeyResponse updateApiKeyStatus(Long keyId, String status, Long userId);
    void deleteApiKey(Long keyId, Long userId);
    List<BlockedIp> getBlockedIps();
    BlockedIp blockIp(BlockIpRequest request);
    void unblockIp(Long id);
    void logSecurityEvent(String eventType, Long userId, String ipAddress, String userAgent, String description);
    void logAudit(Long userId, String action, String resource, String description);
}

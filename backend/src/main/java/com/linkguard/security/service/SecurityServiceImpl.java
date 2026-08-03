package com.linkguard.security.service;

import com.linkguard.common.exception.BadRequestException;
import com.linkguard.common.exception.ResourceNotFoundException;
import com.linkguard.security.dto.ApiKeyResponse;
import com.linkguard.security.dto.BlockIpRequest;
import com.linkguard.security.dto.CreateApiKeyRequest;
import com.linkguard.security.entity.*;
import com.linkguard.security.repository.ApiKeyRepository;
import com.linkguard.security.repository.AuditLogRepository;
import com.linkguard.security.repository.BlockedIpRepository;
import com.linkguard.security.repository.SecurityEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SecurityServiceImpl implements SecurityService {

    private final SecurityEventRepository securityEventRepository;
    private final BlockedIpRepository blockedIpRepository;
    private final ApiKeyRepository apiKeyRepository;
    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<SecurityEvent> getSecurityEvents(Pageable pageable) {
        return securityEventRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogs(Long userId, Pageable pageable) {
        if (userId != null) {
            return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        }
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Override
    @Transactional
    public ApiKeyResponse createApiKey(CreateApiKeyRequest request, Long userId) {
        String generatedKey = "lg_live_" + UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().substring(0, 8);

        ApiKey apiKey = ApiKey.builder()
                .userId(userId)
                .keyName(request.getKeyName().trim())
                .apiKey(generatedKey)
                .status(ApiKeyStatus.ACTIVE)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        ApiKey saved = apiKeyRepository.save(apiKey);
        logAudit(userId, "CREATE_API_KEY", "ApiKey", "Created API key: " + request.getKeyName());
        return mapToApiKeyResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApiKeyResponse> getUserApiKeys(Long userId) {
        return apiKeyRepository.findByUserId(userId).stream()
                .map(this::mapToApiKeyResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ApiKeyResponse updateApiKeyStatus(Long keyId, String status, Long userId) {
        ApiKey apiKey = apiKeyRepository.findByIdAndUserId(keyId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("API Key not found with id: " + keyId));

        try {
            ApiKeyStatus newStatus = ApiKeyStatus.valueOf(status.toUpperCase());
            apiKey.setStatus(newStatus);
            ApiKey updated = apiKeyRepository.save(apiKey);
            logAudit(userId, "UPDATE_API_KEY_STATUS", "ApiKey", "Updated status to " + newStatus + " for key id: " + keyId);
            return mapToApiKeyResponse(updated);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid API key status: " + status);
        }
    }

    @Override
    @Transactional
    public void deleteApiKey(Long keyId, Long userId) {
        ApiKey apiKey = apiKeyRepository.findByIdAndUserId(keyId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("API Key not found with id: " + keyId));
        apiKeyRepository.delete(apiKey);
        logAudit(userId, "DELETE_API_KEY", "ApiKey", "Deleted API key id: " + keyId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlockedIp> getBlockedIps() {
        return blockedIpRepository.findAll();
    }

    @Override
    @Transactional
    public BlockedIp blockIp(BlockIpRequest request) {
        if (blockedIpRepository.existsByIpAddress(request.getIpAddress())) {
            throw new BadRequestException("IP address " + request.getIpAddress() + " is already blocked");
        }

        BlockedIp blockedIp = BlockedIp.builder()
                .ipAddress(request.getIpAddress().trim())
                .reason(request.getReason() != null ? request.getReason().trim() : "Administrative Block")
                .expiresAt(request.getExpiresAt())
                .createdAt(Instant.now())
                .build();

        BlockedIp saved = blockedIpRepository.save(blockedIp);
        logSecurityEvent("IP_BLOCKED", null, request.getIpAddress(), "System", "IP address blocked: " + request.getReason());
        return saved;
    }

    @Override
    @Transactional
    public void unblockIp(Long id) {
        BlockedIp blockedIp = blockedIpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blocked IP record not found with id: " + id));
        blockedIpRepository.delete(blockedIp);
        logSecurityEvent("IP_UNBLOCKED", null, blockedIp.getIpAddress(), "System", "IP address unblocked");
    }

    @Override
    @Transactional
    public void logSecurityEvent(String eventType, Long userId, String ipAddress, String userAgent, String description) {
        SecurityEvent securityEvent = SecurityEvent.builder()
                .eventType(eventType)
                .userId(userId)
                .ipAddress(ipAddress != null ? ipAddress : "127.0.0.1")
                .userAgent(userAgent)
                .severity(Severity.MEDIUM)
                .description(description)
                .createdAt(Instant.now())
                .build();
        securityEventRepository.save(securityEvent);
    }

    @Override
    @Transactional
    public void logAudit(Long userId, String action, String resource, String description) {
        AuditLog auditLog = AuditLog.builder()
                .userId(userId)
                .action(action)
                .resource(resource)
                .description(description)
                .createdAt(Instant.now())
                .build();
        auditLogRepository.save(auditLog);
    }

    private ApiKeyResponse mapToApiKeyResponse(ApiKey apiKey) {
        return ApiKeyResponse.builder()
                .id(apiKey.getId())
                .userId(apiKey.getUserId())
                .keyName(apiKey.getKeyName())
                .apiKey(apiKey.getApiKey())
                .status(apiKey.getStatus())
                .createdAt(apiKey.getCreatedAt())
                .updatedAt(apiKey.getUpdatedAt())
                .build();
    }
}

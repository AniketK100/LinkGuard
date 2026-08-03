package com.linkguard.security.dto;

import com.linkguard.security.entity.ApiKeyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiKeyResponse {
    private Long id;
    private Long userId;
    private String keyName;
    private String apiKey;
    private ApiKeyStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}

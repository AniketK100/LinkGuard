package com.linkguard.url.dto;

import com.linkguard.url.entity.UrlStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrlResponse {
    private Long id;
    private Long userId;
    private String originalUrl;
    private String shortCode;
    private String shortUrl;
    private String customAlias;
    private String title;
    private String description;
    private boolean isCustomAlias;
    private UrlStatus status;
    private Long clickCount;
    private boolean isPasswordProtected;
    private Instant expiresAt;
    private Instant lastAccessedAt;
    private Instant deletedAt;
    private Instant createdAt;
    private Instant updatedAt;
}

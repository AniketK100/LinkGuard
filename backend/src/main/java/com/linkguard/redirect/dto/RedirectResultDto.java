package com.linkguard.redirect.dto;

import com.linkguard.url.entity.UrlStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RedirectResultDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long urlId;
    private String originalUrl;
    private String shortCode;
    private UrlStatus status;
    private boolean passwordProtected;
    private Instant expiresAt;
}

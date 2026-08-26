package com.linkguard.redirect.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClickEvent {
    private Long urlId;
    private String shortCode;
    private String rawUserAgent;
    private String secChUa;
    private String referrer;
    private String ipAddress;
    private String country;
    @Builder.Default
    private Instant timestamp = Instant.now();
}

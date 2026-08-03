package com.linkguard.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsOverviewDto {
    private Long urlId;
    private long totalClicks;
    private long uniqueVisitors;
    private Instant lastAccessedAt;
}

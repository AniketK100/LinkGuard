package com.linkguard.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrlAnalyticsResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long urlId;
    private long totalClicks;
    private long uniqueVisitors;
    private Instant lastAccessedAt;
    private List<BreakdownItemDto> byCountry;
    private List<BreakdownItemDto> byDevice;
    private List<BreakdownItemDto> byBrowser;
    private List<BreakdownItemDto> byOperatingSystem;
    private List<BreakdownItemDto> byReferrer;
    private List<TimelineItemDto> timeSeries;
}

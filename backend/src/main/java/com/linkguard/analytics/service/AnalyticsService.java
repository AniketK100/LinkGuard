package com.linkguard.analytics.service;

import com.linkguard.analytics.dto.*;

import java.util.List;

public interface AnalyticsService {
    UrlAnalyticsResponse getFullAnalytics(Long urlId, Long userId);
    AnalyticsOverviewDto getOverview(Long urlId, Long userId);
    List<BreakdownItemDto> getCountryBreakdown(Long urlId, Long userId);
    List<BreakdownItemDto> getDeviceBreakdown(Long urlId, Long userId);
    List<BreakdownItemDto> getBrowserBreakdown(Long urlId, Long userId);
    List<BreakdownItemDto> getOsBreakdown(Long urlId, Long userId);
    List<BreakdownItemDto> getReferrerBreakdown(Long urlId, Long userId);
    List<TimelineItemDto> getTimeline(Long urlId, Long userId);
    String exportAnalyticsToCsv(Long urlId, Long userId);
}

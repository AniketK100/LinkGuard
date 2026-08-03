package com.linkguard.analytics.controller;

import com.linkguard.analytics.dto.*;
import com.linkguard.analytics.service.AnalyticsService;
import com.linkguard.auth.security.UserPrincipal;
import com.linkguard.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Tag(name = "Analytics Engine", description = "Real-time analytics, unique visitor tracking, breakdown and timeline reports")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping({"/api/v1/analytics/{urlId}", "/api/urls/{urlId}/analytics"})
    @Operation(summary = "Get complete analytics report for a short URL")
    public ResponseEntity<ApiResponse<UrlAnalyticsResponse>> getFullAnalytics(
            @PathVariable Long urlId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        UrlAnalyticsResponse analytics = analyticsService.getFullAnalytics(urlId, userId);
        return ResponseEntity.ok(ApiResponse.success(analytics, "Full analytics retrieved"));
    }

    @GetMapping("/api/v1/analytics/{urlId}/overview")
    @Operation(summary = "Get analytics overview (total clicks, unique visitors, last accessed)")
    public ResponseEntity<ApiResponse<AnalyticsOverviewDto>> getOverview(
            @PathVariable Long urlId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        AnalyticsOverviewDto overview = analyticsService.getOverview(urlId, userId);
        return ResponseEntity.ok(ApiResponse.success(overview, "Analytics overview retrieved"));
    }

    @GetMapping("/api/v1/analytics/{urlId}/countries")
    @Operation(summary = "Get geographic country breakdown")
    public ResponseEntity<ApiResponse<List<BreakdownItemDto>>> getCountryBreakdown(
            @PathVariable Long urlId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        List<BreakdownItemDto> breakdown = analyticsService.getCountryBreakdown(urlId, userId);
        return ResponseEntity.ok(ApiResponse.success(breakdown, "Country breakdown retrieved"));
    }

    @GetMapping("/api/v1/analytics/{urlId}/devices")
    @Operation(summary = "Get device type breakdown (desktop, mobile, tablet)")
    public ResponseEntity<ApiResponse<List<BreakdownItemDto>>> getDeviceBreakdown(
            @PathVariable Long urlId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        List<BreakdownItemDto> breakdown = analyticsService.getDeviceBreakdown(urlId, userId);
        return ResponseEntity.ok(ApiResponse.success(breakdown, "Device breakdown retrieved"));
    }

    @GetMapping("/api/v1/analytics/{urlId}/browsers")
    @Operation(summary = "Get browser breakdown")
    public ResponseEntity<ApiResponse<List<BreakdownItemDto>>> getBrowserBreakdown(
            @PathVariable Long urlId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        List<BreakdownItemDto> breakdown = analyticsService.getBrowserBreakdown(urlId, userId);
        return ResponseEntity.ok(ApiResponse.success(breakdown, "Browser breakdown retrieved"));
    }

    @GetMapping("/api/v1/analytics/{urlId}/operating-systems")
    @Operation(summary = "Get operating system breakdown")
    public ResponseEntity<ApiResponse<List<BreakdownItemDto>>> getOsBreakdown(
            @PathVariable Long urlId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        List<BreakdownItemDto> breakdown = analyticsService.getOsBreakdown(urlId, userId);
        return ResponseEntity.ok(ApiResponse.success(breakdown, "OS breakdown retrieved"));
    }

    @GetMapping("/api/v1/analytics/{urlId}/referrers")
    @Operation(summary = "Get referrer breakdown")
    public ResponseEntity<ApiResponse<List<BreakdownItemDto>>> getReferrerBreakdown(
            @PathVariable Long urlId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        List<BreakdownItemDto> breakdown = analyticsService.getReferrerBreakdown(urlId, userId);
        return ResponseEntity.ok(ApiResponse.success(breakdown, "Referrer breakdown retrieved"));
    }

    @GetMapping("/api/v1/analytics/{urlId}/timeline")
    @Operation(summary = "Get daily time-series traffic timeline")
    public ResponseEntity<ApiResponse<List<TimelineItemDto>>> getTimeline(
            @PathVariable Long urlId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        List<TimelineItemDto> timeline = analyticsService.getTimeline(urlId, userId);
        return ResponseEntity.ok(ApiResponse.success(timeline, "Timeline retrieved"));
    }

    @GetMapping("/api/v1/analytics/{urlId}/export")
    @Operation(summary = "Export URL click event log to CSV format")
    public ResponseEntity<String> exportAnalyticsToCsv(
            @PathVariable Long urlId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        String csvData = analyticsService.exportAnalyticsToCsv(urlId, userId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"analytics-url-" + urlId + ".csv\"");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }
}

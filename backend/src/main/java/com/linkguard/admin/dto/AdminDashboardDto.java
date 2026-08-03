package com.linkguard.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {
    private long totalUsers;
    private long activeUsers;
    private long totalUrls;
    private long activeUrls;
    private long totalClicks;
    private long securityEventsCount;
    private long blockedIpsCount;
    private Map<String, Object> systemHealth;
}

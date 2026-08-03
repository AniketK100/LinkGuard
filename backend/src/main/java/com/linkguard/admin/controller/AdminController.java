package com.linkguard.admin.controller;

import com.linkguard.admin.dto.AdminDashboardDto;
import com.linkguard.admin.dto.CreateAnnouncementRequest;
import com.linkguard.admin.dto.UpdateConfigurationRequest;
import com.linkguard.admin.entity.AdminAnnouncement;
import com.linkguard.admin.entity.SystemConfiguration;
import com.linkguard.admin.service.AdminService;
import com.linkguard.auth.dto.UserSummaryDto;
import com.linkguard.auth.entity.Role;
import com.linkguard.auth.entity.UserStatus;
import com.linkguard.common.dto.ApiResponse;
import com.linkguard.security.entity.AuditLog;
import com.linkguard.security.entity.SecurityEvent;
import com.linkguard.security.service.SecurityService;
import com.linkguard.url.dto.UrlResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Module", description = "Administrator platform oversight, user management, security audit, and system configuration")
public class AdminController {

    private final AdminService adminService;
    private final SecurityService securityService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get platform administrative overview metrics and system health")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getDashboardOverview() {
        AdminDashboardDto dashboard = adminService.getDashboardOverview();
        return ResponseEntity.ok(ApiResponse.success(dashboard, "Admin dashboard retrieved"));
    }

    @GetMapping("/users")
    @Operation(summary = "List all registered users (paginated)")
    public ResponseEntity<ApiResponse<Page<UserSummaryDto>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserSummaryDto> users = adminService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success(users, "All users retrieved"));
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Update user status (ACTIVE, BANNED)")
    public ResponseEntity<ApiResponse<UserSummaryDto>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody UpdateUserStatusRequest body) {
        UserSummaryDto updated = adminService.updateUserStatus(id, UserStatus.valueOf(body.getStatus().toUpperCase()));
        return ResponseEntity.ok(ApiResponse.success(updated, "User status updated"));
    }

    @PatchMapping("/users/{id}/role")
    @Operation(summary = "Update user role (USER, ADMIN)")
    public ResponseEntity<ApiResponse<UserSummaryDto>> updateUserRole(
            @PathVariable Long id,
            @RequestBody UpdateUserRoleRequest body) {
        UserSummaryDto updated = adminService.updateUserRole(id, Role.valueOf(body.getRole().toUpperCase()));
        return ResponseEntity.ok(ApiResponse.success(updated, "User role updated"));
    }

    @GetMapping("/urls")
    @Operation(summary = "List all global URLs across platform (paginated)")
    public ResponseEntity<ApiResponse<Page<UrlResponse>>> getAllUrls(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UrlResponse> urls = adminService.getAllUrls(pageable);
        return ResponseEntity.ok(ApiResponse.success(urls, "Global URLs list retrieved"));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get global platform analytics report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGlobalAnalytics() {
        Map<String, Object> report = adminService.getAdminReport();
        return ResponseEntity.ok(ApiResponse.success(report, "Global analytics report retrieved"));
    }

    @GetMapping("/security")
    @Operation(summary = "Get admin security overview and threat events")
    public ResponseEntity<ApiResponse<Page<SecurityEvent>>> getAdminSecurityEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SecurityEvent> events = securityService.getSecurityEvents(pageable);
        return ResponseEntity.ok(ApiResponse.success(events, "Admin security events retrieved"));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get platform-wide audit log history")
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getAdminAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> auditLogs = securityService.getAuditLogs(null, pageable);
        return ResponseEntity.ok(ApiResponse.success(auditLogs, "Admin audit logs retrieved"));
    }

    @GetMapping("/reports")
    @Operation(summary = "Get administrative platform activity report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminReport() {
        Map<String, Object> report = adminService.getAdminReport();
        return ResponseEntity.ok(ApiResponse.success(report, "Admin report generated"));
    }

    @PostMapping("/announcements")
    @Operation(summary = "Create system-wide announcement")
    public ResponseEntity<ApiResponse<AdminAnnouncement>> createAnnouncement(
            @Valid @RequestBody CreateAnnouncementRequest request) {
        AdminAnnouncement announcement = adminService.createAnnouncement(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(announcement, "Announcement created successfully"));
    }

    @GetMapping("/announcements")
    @Operation(summary = "List all platform announcements")
    public ResponseEntity<ApiResponse<List<AdminAnnouncement>>> getAnnouncements() {
        List<AdminAnnouncement> announcements = adminService.getAnnouncements();
        return ResponseEntity.ok(ApiResponse.success(announcements, "Announcements list retrieved"));
    }

    @PutMapping("/announcements/{id}")
    @Operation(summary = "Update system announcement")
    public ResponseEntity<ApiResponse<AdminAnnouncement>> updateAnnouncement(
            @PathVariable Long id,
            @Valid @RequestBody CreateAnnouncementRequest request) {
        AdminAnnouncement updated = adminService.updateAnnouncement(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Announcement updated successfully"));
    }

    @DeleteMapping("/announcements/{id}")
    @Operation(summary = "Delete system announcement")
    public ResponseEntity<ApiResponse<Void>> deleteAnnouncement(@PathVariable Long id) {
        adminService.deleteAnnouncement(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Announcement deleted successfully"));
    }

    @GetMapping("/configurations")
    @Operation(summary = "Get all system configuration key-value settings")
    public ResponseEntity<ApiResponse<List<SystemConfiguration>>> getConfigurations() {
        List<SystemConfiguration> configs = adminService.getConfigurations();
        return ResponseEntity.ok(ApiResponse.success(configs, "System configurations retrieved"));
    }

    @PutMapping("/configurations/{id}")
    @Operation(summary = "Update system configuration key-value setting")
    public ResponseEntity<ApiResponse<SystemConfiguration>> updateConfiguration(
            @PathVariable Long id,
            @Valid @RequestBody UpdateConfigurationRequest request) {
        SystemConfiguration updated = adminService.updateConfiguration(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "System configuration updated"));
    }

    @Data
    public static class UpdateUserStatusRequest {
        private String status;
    }

    @Data
    public static class UpdateUserRoleRequest {
        private String role;
    }
}

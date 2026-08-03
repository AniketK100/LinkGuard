package com.linkguard.admin.service;

import com.linkguard.admin.dto.AdminDashboardDto;
import com.linkguard.admin.dto.CreateAnnouncementRequest;
import com.linkguard.admin.dto.UpdateConfigurationRequest;
import com.linkguard.admin.entity.AdminAnnouncement;
import com.linkguard.admin.entity.SystemConfiguration;
import com.linkguard.auth.dto.UserSummaryDto;
import com.linkguard.auth.entity.Role;
import com.linkguard.auth.entity.UserStatus;
import com.linkguard.url.dto.UrlResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface AdminService {
    AdminDashboardDto getDashboardOverview();
    Page<UserSummaryDto> getAllUsers(Pageable pageable);
    UserSummaryDto updateUserStatus(Long userId, UserStatus status);
    UserSummaryDto updateUserRole(Long userId, Role role);
    Page<UrlResponse> getAllUrls(Pageable pageable);
    AdminAnnouncement createAnnouncement(CreateAnnouncementRequest request);
    List<AdminAnnouncement> getAnnouncements();
    AdminAnnouncement updateAnnouncement(Long id, CreateAnnouncementRequest request);
    void deleteAnnouncement(Long id);
    List<SystemConfiguration> getConfigurations();
    SystemConfiguration updateConfiguration(Long id, UpdateConfigurationRequest request);
    Map<String, Object> getAdminReport();
}

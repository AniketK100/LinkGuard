package com.linkguard.url.controller;

import com.linkguard.auth.security.UserPrincipal;
import com.linkguard.common.dto.ApiResponse;
import com.linkguard.url.dto.CreateUrlRequest;
import com.linkguard.url.dto.UpdateUrlRequest;
import com.linkguard.url.dto.UrlResponse;
import com.linkguard.url.service.UrlService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/v1/urls", "/api/urls"})
@RequiredArgsConstructor
@Tag(name = "URL Management", description = "Short URL creation, modification, status management, and deletion")
public class UrlController {

    private final UrlService urlService;

    @PostMapping
    @Operation(summary = "Create short URL or custom alias")
    public ResponseEntity<ApiResponse<UrlResponse>> createUrl(
            @Valid @RequestBody CreateUrlRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        UrlResponse response = urlService.createUrl(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Short URL created successfully"));
    }

    @GetMapping
    @Operation(summary = "Get user's short URLs (paginated)")
    public ResponseEntity<ApiResponse<Page<UrlResponse>>> getUserUrls(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        Page<UrlResponse> urls = urlService.getUserUrls(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(urls, "User URLs retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single URL detail by ID")
    public ResponseEntity<ApiResponse<UrlResponse>> getUrlById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        UrlResponse urlResponse = urlService.getUrlById(id, userId);
        return ResponseEntity.ok(ApiResponse.success(urlResponse, "URL detail retrieved"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update short URL destination or metadata")
    public ResponseEntity<ApiResponse<UrlResponse>> updateUrl(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUrlRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        UrlResponse response = urlService.updateUrl(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "URL updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete short URL")
    public ResponseEntity<ApiResponse<Void>> deleteUrl(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        urlService.softDeleteUrl(id, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "URL soft deleted successfully"));
    }

    @PatchMapping("/{id}/enable")
    @Operation(summary = "Enable a disabled short URL")
    public ResponseEntity<ApiResponse<UrlResponse>> enableUrl(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        UrlResponse response = urlService.enableUrl(id, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "URL enabled successfully"));
    }

    @PatchMapping("/{id}/disable")
    @Operation(summary = "Disable an active short URL")
    public ResponseEntity<ApiResponse<UrlResponse>> disableUrl(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        UrlResponse response = urlService.disableUrl(id, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "URL disabled successfully"));
    }

    @PatchMapping("/{id}/restore")
    @Operation(summary = "Restore a soft-deleted short URL")
    public ResponseEntity<ApiResponse<UrlResponse>> restoreUrl(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        UrlResponse response = urlService.restoreUrl(id, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "URL restored successfully"));
    }
}

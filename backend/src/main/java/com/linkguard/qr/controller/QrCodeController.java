package com.linkguard.qr.controller;

import com.linkguard.auth.security.UserPrincipal;
import com.linkguard.common.dto.ApiResponse;
import com.linkguard.qr.dto.GenerateQrRequest;
import com.linkguard.qr.dto.QrCodeResponse;
import com.linkguard.qr.dto.UpdateQrRequest;
import com.linkguard.qr.service.QrCodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Tag(name = "QR Code Module", description = "Dynamic and static QR code generation, customization, and file downloading")
public class QrCodeController {

    private final QrCodeService qrCodeService;

    @PostMapping("/api/v1/qr-codes")
    @Operation(summary = "Generate new custom QR code")
    public ResponseEntity<ApiResponse<QrCodeResponse>> generateQrCode(
            @Valid @RequestBody GenerateQrRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        QrCodeResponse response = qrCodeService.generateQrCode(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "QR Code generated successfully"));
    }

    @GetMapping("/api/v1/qr-codes")
    @Operation(summary = "Get user's generated QR codes (paginated)")
    public ResponseEntity<ApiResponse<Page<QrCodeResponse>>> getUserQrCodes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Pageable pageable = PageRequest.of(page, size);
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        Page<QrCodeResponse> qrCodes = qrCodeService.getUserQrCodes(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(qrCodes, "User QR Codes retrieved"));
    }

    @GetMapping("/api/v1/qr-codes/{id}")
    @Operation(summary = "Get QR code detail metadata by ID")
    public ResponseEntity<ApiResponse<QrCodeResponse>> getQrCodeById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        QrCodeResponse response = qrCodeService.getQrCodeById(id, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "QR Code detail retrieved"));
    }

    @PutMapping("/api/v1/qr-codes/{id}")
    @Operation(summary = "Update QR code colors, dimensions, or styling")
    public ResponseEntity<ApiResponse<QrCodeResponse>> updateQrCode(
            @PathVariable Long id,
            @RequestBody UpdateQrRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        QrCodeResponse response = qrCodeService.updateQrCode(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "QR Code updated successfully"));
    }

    @DeleteMapping("/api/v1/qr-codes/{id}")
    @Operation(summary = "Delete QR code")
    public ResponseEntity<ApiResponse<Void>> deleteQrCode(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        qrCodeService.deleteQrCode(id, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "QR Code deleted successfully"));
    }

    @GetMapping("/api/v1/qr-codes/{id}/download")
    @Operation(summary = "Download QR code image binary file")
    public ResponseEntity<byte[]> downloadQrCodeImage(@PathVariable Long id) {
        byte[] imageBytes = qrCodeService.downloadQrCodeImage(id);
        QrCodeResponse qrCode = qrCodeService.getQrCodeById(id, null);

        MediaType mediaType = qrCode.getContentType().contains("svg") ? MediaType.parseMediaType("image/svg+xml") : MediaType.IMAGE_PNG;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + qrCode.getFileName() + "\"");

        return ResponseEntity.ok()
                .headers(headers)
                .body(imageBytes);
    }

    @PostMapping("/api/v1/qr-codes/{id}/regenerate")
    @Operation(summary = "Regenerate QR code image file")
    public ResponseEntity<ApiResponse<QrCodeResponse>> regenerateQrCode(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        QrCodeResponse response = qrCodeService.regenerateQrCode(id, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "QR Code regenerated successfully"));
    }

    @GetMapping("/api/urls/{urlId}/qr")
    @Operation(summary = "Get or create default QR code for URL ID")
    public ResponseEntity<ApiResponse<QrCodeResponse>> getOrCreateQrForUrl(
            @PathVariable Long urlId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        QrCodeResponse response = qrCodeService.getOrCreateQrCodeForUrl(urlId, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "QR Code retrieved"));
    }
}

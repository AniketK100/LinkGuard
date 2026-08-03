package com.linkguard.qr.dto;

import com.linkguard.qr.entity.QrType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QrCodeResponse {
    private Long id;
    private Long urlId;
    private String shortCode;
    private QrType qrType;
    private String fileName;
    private String downloadUrl;
    private String contentType;
    private Integer width;
    private Integer height;
    private String foregroundColor;
    private String backgroundColor;
    private boolean active;
    private Instant createdAt;
    private Instant updatedAt;
}

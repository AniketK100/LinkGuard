package com.linkguard.qr.dto;

import com.linkguard.qr.entity.QrType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateQrRequest {
    private QrType qrType;
    private Integer width;
    private Integer height;
    private String foregroundColor;
    private String backgroundColor;
}

package com.linkguard.qr.dto;

import com.linkguard.qr.entity.QrType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerateQrRequest {

    @NotNull(message = "URL ID is required")
    private Long urlId;

    private QrType qrType;
    private Integer width;
    private Integer height;
    private String foregroundColor;
    private String backgroundColor;
    private String format; // png or svg
}

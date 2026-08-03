package com.linkguard.security.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlockIpRequest {

    @NotBlank(message = "IP address is required")
    private String ipAddress;

    @Size(max = 255, message = "Reason cannot exceed 255 characters")
    private String reason;

    private Instant expiresAt;
}

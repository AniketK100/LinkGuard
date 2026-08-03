package com.linkguard.url.dto;

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
public class UpdateUrlRequest {

    @Size(max = 2048, message = "Original URL cannot exceed 2048 characters")
    private String originalUrl;

    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    private String description;

    @Size(min = 4, max = 64, message = "Password must be between 4 and 64 characters")
    private String password;

    private Instant expiresAt;
}

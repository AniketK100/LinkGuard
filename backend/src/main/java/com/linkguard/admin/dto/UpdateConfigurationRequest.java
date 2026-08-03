package com.linkguard.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateConfigurationRequest {

    @NotBlank(message = "Configuration value is required")
    private String configValue;

    private String description;
}

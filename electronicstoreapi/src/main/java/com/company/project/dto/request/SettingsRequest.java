package com.company.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettingsRequest {

    @NotBlank(message = "Setting key is required")
    private String key;

    @NotNull(message = "Setting value is required")
    private String value;

    @NotBlank(message = "Setting group is required")
    private String group;

    private String description;
}
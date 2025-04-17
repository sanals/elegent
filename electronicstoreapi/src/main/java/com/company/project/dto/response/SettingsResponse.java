package com.company.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettingsResponse {

    private Long id;
    private String key;
    private String value;
    private String group;
    private String description;

    public static SettingsResponse fromEntity(com.company.project.entity.Settings settings) {
        return SettingsResponse.builder()
                .id(settings.getId())
                .key(settings.getSettingKey())
                .value(settings.getSettingValue())
                .group(settings.getSettingGroup())
                .description(settings.getDescription())
                .build();
    }
}
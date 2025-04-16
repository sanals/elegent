package com.company.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocalityDTO {
    private Long id;
    private String name;
    private String pincode;
    private Long cityId;
    private String cityName;
    private String stateName;
}
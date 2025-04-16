package com.company.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocalityResponse {
    private Long id;
    private String name;
    private String pincode;
    private CityResponse city;
}
package com.company.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocalityRequest {

    @NotBlank(message = "Locality name is required")
    private String name;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    @NotNull(message = "City ID is required")
    private Long cityId;
}
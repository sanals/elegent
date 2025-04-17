package com.company.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StateRequest {

    @NotBlank(message = "State name is required")
    private String name;

    @NotBlank(message = "State code is required")
    private String code;
}
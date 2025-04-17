package com.company.project.dto.request;

import java.time.LocalTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OutletRequest {
    @NotBlank(message = "Outlet name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Contact number must be 10 digits")
    private String contactNumber;

    @Email(message = "Please provide a valid email")
    private String email;

    private LocalTime openingTime;

    private LocalTime closingTime;

    @NotNull(message = "Locality ID is required")
    private Long localityId;

    private Double latitude;

    private Double longitude;

    private String mapUrl;

    private boolean active = true;
}
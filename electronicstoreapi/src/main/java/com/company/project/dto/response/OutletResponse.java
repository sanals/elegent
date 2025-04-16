package com.company.project.dto.response;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OutletResponse {
    private Long id;
    private String name;
    private String address;
    private String contactNumber;
    private String email;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private boolean active;

    private Double latitude;
    private Double longitude;
    private String mapUrl;

    // Location details
    private LocalityResponse locality;
    private CityResponse city;
    private StateResponse state;
}
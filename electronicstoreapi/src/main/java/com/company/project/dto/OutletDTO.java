package com.company.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OutletDTO {
    private Long id;
    private String name;
    private String address;
    private String contactNumber;
    private String emailId;
    private Long localityId;
    private String localityName;
    private String pincode;
    private String cityName;
    private String stateName;
    private String managerName;
    private boolean isActive;
}
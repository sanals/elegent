package com.company.project.dto.response;

import com.company.project.entity.Address.AddressType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {

    private Long id;
    private String addressLine1;
    private String addressLine2;
    private String landmark;
    private String contactName;
    private String contactPhone;
    private boolean isDefault;
    private AddressType addressType;

    // Location information
    private Long localityId;
    private String localityName;
    private String pincode;

    private Long cityId;
    private String cityName;

    private Long stateId;
    private String stateName;

    // Complete formatted address
    private String formattedAddress;
}
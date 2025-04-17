package com.company.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomepageSettingsResponse {

    private Integer featuredProductsCount;
    private Integer latestProductsCount;
}
package com.company.project.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomepageSettingsRequest {

    @NotNull(message = "Featured products count is required")
    @Min(value = 1, message = "Featured products count must be at least 1")
    @Max(value = 10, message = "Featured products count must be at most 10")
    private Integer featuredProductsCount;

    @NotNull(message = "Latest products count is required")
    @Min(value = 4, message = "Latest products count must be at least 4")
    @Max(value = 24, message = "Latest products count must be at most 24")
    private Integer latestProductsCount;
}
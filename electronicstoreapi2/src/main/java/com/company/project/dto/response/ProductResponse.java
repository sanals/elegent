package com.company.project.dto.response;

import com.company.project.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private CategorySummary category;
    private String specifications;
    private List<String> images;
    private Product.Status status;
    private Integer stock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String lastModifiedBy;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategorySummary {
        private Long id;
        private String name;
        private String description;
    }

    public static ProductResponse fromEntity(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory() != null ? CategorySummary.builder()
                        .id(product.getCategory().getId())
                        .name(product.getCategory().getName())
                        .description(product.getCategory().getDescription())
                        .build() : null)
                .specifications(product.getSpecifications())
                .images(product.getImages())
                .status(product.getStatus())
                .stock(product.getStock())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .createdBy(product.getCreatedBy())
                .lastModifiedBy(product.getLastModifiedBy())
                .build();
    }
} 
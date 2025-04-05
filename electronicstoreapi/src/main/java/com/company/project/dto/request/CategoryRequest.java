package com.company.project.dto.request;

import org.springframework.web.multipart.MultipartFile;

import com.company.project.entity.Category;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    private Long parentCategoryId;

    private MultipartFile image;

    private String imageUrl;

    private Category.Status status;

    /**
     * Create a CategoryRequest from a Category entity
     * 
     * @param category The category entity
     * @return A new CategoryRequest with data from the entity
     */
    public static CategoryRequest fromEntity(Category category) {
        CategoryRequest request = new CategoryRequest();
        request.setName(category.getName());
        request.setDescription(category.getDescription());
        request.setImageUrl(category.getImageUrl());

        if (category.getParentCategory() != null) {
            request.setParentCategoryId(category.getParentCategory().getId());
        }

        request.setStatus(category.getStatus());

        return request;
    }
}
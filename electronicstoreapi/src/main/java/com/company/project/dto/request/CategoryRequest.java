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

}
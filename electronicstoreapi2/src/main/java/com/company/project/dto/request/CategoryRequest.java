package com.company.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;
    
    private String description;
    
    private Long parentCategoryId;
    
    private MultipartFile image;
    
    private String imageUrl;
} 
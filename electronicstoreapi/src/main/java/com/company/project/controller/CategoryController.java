package com.company.project.controller;

import com.company.project.dto.request.CategoryRequest;
import com.company.project.dto.response.ApiResponse;
import com.company.project.dto.response.CategoryResponse;
import com.company.project.entity.Category;
import com.company.project.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        List<CategoryResponse> responseList = categories.stream()
                .map(CategoryResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), 
                "Categories retrieved successfully", responseList));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        CategoryResponse response = CategoryResponse.fromEntity(category);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), 
                "Category retrieved successfully", response));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CategoryRequest request) {
        Category category = categoryService.createCategory(request);
        CategoryResponse response = CategoryResponse.fromEntity(category);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("SUCCESS", HttpStatus.CREATED.value(), 
                        "Category created successfully", response));
    }

    @PostMapping(value = "/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategoryWithImage(
            @ModelAttribute CategoryRequest request) {
        
        Category category = categoryService.createCategory(request);
        CategoryResponse response = CategoryResponse.fromEntity(category);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("SUCCESS", HttpStatus.CREATED.value(), 
                        "Category created successfully with image", response));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id, 
            @Valid @RequestBody CategoryRequest request) {
        
        Category updatedCategory = categoryService.updateCategory(id, request);
        CategoryResponse response = CategoryResponse.fromEntity(updatedCategory);
        
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), 
                "Category updated successfully", response));
    }

    @PutMapping(value = "/{id}/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategoryWithImage(
            @PathVariable Long id,
            @ModelAttribute CategoryRequest request) {
        
        Category updatedCategory = categoryService.updateCategory(id, request);
        CategoryResponse response = CategoryResponse.fromEntity(updatedCategory);
        
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), 
                "Category updated successfully with image", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), 
                "Category deleted successfully", null));
    }
} 
package com.company.project.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.project.dto.request.CategoryRequest;
import com.company.project.dto.response.ApiResponse;
import com.company.project.dto.response.CategoryResponse;
import com.company.project.entity.Category;
import com.company.project.service.CategoryService;
import com.company.project.service.ResponseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controller handling category-related API endpoints
 * 
 * Provides endpoints for managing product categories including creation,
 * retrieval, updates, and deletion. Some operations require admin privileges.
 */
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

        private final CategoryService categoryService;
        private final ResponseService responseService;

        /**
         * Get all categories with pagination
         * 
         * @param pageable Pagination information
         * @return ApiResponse containing page of categories
         */
        @GetMapping
        public ResponseEntity<ApiResponse<Page<CategoryResponse>>> getAllCategories(
                        @PageableDefault(size = 10) Pageable pageable) {
                List<Category> categories = categoryService.getAllCategories();
                List<CategoryResponse> responseList = categories.stream()
                                .map(CategoryResponse::fromEntity)
                                .toList();

                return ResponseEntity.ok(
                                responseService.createPageResponse(responseList, pageable,
                                                "Categories retrieved successfully"));
        }

        /**
         * Get a category by its ID
         * 
         * @param id Category ID
         * @return ApiResponse containing the requested category
         */
        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
                Category category = categoryService.getCategoryById(id);
                CategoryResponse response = CategoryResponse.fromEntity(category);

                return ResponseEntity.ok(
                                responseService.createSingleResponse(response, "Category retrieved successfully"));
        }

        /**
         * Create a new category
         * 
         * @param request Category creation data
         * @return ApiResponse with created category
         */
        @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
                        @Valid @RequestBody CategoryRequest request) {
                Category category = categoryService.createCategory(request);
                CategoryResponse response = CategoryResponse.fromEntity(category);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(responseService.createCreatedResponse(response, "Category created successfully"));
        }

        /**
         * Create a new category with image
         * 
         * @param request Category creation data with image file
         * @return ApiResponse with created category including image
         */
        @PostMapping(value = "/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<CategoryResponse>> createCategoryWithImage(
                        @ModelAttribute CategoryRequest request) {

                Category category = categoryService.createCategory(request);
                CategoryResponse response = CategoryResponse.fromEntity(category);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(responseService.createCreatedResponse(response,
                                                "Category created successfully with image"));
        }

        /**
         * Update an existing category
         * 
         * @param id      Category ID to update
         * @param request Updated category data
         * @return ApiResponse with updated category
         */
        @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
                        @PathVariable Long id,
                        @Valid @RequestBody CategoryRequest request) {

                Category updatedCategory = categoryService.updateCategory(id, request);
                CategoryResponse response = CategoryResponse.fromEntity(updatedCategory);

                return ResponseEntity.ok(
                                responseService.createSingleResponse(response, "Category updated successfully"));
        }

        /**
         * Update an existing category with image
         * 
         * @param id      Category ID to update
         * @param request Updated category data with image
         * @return ApiResponse with updated category including image
         */
        @PutMapping(value = "/{id}/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<CategoryResponse>> updateCategoryWithImage(
                        @PathVariable Long id,
                        @ModelAttribute CategoryRequest request) {

                Category updatedCategory = categoryService.updateCategory(id, request);
                CategoryResponse response = CategoryResponse.fromEntity(updatedCategory);

                return ResponseEntity.ok(
                                responseService.createSingleResponse(response,
                                                "Category updated successfully with image"));
        }

        /**
         * Delete a category
         * 
         * @param id Category ID to delete
         * @return ApiResponse with success message
         */
        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
                categoryService.deleteCategory(id);

                return ResponseEntity.ok(
                                responseService.createEmptyResponse("Category deleted successfully"));
        }

        /**
         * Update category status
         * 
         * @param id     Category ID
         * @param status New status value
         * @return ApiResponse with updated category
         */
        @PutMapping("/{id}/status")
        @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<CategoryResponse>> updateCategoryStatus(
                        @PathVariable Long id,
                        @RequestParam Category.Status status) {

                Category category = categoryService.updateCategoryStatus(id, status);
                CategoryResponse response = CategoryResponse.fromEntity(category);

                return ResponseEntity.ok(
                                responseService.createSingleResponse(response, "Category status updated successfully"));
        }
}
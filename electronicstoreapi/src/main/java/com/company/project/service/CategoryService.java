package com.company.project.service;

import java.util.List;

import com.company.project.dto.request.CategoryRequest;
import com.company.project.dto.response.CategoryResponse;
import com.company.project.entity.Category;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(Long id);

    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse updateCategory(Long id, CategoryRequest request);

    void deleteCategory(Long id);

    CategoryResponse updateCategoryStatus(Long id, Category.Status status);
}
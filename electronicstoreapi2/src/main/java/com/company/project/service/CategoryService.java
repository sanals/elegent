package com.company.project.service;

import com.company.project.dto.request.CategoryRequest;
import com.company.project.entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    
    Category getCategoryById(Long id);
    
    Category createCategory(CategoryRequest request);
    
    Category updateCategory(Long id, CategoryRequest request);
    
    void deleteCategory(Long id);
} 
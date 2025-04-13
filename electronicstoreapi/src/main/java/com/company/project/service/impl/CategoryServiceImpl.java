package com.company.project.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.project.dto.request.CategoryRequest;
import com.company.project.dto.response.CategoryResponse;
import com.company.project.entity.Category;
import com.company.project.exception.ResourceNotFoundException;
import com.company.project.repository.CategoryRepository;
import com.company.project.service.CategoryService;
import com.company.project.service.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    @Override
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(CategoryResponse::fromEntity)
                .toList();
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return CategoryResponse.fromEntity(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());

        // Set image URL if provided or upload image
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrl = fileStorageService.storeFile(request.getImage());
            category.setImageUrl(imageUrl);
        } else if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            category.setImageUrl(request.getImageUrl());
        }

        if (request.getParentCategoryId() != null) {
            Category parentCategory = categoryRepository.findById(request.getParentCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Parent category not found with id: " + request.getParentCategoryId()));
            category.setParentCategory(parentCategory);
        }

        category.setStatus(Category.Status.ACTIVE);
        Category savedCategory = categoryRepository.save(category);
        return CategoryResponse.fromEntity(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        category.setName(request.getName());
        category.setDescription(request.getDescription());

        // Handle image update
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            // Delete old image if exists
            if (category.getImageUrl() != null && !category.getImageUrl().isEmpty()) {
                fileStorageService.deleteFile(category.getImageUrl());
            }
            // Upload new image
            String imageUrl = fileStorageService.storeFile(request.getImage());
            category.setImageUrl(imageUrl);
        } else if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            // Only update URL if it's different
            if (!request.getImageUrl().equals(category.getImageUrl())) {
                // Delete old image if exists
                if (category.getImageUrl() != null && !category.getImageUrl().isEmpty()) {
                    fileStorageService.deleteFile(category.getImageUrl());
                }
                category.setImageUrl(request.getImageUrl());
            }
        }

        if (request.getParentCategoryId() != null) {
            Category parentCategory = categoryRepository.findById(request.getParentCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Parent category not found with id: " + request.getParentCategoryId()));
            category.setParentCategory(parentCategory);
        } else {
            category.setParentCategory(null);
        }

        Category updatedCategory = categoryRepository.save(category);
        return CategoryResponse.fromEntity(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        // Check if category has products
        if (categoryRepository.hasProducts(id)) {
            throw new IllegalStateException("Cannot delete category with products");
        }

        categoryRepository.delete(category);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategoryStatus(Long id, Category.Status status) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        category.setStatus(status);
        Category updatedCategory = categoryRepository.save(category);
        return CategoryResponse.fromEntity(updatedCategory);
    }
}
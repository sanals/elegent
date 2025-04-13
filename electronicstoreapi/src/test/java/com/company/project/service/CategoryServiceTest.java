package com.company.project.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.company.project.dto.request.CategoryRequest;
import com.company.project.dto.response.CategoryResponse;
import com.company.project.entity.Category;
import com.company.project.exception.ResourceNotFoundException;
import com.company.project.repository.CategoryRepository;
import com.company.project.service.impl.CategoryServiceImpl;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private Category category;
    private Category parentCategory;
    private Category subCategory;
    private CategoryResponse categoryResponse;
    private CategoryRequest categoryRequest;

    @BeforeEach
    void setUp() {
        // Setup parent category
        parentCategory = new Category();
        parentCategory.setId(1L);
        parentCategory.setName("Electronics");
        parentCategory.setDescription("Electronic items");
        parentCategory.setStatus(Category.Status.ACTIVE);
        parentCategory.setSubCategories(new ArrayList<>());

        // Setup main category
        category = new Category();
        category.setId(2L);
        category.setName("Smartphones");
        category.setDescription("Mobile phones");
        category.setStatus(Category.Status.ACTIVE);
        category.setParentCategory(parentCategory);
        category.setSubCategories(new ArrayList<>());

        // Add main category as subcategory to parent
        parentCategory.getSubCategories().add(category);

        // Setup subcategory
        subCategory = new Category();
        subCategory.setId(3L);
        subCategory.setName("Android Phones");
        subCategory.setDescription("Android mobile devices");
        subCategory.setStatus(Category.Status.ACTIVE);
        subCategory.setParentCategory(category);

        // Add subcategory to main category
        category.getSubCategories().add(subCategory);

        categoryResponse = CategoryResponse.builder()
                .id(2L)
                .name("Smartphones")
                .description("Mobile phones")
                .status(Category.Status.ACTIVE)
                .build();

        categoryRequest = new CategoryRequest();
        categoryRequest.setName("Smartphones");
        categoryRequest.setDescription("Mobile phones");
    }

    @Test
    void getAllCategories_shouldReturnAllCategories() {
        // Arrange
        List<Category> categoryEntities = Arrays.asList(category);
        when(categoryRepository.findAll()).thenReturn(categoryEntities);

        // Act
        List<CategoryResponse> result = categoryService.getAllCategories();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Smartphones", result.get(0).getName());
        assertEquals("Mobile phones", result.get(0).getDescription());
        assertEquals(Category.Status.ACTIVE, result.get(0).getStatus());
        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    void getAllCategories_withEmptyList_shouldReturnEmptyList() {
        // Arrange
        when(categoryRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        List<CategoryResponse> result = categoryService.getAllCategories();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    void getAllCategories_withNestedCategories_shouldReturnCategoriesWithHierarchy() {
        // Arrange
        List<Category> categoryEntities = Arrays.asList(parentCategory, category, subCategory);
        when(categoryRepository.findAll()).thenReturn(categoryEntities);

        // Act
        List<CategoryResponse> result = categoryService.getAllCategories();

        // Assert
        assertNotNull(result);
        assertEquals(3, result.size());

        // Find parent category in results
        CategoryResponse parentResult = result.stream()
                .filter(c -> c.getId().equals(1L))
                .findFirst()
                .orElse(null);

        assertNotNull(parentResult);
        assertEquals("Electronics", parentResult.getName());
        assertNull(parentResult.getParentCategory());
        assertNotNull(parentResult.getSubCategories());
        assertEquals(1, parentResult.getSubCategories().size());
        assertEquals(2L, parentResult.getSubCategories().get(0).getId());

        // Find main category in results
        CategoryResponse mainResult = result.stream()
                .filter(c -> c.getId().equals(2L))
                .findFirst()
                .orElse(null);

        assertNotNull(mainResult);
        assertEquals("Smartphones", mainResult.getName());
        assertNotNull(mainResult.getParentCategory());
        assertEquals(1L, mainResult.getParentCategory().getId());
        assertNotNull(mainResult.getSubCategories());
        assertEquals(1, mainResult.getSubCategories().size());
        assertEquals(3L, mainResult.getSubCategories().get(0).getId());

        // Find subcategory in results
        CategoryResponse subResult = result.stream()
                .filter(c -> c.getId().equals(3L))
                .findFirst()
                .orElse(null);

        assertNotNull(subResult);
        assertEquals("Android Phones", subResult.getName());
        assertNotNull(subResult.getParentCategory());
        assertEquals(2L, subResult.getParentCategory().getId());
        assertTrue(subResult.getSubCategories() == null || subResult.getSubCategories().isEmpty());

        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    void getCategoryById_withValidId_shouldReturnCategory() {
        // Arrange
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(category));

        // Act
        CategoryResponse result = categoryService.getCategoryById(2L);

        // Assert
        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("Smartphones", result.getName());
        verify(categoryRepository, times(1)).findById(2L);
    }

    @Test
    void getCategoryById_withInvalidId_shouldThrowException() {
        // Arrange
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> categoryService.getCategoryById(99L));
        verify(categoryRepository, times(1)).findById(99L);
    }

    @Test
    void createCategory_shouldSaveAndReturnCategory() {
        // Arrange
        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        // Act
        CategoryResponse result = categoryService.createCategory(categoryRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Smartphones", result.getName());
        assertEquals("Mobile phones", result.getDescription());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void updateCategory_shouldUpdateAndReturnCategory() {
        // Arrange
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(category));
        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        // Act
        CategoryResponse result = categoryService.updateCategory(2L, categoryRequest);

        // Assert
        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("Smartphones", result.getName());
        assertEquals("Mobile phones", result.getDescription());
        verify(categoryRepository, times(1)).findById(2L);
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void updateCategoryStatus_shouldUpdateStatusAndReturnCategory() {
        // Arrange
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(category));
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> {
            Category savedCategory = invocation.getArgument(0);
            assertEquals(Category.Status.INACTIVE, savedCategory.getStatus());
            return savedCategory;
        });

        // Act
        CategoryResponse result = categoryService.updateCategoryStatus(2L, Category.Status.INACTIVE);

        // Assert
        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("Smartphones", result.getName());
        assertEquals(Category.Status.INACTIVE, result.getStatus());
        verify(categoryRepository, times(1)).findById(2L);
        verify(categoryRepository, times(1)).save(category);
    }

    @Test
    void updateCategoryStatus_withInvalidId_shouldThrowException() {
        // Arrange
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class,
                () -> categoryService.updateCategoryStatus(99L, Category.Status.INACTIVE));
        verify(categoryRepository, times(1)).findById(99L);
        verify(categoryRepository, never()).save(any());
    }

    @Test
    void deleteCategory_withNoProducts_shouldDeleteCategory() {
        // Arrange
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(category));
        when(categoryRepository.hasProducts(2L)).thenReturn(false);
        doNothing().when(categoryRepository).delete(category);

        // Act
        categoryService.deleteCategory(2L);

        // Assert
        verify(categoryRepository, times(1)).delete(category);
    }

    @Test
    void deleteCategory_withProducts_shouldThrowException() {
        // Arrange
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(category));
        when(categoryRepository.hasProducts(2L)).thenReturn(true);

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> categoryService.deleteCategory(2L));
        verify(categoryRepository, never()).delete(any());
    }
}
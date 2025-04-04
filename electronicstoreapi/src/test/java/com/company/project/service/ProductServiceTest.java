package com.company.project.service;

import com.company.project.dto.request.ProductRequest;
import com.company.project.entity.Category;
import com.company.project.entity.Product;
import com.company.project.exception.ResourceNotFoundException;
import com.company.project.repository.ProductRepository;
import com.company.project.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product product;
    private Category category;
    private ProductRequest productRequest;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(1L);
        category.setName("Electronics");

        product = new Product();
        product.setId(1L);
        product.setName("Smartphone");
        product.setDescription("Latest model");
        product.setPrice(new BigDecimal("999.99"));
        product.setCategory(category);
        product.setStock(100);
        product.setStatus(Product.Status.ACTIVE);

        productRequest = new ProductRequest();
        productRequest.setName("Smartphone");
        productRequest.setDescription("Latest model");
        productRequest.setPrice(new BigDecimal("999.99"));
        productRequest.setCategoryId(1L);
        productRequest.setStock(100);

        pageable = Pageable.ofSize(10);
    }

    @Test
    void getAllProducts_shouldReturnPageOfProducts() {
        // Arrange
        Page<Product> productPage = new PageImpl<>(Arrays.asList(product));
        when(productRepository.findAll(pageable)).thenReturn(productPage);

        // Act
        Page<Product> result = productService.getAllProducts(pageable);

        // Assert
        assertEquals(1, result.getTotalElements());
        assertEquals("Smartphone", result.getContent().get(0).getName());
        verify(productRepository, times(1)).findAll(pageable);
    }

    @Test
    void getProductById_withValidId_shouldReturnProduct() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act
        Product result = productService.getProductById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Smartphone", result.getName());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void getProductById_withInvalidId_shouldThrowException() {
        // Arrange
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById(99L));
        verify(productRepository, times(1)).findById(99L);
    }

    @Test
    void createProduct_shouldSaveAndReturnProduct() {
        // Arrange
        when(categoryService.getCategoryById(1L)).thenReturn(category);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        // Act
        Product result = productService.createProduct(productRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Smartphone", result.getName());
        assertEquals(new BigDecimal("999.99"), result.getPrice());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void updateProductStatus_shouldUpdateAndReturnProduct() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        // Act
        Product result = productService.updateProductStatus(1L, Product.Status.INACTIVE);

        // Assert
        assertEquals(Product.Status.INACTIVE, result.getStatus());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void getLowStockProducts_shouldReturnLowStockProducts() {
        // Arrange
        when(productRepository.findByStockLessThan(10)).thenReturn(Arrays.asList(product));

        // Act
        List<Product> result = productService.getLowStockProducts(10);

        // Assert
        assertEquals(1, result.size());
        assertEquals("Smartphone", result.get(0).getName());
        verify(productRepository, times(1)).findByStockLessThan(10);
    }
} 
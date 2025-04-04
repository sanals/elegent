package com.company.project.service;

import com.company.project.dto.request.ProductRequest;
import com.company.project.dto.request.ProductCreateRequest;
import com.company.project.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    Page<Product> getAllProducts(Pageable pageable);
    
    Product getProductById(Long id);
    
    Product createProduct(ProductRequest request);
    
    Product updateProduct(Long id, ProductRequest request);
    
    void deleteProduct(Long id);
    
    Product uploadProductImages(Long id, List<MultipartFile> images);
    
    Product updateProductStatus(Long id, Product.Status status);
    
    Page<Product> searchProducts(String keyword, Long categoryId, Product.Status status, Pageable pageable);
    
    List<Product> getLowStockProducts(Integer threshold);
    
    String uploadSingleImage(MultipartFile image);
    
    Product createProductWithImages(ProductCreateRequest request);
    
    Product updateProductWithImages(Long id, ProductCreateRequest request);
} 
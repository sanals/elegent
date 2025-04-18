package com.company.project.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.company.project.dto.request.ProductCreateRequest;
import com.company.project.dto.request.ProductRequest;
import com.company.project.dto.response.ProductResponse;
import com.company.project.entity.Product;

public interface ProductService {
    Page<ProductResponse> getAllProducts(Pageable pageable);

    Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable);

    Page<ProductResponse> searchProducts(String keyword, Pageable pageable);

    Page<ProductResponse> searchProducts(String keyword, Long categoryId, Product.Status status, Pageable pageable);

    Page<ProductResponse> getProductsByCategoryAndStatus(Long categoryId, Product.Status status, Pageable pageable);

    ProductResponse getProductById(Long id);

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);

    ProductResponse createProductWithImages(ProductCreateRequest request, List<MultipartFile> images);

    ProductResponse createProductWithImages(ProductCreateRequest request);

    ProductResponse updateProductWithImages(Long id, ProductRequest request, List<MultipartFile> images);

    ProductResponse updateProductWithImages(Long id, ProductCreateRequest request);

    ProductResponse uploadProductImages(Long id, List<MultipartFile> images);

    ProductResponse updateProductStatus(Long id, Product.Status status);

    Page<ProductResponse> getFeaturedProducts(Pageable pageable);

    Page<ProductResponse> getLatestProducts(Pageable pageable);

    ProductResponse toggleProductFeatured(Long id, boolean featured);

    List<ProductResponse> getLowStockProducts(Integer threshold);

    Page<ProductResponse> getLowStockProductsPaginated(Integer threshold, Pageable pageable);

    String uploadSingleImage(MultipartFile image);

    List<String> uploadImages(List<MultipartFile> images);
}
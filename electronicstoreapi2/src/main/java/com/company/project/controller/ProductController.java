package com.company.project.controller;

import com.company.project.dto.request.ProductRequest;
import com.company.project.dto.request.ProductCreateRequest;
import com.company.project.dto.response.ApiResponse;
import com.company.project.dto.response.ProductResponse;
import com.company.project.entity.Product;
import com.company.project.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getAllProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Product.Status status,
            @PageableDefault(size = 10) Pageable pageable) {
        
        Page<Product> productsPage = productService.searchProducts(keyword, categoryId, status, pageable);
        
        List<ProductResponse> productResponses = productsPage.getContent().stream()
                .map(ProductResponse::fromEntity)
                .collect(Collectors.toList());
        
        Page<ProductResponse> productResponsePage = new PageImpl<>(
                productResponses, pageable, productsPage.getTotalElements());
        
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), 
                "Products retrieved successfully", productResponsePage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        ProductResponse response = ProductResponse.fromEntity(product);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), 
                "Product retrieved successfully", response));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request) {
        Product product = productService.createProduct(request);
        ProductResponse response = ProductResponse.fromEntity(product);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("SUCCESS", HttpStatus.CREATED.value(), 
                        "Product created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Long id, 
                                                              @Valid @RequestBody ProductRequest request) {
        Product product = productService.updateProduct(id, request);
        ProductResponse response = ProductResponse.fromEntity(product);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), 
                "Product updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), 
                "Product deleted successfully", null));
    }

    @PostMapping(value = "/{id}/upload-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> uploadProductImages(@PathVariable Long id, 
                                                  @RequestParam("images") List<MultipartFile> images) {
        Product product = productService.uploadProductImages(id, images);
        ProductResponse response = ProductResponse.fromEntity(product);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), 
                "Product images uploaded successfully", response));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProductStatus(
            @PathVariable Long id, @RequestParam Product.Status status) {
        Product product = productService.updateProductStatus(id, status);
        ProductResponse response = ProductResponse.fromEntity(product);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), 
                "Product status updated successfully", response));
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getLowStockProducts(@RequestParam(defaultValue = "5") Integer threshold) {
        List<Product> products = productService.getLowStockProducts(threshold);
        List<ProductResponse> responses = products.stream()
                .map(ProductResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), 
                "Low stock products retrieved successfully", responses));
    }

    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<String>>> uploadImage(@RequestParam("images") List<MultipartFile> images) {
        List<String> imageUrls = new ArrayList<>();
        
        for (MultipartFile image : images) {
            String imageUrl = productService.uploadSingleImage(image);
            imageUrls.add(imageUrl);
        }
        
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), 
                "Images uploaded successfully", imageUrls));
    }
    
    @PostMapping(value = "/with-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProductWithImages(
            @ModelAttribute ProductCreateRequest request) {
        
        Product product = productService.createProductWithImages(request);
        ProductResponse response = ProductResponse.fromEntity(product);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("SUCCESS", HttpStatus.CREATED.value(), 
                        "Product created successfully with images", response));
    }

    @PutMapping(value = "/{id}/with-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProductWithImages(
            @PathVariable Long id,
            @ModelAttribute ProductCreateRequest request) {
        
        Product product = productService.updateProductWithImages(id, request);
        ProductResponse response = ProductResponse.fromEntity(product);
        
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), 
                "Product updated successfully with images", response));
    }
} 
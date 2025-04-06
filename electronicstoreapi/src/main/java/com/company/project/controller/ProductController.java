package com.company.project.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
import org.springframework.web.multipart.MultipartFile;

import com.company.project.dto.request.ProductCreateRequest;
import com.company.project.dto.request.ProductRequest;
import com.company.project.dto.response.ApiResponse;
import com.company.project.dto.response.ProductResponse;
import com.company.project.entity.Product;
import com.company.project.service.ProductService;
import com.company.project.service.ResponseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controller handling product-related API endpoints
 * 
 * Provides endpoints for managing products including creation, retrieval,
 * updates, deletion, and image management. Some operations require admin
 * privileges.
 */
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

        private final ProductService productService;
        private final ResponseService responseService;

        /**
         * Get all products with optional filtering and pagination
         * 
         * @param keyword    Optional search keyword for product filtering
         * @param categoryId Optional category ID for filtering
         * @param status     Optional product status for filtering
         * @param pageable   Pagination information
         * @return ApiResponse containing page of filtered products
         */
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

                return ResponseEntity.ok(
                                responseService.createPageResponse(productResponsePage,
                                                "Products retrieved successfully"));
        }

        /**
         * Get a product by its ID
         * 
         * @param id Product ID
         * @return ApiResponse containing the requested product
         */
        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
                Product product = productService.getProductById(id);
                ProductResponse response = ProductResponse.fromEntity(product);

                return ResponseEntity.ok(
                                responseService.createSingleResponse(response, "Product retrieved successfully"));
        }

        /**
         * Create a new product
         * 
         * @param request Product creation data
         * @return ApiResponse with created product
         */
        @PostMapping
        @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request) {
                Product product = productService.createProduct(request);
                ProductResponse response = ProductResponse.fromEntity(product);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(responseService.createCreatedResponse(response, "Product created successfully"));
        }

        /**
         * Update an existing product
         * 
         * @param id      Product ID to update
         * @param request Updated product data
         * @return ApiResponse with updated product
         */
        @PutMapping("/{id}")
        @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Long id,
                        @Valid @RequestBody ProductRequest request) {
                Product product = productService.updateProduct(id, request);
                ProductResponse response = ProductResponse.fromEntity(product);

                return ResponseEntity.ok(
                                responseService.createSingleResponse(response, "Product updated successfully"));
        }

        /**
         * Delete a product
         * 
         * @param id Product ID to delete
         * @return ApiResponse with success message
         */
        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
                productService.deleteProduct(id);

                return ResponseEntity.ok(
                                responseService.createEmptyResponse("Product deleted successfully"));
        }

        /**
         * Upload images to an existing product
         * 
         * @param id     Product ID
         * @param images List of image files to upload
         * @return ApiResponse with updated product including images
         */
        @PostMapping(value = "/{id}/upload-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<ProductResponse>> uploadProductImages(@PathVariable Long id,
                        @RequestParam("images") List<MultipartFile> images) {
                Product product = productService.uploadProductImages(id, images);
                ProductResponse response = ProductResponse.fromEntity(product);

                return ResponseEntity.ok(
                                responseService.createSingleResponse(response, "Product images uploaded successfully"));
        }

        /**
         * Update product status
         * 
         * @param id     Product ID
         * @param status New status value
         * @return ApiResponse with updated product
         */
        @PutMapping("/{id}/status")
        @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<ProductResponse>> updateProductStatus(
                        @PathVariable Long id, @RequestParam Product.Status status) {
                Product product = productService.updateProductStatus(id, status);
                ProductResponse response = ProductResponse.fromEntity(product);

                return ResponseEntity.ok(
                                responseService.createSingleResponse(response, "Product status updated successfully"));
        }

        /**
         * Get products with low stock levels
         * 
         * @param threshold Stock level threshold (default: 5)
         * @param pageable  Pagination information
         * @return ApiResponse containing page of low stock products
         */
        @GetMapping("/low-stock")
        @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<Page<ProductResponse>>> getLowStockProducts(
                        @RequestParam(defaultValue = "5") Integer threshold,
                        @PageableDefault(size = 10) Pageable pageable) {
                List<Product> products = productService.getLowStockProducts(threshold);
                List<ProductResponse> responses = products.stream()
                                .map(ProductResponse::fromEntity)
                                .collect(Collectors.toList());

                return ResponseEntity.ok(
                                responseService.createPageResponse(responses, pageable,
                                                "Low stock products retrieved successfully"));
        }

        /**
         * Upload product images without associating with a product
         * 
         * @param images List of image files to upload
         * @return ApiResponse with list of image URLs
         */
        @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<List<String>>> uploadImage(
                        @RequestParam("images") List<MultipartFile> images) {
                List<String> imageUrls = new ArrayList<>();

                for (MultipartFile image : images) {
                        String imageUrl = productService.uploadSingleImage(image);
                        imageUrls.add(imageUrl);
                }

                return ResponseEntity.ok(
                                responseService.createSingleResponse(imageUrls, "Images uploaded successfully"));
        }

        /**
         * Create a new product with images in a single request
         * 
         * @param request Product creation data with images
         * @return ApiResponse with created product including images
         */
        @PostMapping(value = "/with-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<ProductResponse>> createProductWithImages(
                        @ModelAttribute ProductCreateRequest request) {

                Product product = productService.createProductWithImages(request);
                ProductResponse response = ProductResponse.fromEntity(product);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(responseService.createCreatedResponse(response,
                                                "Product created successfully with images"));
        }

        /**
         * Update an existing product with images in a single request
         * 
         * @param id      Product ID to update
         * @param request Updated product data with images
         * @return ApiResponse with updated product including images
         */
        @PutMapping(value = "/{id}/with-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<ProductResponse>> updateProductWithImages(
                        @PathVariable Long id,
                        @ModelAttribute ProductCreateRequest request) {

                Product product = productService.updateProductWithImages(id, request);
                ProductResponse response = ProductResponse.fromEntity(product);

                return ResponseEntity.ok(
                                responseService.createSingleResponse(response,
                                                "Product updated successfully with images"));
        }
}
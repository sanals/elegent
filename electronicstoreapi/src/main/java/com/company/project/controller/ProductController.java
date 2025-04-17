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
        public ResponseEntity<ApiResponse<Page<ProductResponse>>> getProducts(
                        @RequestParam(required = false) String keyword,
                        @RequestParam(required = false) Long categoryId,
                        @RequestParam(required = false) Product.Status status,
                        @PageableDefault(size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {

                Page<ProductResponse> products = productService.searchProducts(keyword, categoryId, status, pageable);
                return ResponseEntity.ok(
                                responseService.success(products));
        }

        /**
         * Get a product by its ID
         * 
         * @param id Product ID
         * @return ApiResponse containing the requested product
         */
        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
                ProductResponse product = productService.getProductById(id);
                return ResponseEntity.ok(
                                responseService.createSingleResponse(product, "Product retrieved successfully"));
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
                ProductResponse product = productService.createProduct(request);
                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(responseService.createCreatedResponse(product, "Product created successfully"));
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
                ProductResponse product = productService.updateProduct(id, request);
                return ResponseEntity.ok(
                                responseService.createSingleResponse(product, "Product updated successfully"));
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
        @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
        public ResponseEntity<ApiResponse<ProductResponse>> uploadProductImages(@PathVariable Long id,
                        @RequestParam("images") List<MultipartFile> images) {
                ProductResponse product = productService.uploadProductImages(id, images);
                return ResponseEntity.ok(
                                responseService.createSingleResponse(product, "Images uploaded successfully"));
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
                ProductResponse product = productService.updateProductStatus(id, status);
                return ResponseEntity.ok(
                                responseService.createSingleResponse(product, "Product status updated successfully"));
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

                Page<ProductResponse> productPage = productService.getLowStockProductsPaginated(threshold, pageable);
                return ResponseEntity.ok(
                                responseService.createPageResponse(productPage,
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

                List<String> imageUrls = productService.uploadImages(images);
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

                ProductResponse product = productService.createProductWithImages(request);
                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(responseService.createCreatedResponse(product,
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

                ProductResponse product = productService.updateProductWithImages(id, request);
                return ResponseEntity.ok(
                                responseService.createSingleResponse(product,
                                                "Product updated successfully with images"));
        }

        /**
         * Get featured products for the homepage carousel
         * 
         * @param pageable Pagination information
         * @return ApiResponse containing page of featured products
         */
        @GetMapping("/featured")
        public ResponseEntity<ApiResponse<Page<ProductResponse>>> getFeaturedProducts(
                        @PageableDefault(size = 5, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {

                Page<ProductResponse> featuredProducts = productService.getFeaturedProducts(pageable);
                return ResponseEntity.ok(
                                responseService.success(featuredProducts));
        }

        /**
         * Get latest products for the homepage
         * 
         * @param pageable Pagination information
         * @return ApiResponse containing page of latest products
         */
        @GetMapping("/latest")
        public ResponseEntity<ApiResponse<Page<ProductResponse>>> getLatestProducts(
                        @PageableDefault(size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {

                Page<ProductResponse> latestProducts = productService.getLatestProducts(pageable);
                return ResponseEntity.ok(
                                responseService.success(latestProducts));
        }

        /**
         * Toggle the featured status of a product
         * 
         * @param id       Product ID
         * @param featured Whether the product should be featured
         * @return ApiResponse containing the updated product
         */
        @PreAuthorize("hasRole('ADMIN')")
        @PutMapping("/{id}/featured")
        public ResponseEntity<ApiResponse<ProductResponse>> toggleProductFeatured(
                        @PathVariable Long id,
                        @RequestParam boolean featured) {

                ProductResponse updatedProduct = productService.toggleProductFeatured(id, featured);
                return ResponseEntity.ok(
                                responseService.success(updatedProduct));
        }
}
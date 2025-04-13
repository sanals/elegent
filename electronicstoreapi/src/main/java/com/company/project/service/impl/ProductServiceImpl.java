package com.company.project.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.company.project.dto.request.ProductCreateRequest;
import com.company.project.dto.request.ProductRequest;
import com.company.project.dto.response.ProductResponse;
import com.company.project.entity.Category;
import com.company.project.entity.Product;
import com.company.project.exception.ResourceNotFoundException;
import com.company.project.repository.CategoryRepository;
import com.company.project.repository.ProductRepository;
import com.company.project.service.FileStorageService;
import com.company.project.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    @Override
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(this::convertToResponse);
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = findProductById(id);
        return convertToResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = getCategory(request.getCategoryId());

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setSpecifications(request.getSpecifications());
        product.setStock(request.getStock());
        product.setStatus(Product.Status.ACTIVE);

        Product savedProduct = productRepository.save(product);
        return convertToResponse(savedProduct);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findProductById(id);
        Category category = getCategory(request.getCategoryId());

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setSpecifications(request.getSpecifications());
        product.setStock(request.getStock());

        Product updatedProduct = productRepository.save(product);
        return convertToResponse(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = findProductById(id);

        // Delete associated images from storage
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            for (String imageUrl : product.getImages()) {
                fileStorageService.deleteFile(imageUrl);
            }
        }

        productRepository.delete(product);
    }

    @Override
    @Transactional
    public ProductResponse uploadProductImages(Long id, List<MultipartFile> images) {
        Product product = findProductById(id);
        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile image : images) {
            String imageUrl = fileStorageService.storeFile(image);
            imageUrls.add(imageUrl);
        }

        product.setImages(imageUrls);
        Product updatedProduct = productRepository.save(product);
        return convertToResponse(updatedProduct);
    }

    @Override
    @Transactional
    public ProductResponse updateProductStatus(Long id, Product.Status status) {
        Product product = findProductById(id);
        product.setStatus(status);
        Product updatedProduct = productRepository.save(product);
        return convertToResponse(updatedProduct);
    }

    @Override
    public Page<ProductResponse> searchProducts(String keyword, Long categoryId, Product.Status status,
            Pageable pageable) {
        Page<Product> products;
        if (keyword != null && !keyword.isEmpty()) {
            products = productRepository.findByNameContainingIgnoreCase(keyword, pageable);
        } else if (categoryId != null && status != null) {
            products = productRepository.findByCategoryIdAndStatus(categoryId, status, pageable);
        } else if (categoryId != null) {
            products = productRepository.findByCategoryId(categoryId, pageable);
        } else {
            products = productRepository.findAll(pageable);
        }
        return products.map(this::convertToResponse);
    }

    @Override
    public List<ProductResponse> getLowStockProducts(Integer threshold) {
        List<Product> products = productRepository.findByStockLessThan(threshold);
        return products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ProductResponse> getLowStockProductsPaginated(Integer threshold, Pageable pageable) {
        List<Product> products = productRepository.findByStockLessThan(threshold);
        List<ProductResponse> responses = products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        // Create paginated response
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), responses.size());

        List<ProductResponse> pageContent = start < responses.size() ? responses.subList(start, end)
                : new ArrayList<>();

        return new PageImpl<>(pageContent, pageable, responses.size());
    }

    @Override
    public String uploadSingleImage(MultipartFile image) {
        return fileStorageService.storeFile(image);
    }

    @Override
    public List<String> uploadImages(List<MultipartFile> images) {
        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                String imageUrl = fileStorageService.storeFile(image);
                imageUrls.add(imageUrl);
            }
        }

        return imageUrls;
    }

    @Override
    @Transactional
    public ProductResponse createProductWithImages(ProductCreateRequest request) {
        Category category = getCategory(request.getCategoryId());

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setSpecifications(request.getSpecifications());
        product.setStock(request.getStock());
        product.setStatus(Product.Status.ACTIVE);

        Product savedProduct = productRepository.save(product);

        List<String> imageUrls = new ArrayList<>();
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            for (MultipartFile image : request.getImages()) {
                if (!image.isEmpty()) {
                    String imageUrl = fileStorageService.storeFile(image);
                    imageUrls.add(imageUrl);
                }
            }
            savedProduct.setImages(imageUrls);
            savedProduct = productRepository.save(savedProduct);
        }

        return convertToResponse(savedProduct);
    }

    @Override
    @Transactional
    public ProductResponse updateProductWithImages(Long id, ProductCreateRequest request) {
        Product product = findProductById(id);
        Category category = getCategory(request.getCategoryId());

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setSpecifications(request.getSpecifications());
        product.setStock(request.getStock());

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            List<String> imageUrls = product.getImages() != null ? new ArrayList<>(product.getImages())
                    : new ArrayList<>();
            for (MultipartFile image : request.getImages()) {
                if (!image.isEmpty()) {
                    String imageUrl = fileStorageService.storeFile(image);
                    imageUrls.add(imageUrl);
                }
            }
            product.setImages(imageUrls);
        }

        Product updatedProduct = productRepository.save(product);
        return convertToResponse(updatedProduct);
    }

    private Category getCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }

    private Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    private ProductResponse convertToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory() != null ? new ProductResponse.CategorySummary(
                        product.getCategory().getId(),
                        product.getCategory().getName(),
                        product.getCategory().getDescription())
                        : null)
                .specifications(product.getSpecifications())
                .stock(product.getStock())
                .status(product.getStatus())
                .images(product.getImages())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
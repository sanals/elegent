package com.company.project.service.impl;

import com.company.project.dto.request.ProductRequest;
import com.company.project.dto.request.ProductCreateRequest;
import com.company.project.entity.Category;
import com.company.project.entity.Product;
import com.company.project.exception.ResourceNotFoundException;
import com.company.project.repository.ProductRepository;
import com.company.project.service.CategoryService;
import com.company.project.service.FileStorageService;
import com.company.project.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;
    private final FileStorageService fileStorageService;

    @Override
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    @Transactional
    public Product createProduct(ProductRequest request) {
        Category category = categoryService.getCategoryById(request.getCategoryId());
        
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setSpecifications(request.getSpecifications());
        product.setStock(request.getStock());
        product.setStatus(Product.Status.ACTIVE);
        
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);
        Category category = categoryService.getCategoryById(request.getCategoryId());
        
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setSpecifications(request.getSpecifications());
        product.setStock(request.getStock());
        
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        
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
    public Product uploadProductImages(Long id, List<MultipartFile> images) {
        Product product = getProductById(id);
        List<String> imageUrls = new ArrayList<>();
        
        for (MultipartFile image : images) {
            String imageUrl = fileStorageService.storeFile(image);
            imageUrls.add(imageUrl);
        }
        
        product.setImages(imageUrls);
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProductStatus(Long id, Product.Status status) {
        Product product = getProductById(id);
        product.setStatus(status);
        return productRepository.save(product);
    }

    @Override
    public Page<Product> searchProducts(String keyword, Long categoryId, Product.Status status, Pageable pageable) {
        if (keyword != null && !keyword.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(keyword, pageable);
        } else if (categoryId != null && status != null) {
            return productRepository.findByCategoryIdAndStatus(categoryId, status, pageable);
        } else if (categoryId != null) {
            return productRepository.findByCategoryId(categoryId, pageable);
        } else {
            return productRepository.findAll(pageable);
        }
    }

    @Override
    public List<Product> getLowStockProducts(Integer threshold) {
        return productRepository.findByStockLessThan(threshold);
    }

    @Override
    public String uploadSingleImage(MultipartFile image) {
        return fileStorageService.storeFile(image);
    }

    @Override
    @Transactional
    public Product createProductWithImages(ProductCreateRequest request) {
        Category category = categoryService.getCategoryById(request.getCategoryId());
        
        // Create and save the product
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setSpecifications(request.getSpecifications());
        product.setStock(request.getStock());
        product.setStatus(Product.Status.ACTIVE);
        
        // Save the product first to get an ID
        product = productRepository.save(product);
        
        // Process and store images
        List<String> imageUrls = new ArrayList<>();
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            for (MultipartFile image : request.getImages()) {
                if (!image.isEmpty()) {
                    String imageUrl = fileStorageService.storeFile(image);
                    imageUrls.add(imageUrl);
                }
            }
            
            // Set the image URLs and save the product again
            product.setImages(imageUrls);
            product = productRepository.save(product);
        }
        
        return product;
    }

    @Override
    @Transactional
    public Product updateProductWithImages(Long id, ProductCreateRequest request) {
        Product product = getProductById(id);
        Category category = categoryService.getCategoryById(request.getCategoryId());
        
        // Update product details
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setSpecifications(request.getSpecifications());
        product.setStock(request.getStock());
        
        // Process and store new images (if any)
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            // Get existing images to avoid overwriting them
            List<String> imageUrls = product.getImages() != null ? 
                new ArrayList<>(product.getImages()) : new ArrayList<>();
            
            for (MultipartFile image : request.getImages()) {
                if (!image.isEmpty()) {
                    String imageUrl = fileStorageService.storeFile(image);
                    imageUrls.add(imageUrl);
                }
            }
            
            // Set the updated image URLs
            product.setImages(imageUrls);
        }
        
        return productRepository.save(product);
    }
} 
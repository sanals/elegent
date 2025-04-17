package com.company.project.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.company.project.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.category.id = ?1 AND p.status = ?2")
    Page<Product> findByCategoryIdAndStatus(Long categoryId, Product.Status status, Pageable pageable);

    List<Product> findByStockLessThan(Integer minStock);

    // Find featured products
    Page<Product> findByFeaturedTrueAndStatusOrderByCreatedAtDesc(Product.Status status, Pageable pageable);

    // Find latest products by created date
    Page<Product> findByStatusOrderByCreatedAtDesc(Product.Status status, Pageable pageable);
}
package com.company.project.repository;

import com.company.project.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.category.id = ?1 AND p.status = ?2")
    Page<Product> findByCategoryIdAndStatus(Long categoryId, Product.Status status, Pageable pageable);
    
    List<Product> findByStockLessThan(Integer minStock);
} 
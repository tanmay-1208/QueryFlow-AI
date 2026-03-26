package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // This fixed the red line under findByUserId in ChatController
    List<Product> findByUserId(String userId);
}
package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // This handles the request from your screenshot: /api/products?userId=...
    @GetMapping
    public List<Product> getProducts(@RequestParam(required = false) String userId) {
        // For now, return all products so the $15M shows up. 
        // We can add user-specific filtering once the dashboard is alive.
        return productRepository.findAll();
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}
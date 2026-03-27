package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // Allows Vercel to talk to this specific controller
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // 1. Fetch assets (Fixes the $0 valuation)
    @GetMapping
    public List<Product> getProducts(@RequestParam(required = false) String userId) {
        return productRepository.findAll();
    }

    // 2. Save assets (Fixes the "Terminal Error")
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}
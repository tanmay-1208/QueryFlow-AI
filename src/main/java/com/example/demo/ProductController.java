package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // Crucial to stop the CORS error in your screenshot
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // Handles fetching the dashboard data
    @GetMapping
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    // Handles the [ EXECUTE ] button in your terminal
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}
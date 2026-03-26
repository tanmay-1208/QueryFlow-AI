package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows Vercel to communicate with Railway
public class ChatController {

    @Autowired
    private ProductRepository productRepository;

    // --- FETCH: Load items for the specific logged-in user ---
    @GetMapping("/products")
    public List<Product> getProducts(@RequestParam String userId) {
        return productRepository.findByUserId(userId);
    }

    // --- EXECUTE: Save new asset to Supabase ---
    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product) {
        // Spring Boot uses the Getters/Setters in Product.java to map this
        return productRepository.save(product);
    }

    // --- DELETE: Remove asset from Vault ---
    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }

    // --- UPDATE: Change stock levels ---
    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product details) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Asset not found"));
        product.setStock(details.getStock());
        return productRepository.save(product);
    }
}
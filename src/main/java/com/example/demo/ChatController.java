package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows your Vercel/Local frontend to connect
public class ChatController {

    @Autowired
    private ProductRepository productRepository;

    // --- 1. VAULT: GET ALL ASSETS FOR A USER ---
    @GetMapping("/products")
    public List<Product> getProducts(@RequestParam String userId) {
        System.out.println("Fetching assets for Terminal UUID: " + userId);
        return productRepository.findByUserId(userId);
    }

    // --- 2. VAULT: EXECUTE NEW ASSET ENTRY ---
    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product) {
        System.out.println("Vaulting new asset: " + product.getName() + " for user: " + product.getUserId());
        return productRepository.save(product);
    }

    // --- 3. VAULT: UPDATE STOCK (ADD/SELL) ---
    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found in Vault"));
        
        product.setStock(productDetails.getStock());
        return productRepository.save(product);
    }

    // --- 4. VAULT: LIQUIDATE ASSET (DELETE) ---
    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }

    // --- EXISTING CHAT LOGIC ---
    @PostMapping("/chat")
    public String chat(@RequestBody String message) {
        // Your existing AI logic here
        return "CFO AI: Analysis complete for query: " + message;
    }
}
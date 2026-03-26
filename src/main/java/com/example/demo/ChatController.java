package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
// Remove @CrossOrigin(origins = "*") because WebConfig handles it now
public class ChatController {

    @Autowired
    private ProductRepository productRepository;

    // --- 1. GET ASSETS: Filters by the UUID sent from Vercel ---
    @GetMapping("/products")
    public List<Product> getProducts(@RequestParam String userId) {
        System.out.println("Terminal Sync: Fetching assets for UUID: " + userId);
        return productRepository.findByUserId(userId);
    }

    // --- 2. EXECUTE ENTRY: Saves new asset to Supabase ---
    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product) {
        System.out.println("Vaulting Asset: " + product.getName() + " for User: " + product.getUserId());
        return productRepository.save(product);
    }

    // --- 3. LIQUIDATE: Deletes asset by ID ---
    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        System.out.println("Liquidating Asset ID: " + id);
        productRepository.deleteById(id);
    }

    // --- 4. UPDATE STOCK: Handles Add/Sell logic ---
    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
        
        product.setStock(productDetails.getStock());
        return productRepository.save(product);
    }

    // --- EXISTING AI LOGIC ---
    @PostMapping("/chat")
    public String chat(@RequestBody String message) {
        return "CFO AI Analysis: Secure connection established. Processing query...";
    }
}
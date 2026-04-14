package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<?> getProducts(
        @RequestParam(required = false) String userId,
        @RequestParam(required = false) Long vaultId
    ) {
        try {
            if (vaultId != null) {
                return ResponseEntity.ok(productRepository.findByVaultId(vaultId));
            }
            if (userId != null && !userId.isEmpty()) {
                return ResponseEntity.ok(productRepository.findByUserId(userId));
            }
            return ResponseEntity.ok(productRepository.findAll());
        } catch (Exception e) {
            java.io.StringWriter sw = new java.io.StringWriter();
            e.printStackTrace(new java.io.PrintWriter(sw));
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage() != null ? e.getMessage() : "null", "stack", sw.toString()));
        }
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }

    @PostMapping("/bulk")
    public ResponseEntity<?> bulkImport(@RequestBody List<Product> products) {
        try {
            List<Product> saved = productRepository.saveAll(products);
            return ResponseEntity.ok(Map.of(
                "imported", saved.size(),
                "message", "Successfully imported " + saved.size() + " items"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Import failed: " + e.getMessage()));
        }
    }
}
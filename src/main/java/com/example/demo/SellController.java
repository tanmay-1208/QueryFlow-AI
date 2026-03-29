
package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sell")
public class SellController {

    @Autowired
    private SellHistoryRepository sellHistoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public SellHistory sellProduct(@RequestBody Map<String, Object> payload) {
        Long productId = Long.valueOf(payload.get("productId").toString());
        String userId = payload.get("userId").toString();
        int quantity = Integer.parseInt(payload.get("quantity").toString());

        // Get product
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        // Update stock
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);

        // Calculate profit
        double costPrice = product.getCostPrice() != null ? product.getCostPrice() : 0;
        double profit = (product.getPrice() - costPrice) * quantity;

        // Save sell history
        SellHistory history = new SellHistory();
        history.setUserId(userId);
        history.setProductId(productId);
        history.setProductName(product.getName());
        history.setQuantity(quantity);
        history.setSellPrice(product.getPrice());
        history.setCostPrice(costPrice);
        history.setProfit(profit);

        return sellHistoryRepository.save(history);
    }

    @GetMapping
    public List<SellHistory> getSellHistory(@RequestParam String userId) {
        return sellHistoryRepository.findByUserIdOrderBySoldAtDesc(userId);
    }
}
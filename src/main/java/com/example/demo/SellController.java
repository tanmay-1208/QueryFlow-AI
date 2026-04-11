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
        Long vaultId = payload.get("vaultId") != null ?
            Long.valueOf(payload.get("vaultId").toString()) : null;

        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setStock(product.getStock() - quantity);
        productRepository.save(product);

        double costPrice = product.getCostPrice() != null ? product.getCostPrice() : 0;
        double sellPrice = product.getPrice();
        
        if (payload.containsKey("sellPrice") && payload.get("sellPrice") != null) {
            sellPrice = Double.parseDouble(payload.get("sellPrice").toString());
        }

        double profit = (sellPrice - costPrice) * quantity;

        SellHistory history = new SellHistory();
        history.setUserId(userId);
        history.setProductId(productId);
        history.setProductName(product.getName());
        history.setQuantity(quantity);
        history.setSellPrice(sellPrice);
        history.setCostPrice(costPrice);
        history.setProfit(profit);
        history.setVaultId(vaultId);
        
        if (payload.containsKey("customerId") && payload.get("customerId") != null) {
            history.setCustomerId(Long.valueOf(payload.get("customerId").toString()));
        }

        return sellHistoryRepository.save(history);
    }

    @GetMapping
    public List<SellHistory> getSellHistory(
        @RequestParam String userId,
        @RequestParam(required = false) Long vaultId
    ) {
        if (vaultId != null) {
            return sellHistoryRepository.findByUserIdAndVaultIdOrderBySoldAtDesc(userId, vaultId);
        }
        return sellHistoryRepository.findByUserIdOrderBySoldAtDesc(userId);
    }
}
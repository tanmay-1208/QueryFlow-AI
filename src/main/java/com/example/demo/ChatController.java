package com.example.demo;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatController {

    private final ChatModel chatModel;
    private final JdbcTemplate jdbcTemplate;

    public ChatController(ChatModel chatModel, JdbcTemplate jdbcTemplate) {
        this.chatModel = chatModel;
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/products")
    public List<Map<String, Object>> getProducts() {
        return jdbcTemplate.queryForList("SELECT * FROM products ORDER BY id DESC");
    }

    @PostMapping("/products")
    public void addProduct(@RequestBody Map<String, Object> p) {
        try {
            String name = String.valueOf(p.getOrDefault("name", "Unnamed Asset"));
            double price = Double.parseDouble(String.valueOf(p.getOrDefault("price", "0")));
            double cost = Double.parseDouble(String.valueOf(p.getOrDefault("cost", "0")));
            int stock = Integer.parseInt(String.valueOf(p.getOrDefault("stock", "0")));

            jdbcTemplate.update(
                "INSERT INTO products (name, price, cost, stock, sold_count) VALUES (?, ?, ?, ?, 0)",
                name, price, cost, stock
            );
        } catch (Exception e) {
            System.err.println(">>> ADD ERROR: " + e.getMessage());
        }
    }

    @PostMapping("/products/sell/{id}")
    public void sellItem(@PathVariable Long id) {
        jdbcTemplate.update("UPDATE products SET stock = stock - 1, sold_count = sold_count + 1 WHERE id = ? AND stock > 0", id);
    }

    @PostMapping("/products/restock/{id}")
    public void restockItem(@PathVariable Long id) {
        jdbcTemplate.update("UPDATE products SET stock = stock + 1 WHERE id = ?", id);
    }

    @DeleteMapping("/products/{id}")
    public void deleteItem(@PathVariable Long id) {
        jdbcTemplate.update("DELETE FROM products WHERE id = ?", id);
    }

    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        try {
            List<Map<String, Object>> products = jdbcTemplate.queryForList("SELECT name, price, cost, stock, sold_count FROM products");
            StringBuilder context = new StringBuilder("Financial Data (USD):\n");
            for (Map<String, Object> p : products) {
                context.append("- ").append(String.valueOf(p.get("name")))
                       .append(" | Price: ").append(String.valueOf(p.get("price")))
                       .append(" | Cost: ").append(String.valueOf(p.get("cost")))
                       .append(" | Sold: ").append(String.valueOf(p.get("sold_count"))).append("\n");
            }

            String finalPrompt = String.format(
                "You are a Senior CFO & Tax Advisor. Use this data:\n%s\n" +
                "Question: %s\n" +
                "STRICT ACCOUNTING RULES:\n" +
                "1. Revenue = Sum of (Price * Sold).\n" +
                "2. Tax Liability = Revenue * 0.18 (GST).\n" +
                "3. Net Profit = ((Price - Cost) * Sold) - Tax Liability.\n" +
                "4. Identify the 'Top Performer' as the item with the highest (Price-Cost)/Price ratio.\n" +
                "Provide a direct, one-sentence answer. No math shown.",
                context.toString(), userMessage
            );
            return chatModel.call(finalPrompt);
        } catch (Exception e) {
            return "Advisor Error: " + e.getMessage();
        }
    }
}
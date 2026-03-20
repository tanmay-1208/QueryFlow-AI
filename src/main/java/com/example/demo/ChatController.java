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

    // 1. Fetch only items belonging to the specific user
    @GetMapping("/products")
    public List<Map<String, Object>> getProducts(@RequestParam String userId) {
        return jdbcTemplate.queryForList(
            "SELECT * FROM products WHERE user_id = ? ORDER BY id DESC", 
            userId
        );
    }

    // 2. Add product with a User ID tag
    @PostMapping("/products")
    public void addProduct(@RequestBody Map<String, Object> p) {
        try {
            String name = String.valueOf(p.getOrDefault("name", "Unnamed Asset"));
            double price = Double.parseDouble(String.valueOf(p.getOrDefault("price", "0")));
            double cost = Double.parseDouble(String.valueOf(p.getOrDefault("cost", "0")));
            int stock = Integer.parseInt(String.valueOf(p.getOrDefault("stock", "0")));
            String userId = String.valueOf(p.get("user_id")); // Get the ID from React

            jdbcTemplate.update(
                "INSERT INTO products (name, price, cost, stock, sold_count, user_id) VALUES (?, ?, ?, ?, 0, ?)",
                name, price, cost, stock, userId
            );
        } catch (Exception e) {
            System.err.println(">>> ADD ERROR: " + e.getMessage());
        }
    }

    // 3. Security Check: Only update if the item belongs to the user
    @PostMapping("/products/sell/{id}")
    public void sellItem(@PathVariable Long id, @RequestParam String userId) {
        jdbcTemplate.update(
            "UPDATE products SET stock = stock - 1, sold_count = sold_count + 1 WHERE id = ? AND user_id = ? AND stock > 0", 
            id, userId
        );
    }

    @PostMapping("/products/restock/{id}")
    public void restockItem(@PathVariable Long id, @RequestParam String userId) {
        jdbcTemplate.update(
            "UPDATE products SET stock = stock + 1 WHERE id = ? AND user_id = ?", 
            id, userId
        );
    }

    @DeleteMapping("/products/{id}")
    public void deleteItem(@PathVariable Long id, @RequestParam String userId) {
        jdbcTemplate.update("DELETE FROM products WHERE id = ? AND user_id = ?", id, userId);
    }

    // 4. AI Advisor: Only analyzes the current user's data
    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        String userId = payload.get("userId"); // Ensure React sends this

        try {
            // AI only gets context for the logged-in user
            List<Map<String, Object>> products = jdbcTemplate.queryForList(
                "SELECT name, price, cost, stock, sold_count FROM products WHERE user_id = ?", 
                userId
            );

            StringBuilder context = new StringBuilder("Financial Data (USD):\n");
            for (Map<String, Object> p : products) {
                context.append("- ").append(p.get("name"))
                       .append(" | Price: ").append(p.get("price"))
                       .append(" | Cost: ").append(p.get("cost"))
                       .append(" | Sold: ").append(p.get("sold_count")).append("\n");
            }

            String finalPrompt = String.format(
                "You are a Senior CFO & Tax Advisor. Use ONLY this user's data:\n%s\n" +
                "Question: %s\n" +
                "STRICT ACCOUNTING RULES:\n" +
                "1. Revenue = Sum of (Price * Sold).\n" +
                "2. Tax Liability = Revenue * 0.18 (GST).\n" +
                "3. Net Profit = ((Price - Cost) * Sold) - Tax Liability.\n" +
                "Provide a direct, one-sentence answer.",
                context.toString(), userMessage
            );
            return chatModel.call(finalPrompt);
        } catch (Exception e) {
            return "Advisor Error: " + e.getMessage();
        }
    }
}
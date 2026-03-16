package com.example.demo;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
// The "*" allows your Vercel frontend to talk to this Render backend without security blocks
@CrossOrigin(origins = "*", allowedHeaders = "*") 
public class ChatController {

    private final ChatModel chatModel;
    private final JdbcTemplate jdbcTemplate;

    public ChatController(ChatModel chatModel, JdbcTemplate jdbcTemplate) {
        this.chatModel = chatModel;
        this.jdbcTemplate = jdbcTemplate;
    }

    // 1. VAULT: Get all items
    @GetMapping("/products")
    public List<Map<String, Object>> getProducts() {
        return jdbcTemplate.queryForList("SELECT * FROM products ORDER BY id DESC");
    }

    // 2. VAULT: Add new luxury asset
    @PostMapping("/products")
    public String addItem(@RequestBody Map<String, Object> item) {
        String sql = "INSERT INTO products (name, price, stock, sold_count) VALUES (?, ?, ?, 0)";
        jdbcTemplate.update(sql, 
            item.get("name"), 
            Double.parseDouble(String.valueOf(item.get("price"))), 
            Integer.parseInt(String.valueOf(item.get("stock")))
        );
        return "Secured";
    }

    // 3. VAULT: Sell an item (Decrease stock)
    @PostMapping("/products/sell/{id}")
    public void sellItem(@PathVariable Long id) {
        jdbcTemplate.update("UPDATE products SET stock = stock - 1, sold_count = sold_count + 1 WHERE id = ? AND stock > 0", id);
    }

    // 4. VAULT: Restock an item (Increase stock)
    @PostMapping("/products/restock/{id}")
    public void restockItem(@PathVariable Long id) {
        jdbcTemplate.update("UPDATE products SET stock = stock + 1 WHERE id = ?", id);
    }

    // 5. VAULT: Permanent release (Delete)
    @DeleteMapping("/products/{id}")
    public void deleteItem(@PathVariable Long id) {
        jdbcTemplate.update("DELETE FROM products WHERE id = ?", id);
    }

    // 6. CFO INTELLIGENCE: The AI Advisor logic
    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> payload) {
        try {
            String userMessage = payload.get("message");
            // This connects to the Groq Llama-3 model via Spring AI
            return chatModel.call(userMessage);
        } catch (Exception e) {
            return "Intelligence Error: " + e.getMessage();
        }
    }
}
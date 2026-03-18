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

    // --- VAULT INVENTORY ROUTES ---
    @GetMapping("/products")
    public List<Map<String, Object>> getProducts() {
        return jdbcTemplate.queryForList("SELECT * FROM products ORDER BY id DESC");
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

    // --- AI ADVISOR ROUTE (THE BRAIN) ---
    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        
        // Log to Render console so we know the request arrived
        System.out.println(">>> AI REQUEST RECEIVED: " + message);
        
        try {
            // Using the ChatModel (which is mapped to Groq via OpenAI starter)
            String aiResponse = chatModel.call(message);
            System.out.println(">>> AI RESPONSE SUCCESSFUL");
            return aiResponse;
        } catch (Exception e) {
            System.err.println(">>> AI ERROR: " + e.getMessage());
            return "Advisor Error: " + e.getMessage();
        }
    }
}
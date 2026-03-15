package com.example.demo;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
// Ensure this matches your EXACT Vercel URL (check if there's a dash or extra numbers)
@CrossOrigin(origins = {"https://query-flow-ai.vercel.app", "http://localhost:3000"}, allowedHeaders = "*") 
public class ChatController {

    private final ChatModel chatModel;
    private final JdbcTemplate jdbcTemplate;

    public ChatController(ChatModel chatModel, JdbcTemplate jdbcTemplate) {
        this.chatModel = chatModel;
        this.jdbcTemplate = jdbcTemplate;
    }

    // --- ADD THIS: The "Get All Assets" route for the Vault ---
    @GetMapping("/products")
    public List<Map<String, Object>> getAllProducts() {
        return jdbcTemplate.queryForList("SELECT * FROM products ORDER BY id DESC");
    }

    // --- FIX THIS: Match the App.js route name ---
    @PostMapping("/products")
    public String addItem(@RequestBody Map<String, Object> item) {
        String sql = "INSERT INTO products (name, description, price, stock, sold_count) VALUES (?, ?, ?, ?, 0)";
        jdbcTemplate.update(sql, 
            item.get("name"), 
            item.get("description"), // Ensure your DB has a description column!
            item.get("price") != null ? Double.parseDouble(String.valueOf(item.get("price"))) : 0.0,
            item.get("stock") != null ? Integer.parseInt(String.valueOf(item.get("stock"))) : 1
        );
        return "Secured";
    }

    // --- THE AI ADVISOR ROUTE ---
    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        return chatModel.call(userMessage);
    }
}
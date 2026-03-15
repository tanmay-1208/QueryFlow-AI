package com.example.demo;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE})
public class ChatController {

    private final ChatModel chatModel;
    private final JdbcTemplate jdbcTemplate;

    public ChatController(ChatModel chatModel, JdbcTemplate jdbcTemplate) {
        this.chatModel = chatModel;
        this.jdbcTemplate = jdbcTemplate;
    }

    // --- GET ALL ASSETS ---
    @GetMapping("/products")
    public List<Map<String, Object>> getProducts() {
        return jdbcTemplate.queryForList("SELECT * FROM products ORDER BY id DESC");
    }

    // --- SECURE NEW ASSET ---
    @PostMapping("/products")
    public String addItem(@RequestBody Map<String, Object> item) {
        // Note: Using 'name' for both name and description if your DB table is simple
        String sql = "INSERT INTO products (name, price, stock, sold_count) VALUES (?, 0, 1, 0)";
        jdbcTemplate.update(sql, String.valueOf(item.get("name")));
        return "Secured";
    }

    // --- AI ADVISOR ---
    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> payload) {
        return chatModel.call(payload.get("message"));
    }
}
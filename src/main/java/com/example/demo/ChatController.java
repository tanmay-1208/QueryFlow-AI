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

    // GET ALL ASSETS
    @GetMapping("/products")
    public List<Map<String, Object>> getProducts() {
        return jdbcTemplate.queryForList("SELECT * FROM products ORDER BY id DESC");
    }

    // SECURE NEW ASSET (WITH COST)
    @PostMapping("/products")
    public void addProduct(@RequestBody Map<String, Object> p) {
        jdbcTemplate.update(
            "INSERT INTO products (name, price, cost, stock, sold_count) VALUES (?, ?, ?, ?, 0)",
            p.get("name"), p.get("price"), p.get("cost"), p.get("stock")
        );
    }

    // SELL LOGIC
    @PostMapping("/products/sell/{id}")
    public void sellItem(@PathVariable Long id) {
        jdbcTemplate.update("UPDATE products SET stock = stock - 1, sold_count = sold_count + 1 WHERE id = ? AND stock > 0", id);
    }

    // DELETE LOGIC
    @DeleteMapping("/products/{id}")
    public void deleteItem(@PathVariable Long id) {
        jdbcTemplate.update("DELETE FROM products WHERE id = ?", id);
    }

    // AI CFO ADVISOR (ADVANCED FINANCIAL MODE)
    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        try {
            List<Map<String, Object>> products = jdbcTemplate.queryForList(
                "SELECT name, price, cost, stock, sold_count FROM products"
            );

            StringBuilder context = new StringBuilder("Financial Data:\n");
            for (Map<String, Object> p : products) {
                context.append("- ").append(p.get("name"))
                       .append(" | Price: ").append(p.get( "price"))
                       .append(" | Cost: ").append(p.get("cost"))
                       .append(" | Sold: ").append(p.get("sold_count")).append("\n");
            }

            String finalPrompt = String.format(
                "You are a Senior CFO Advisor. Use this data:\n%s\n" +
                "Question: %s\n" +
                "STRICT RULES:\n" +
                "1. Total Profit = Sum of ((Price - Cost) * Sold).\n" +
                "2. Gross Margin %% = (Total Profit / (Total Price * Total Sold)) * 100.\n" +
                "3. Provide a direct, one-sentence answer. No math shown.",
                context.toString(), userMessage
            );

            return chatModel.call(finalPrompt);
        } catch (Exception e) {
            return "Advisor Error: " + e.getMessage();
        }
    }
}
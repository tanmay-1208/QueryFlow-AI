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

    // --- VAULT INVENTORY ---
    @GetMapping("/products")
    public List<Map<String, Object>> getProducts() {
        return jdbcTemplate.queryForList("SELECT * FROM products ORDER BY id DESC");
    }

    @PostMapping("/products/sell/{id}")
    public void sellItem(@PathVariable Long id) {
        jdbcTemplate.update("UPDATE products SET stock = stock - 1, sold_count = sold_count + 1 WHERE id = ? AND stock > 0", id);
    }

    // --- AI CFO ADVISOR (ADVANCED MARGIN ANALYSIS) ---
    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        
        try {
            // 1. Fetch live data (including the new COST column)
            List<Map<String, Object>> products = jdbcTemplate.queryForList(
                "SELECT name, price, cost, stock, sold_count FROM products"
            );

            // 2. Build context
            StringBuilder vaultContext = new StringBuilder("Financial Data:\n");
            for (Map<String, Object> p : products) {
                vaultContext.append(String.format("- %s | Price: %s | Cost: %s | Sold: %s\n", 
                    p.get("name"), p.get("price"), p.get("cost"), p.get("sold_count")));
            }

            // 3. The "CFO Brain" Prompt
            String finalPrompt = String.format(
                "You are a Senior CFO Advisor. Analyze this vault data:\n\n%s\n\n" +
                "Question: %s\n\n" +
                "STRICT CFO RULES:\n" +
                "1. Total Profit = Sum of ((Price - Cost) * Sold_Count) for all items.\n" +
                "2. Gross Margin % = (Total Profit / Total Revenue) * 100.\n" +
                "3. Revenue = Sum of (Price * Sold_Count).\n" +
                "4. Give a direct, one-sentence answer. Be professional.\n" +
                "5. Do NOT show math. Just the final result.",
                vaultContext.toString(),
                userMessage
            );

            return chatModel.call(finalPrompt);

        } catch (Exception e) {
            return "Advisor Error: " + e.getMessage();
        }
    }
}
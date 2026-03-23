package com.example.demo;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
// Updated CORS to allow your specific Vercel Origin
@CrossOrigin(origins = "https://query-flow-ai-uq5t.vercel.app", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
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

    // --- NEW: THE MISSING PUT METHOD (This fixes your reload issue) ---
    @PutMapping("/products/{id}")
    public void updateProductStock(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            // Extract the new stock and userId sent from React
            int stock = Integer.parseInt(String.valueOf(payload.get("stock")));
            String userId = String.valueOf(payload.get("userId"));

            // Update the database for that specific ID and User
            jdbcTemplate.update(
                "UPDATE products SET stock = ? WHERE id = ? AND user_id = ?",
                stock, id, userId
            );
            System.out.println(">>> SUCCESS: Updated ID " + id + " to stock " + stock);
        } catch (Exception e) {
            System.err.println(">>> UPDATE ERROR: " + e.getMessage());
        }
    }

    // 2. Add product with a User ID tag
    @PostMapping("/products")
    public void addProduct(@RequestBody Map<String, Object> p) {
        try {
            String name = String.valueOf(p.getOrDefault("name", "Unnamed Asset"));
            double price = Double.parseDouble(String.valueOf(p.getOrDefault("price", "0")));
            double cost = Double.parseDouble(String.valueOf(p.getOrDefault("cost", "0")));
            int stock = Integer.parseInt(String.valueOf(p.getOrDefault("stock", "0")));
            String userId = String.valueOf(p.get("user_id")); 

            jdbcTemplate.update(
                "INSERT INTO products (name, price, cost, stock, sold_count, user_id) VALUES (?, ?, ?, ?, 0, ?)",
                name, price, cost, stock, userId
            );
        } catch (Exception e) {
            System.err.println(">>> ADD ERROR: " + e.getMessage());
        }
    }

    // 3. AI Advisor
    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        String userId = payload.get("userId");

        try {
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

    // Delete Item
    @DeleteMapping("/products/{id}")
    public void deleteItem(@PathVariable Long id, @RequestParam String userId) {
        jdbcTemplate.update("DELETE FROM products WHERE id = ? AND user_id = ?", id, userId);
    }
}
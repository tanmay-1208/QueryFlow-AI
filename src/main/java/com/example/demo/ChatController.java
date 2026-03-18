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

    // --- VAULT INVENTORY MANAGEMENT ---
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

    // --- AI CFO ADVISOR (FINANCIAL LOGIC MODE) ---
    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        
        try {
            // 1. Fetch live data from Supabase
            List<Map<String, Object>> products = jdbcTemplate.queryForList(
                "SELECT name, price, stock, sold_count FROM products"
            );

            // 2. Build the context string
            StringBuilder vaultContext = new StringBuilder("User Vault Data:\n");
            if (products.isEmpty()) {
                vaultContext.append("- No items in vault.");
            } else {
                for (Map<String, Object> p : products) {
                    vaultContext.append(String.format("- Item: %s | Price: %s | Stock: %s | Sold: %s\n", 
                        p.get("name"), p.get("price"), p.get("stock"), p.get("sold_count")));
                }
            }

            // 3. The Instruction (Teaches the AI how to calculate "How much I made")
            String finalPrompt = String.format(
                "You are a Senior CFO Advisor. Analyze the following vault data:\n\n%s\n\n" +
                "Question: %s\n\n" +
                "STRICT ACCOUNTING RULES:\n" +
                "1. Total Revenue/Earnings = The sum of (Price * Sold_Count) for every item listed.\n" +
                "2. If an item has a Sold_Count of 3 and Price of 100, that is 300 in revenue.\n" +
                "3. Provide a direct, one-sentence answer with the total amount.\n" +
                "4. Do NOT show your math or calculations.\n" +
                "5. Just give the final financial result clearly.",
                vaultContext.toString(),
                userMessage
            );

            System.out.println(">>> AI PROCESSING FINANCIAL QUERY FOR " + products.size() + " ITEMS.");
            return chatModel.call(finalPrompt);

        } catch (Exception e) {
            System.err.println(">>> AI ERROR: " + e.getMessage());
            return "Advisor Error: " + e.getMessage();
        }
    }
}
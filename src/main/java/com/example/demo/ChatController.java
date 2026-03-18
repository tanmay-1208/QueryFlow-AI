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

    // --- AI CFO ADVISOR (CONCISE MODE) ---
    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        
        try {
            // 1. Fetch live data
            List<Map<String, Object>> products = jdbcTemplate.queryForList(
                "SELECT name, price, stock, sold_count FROM products"
            );

            // 2. Build context
            StringBuilder vaultContext = new StringBuilder();
            if (products.isEmpty()) {
                vaultContext.append("Vault is empty.");
            } else {
                for (Map<String, Object> p : products) {
                    vaultContext.append(String.format("- %s (Price: %s, Stock: %s, Sold: %s)\n", 
                        p.get("name"), p.get("price"), p.get("stock"), p.get("sold_count")));
                }
            }

            // 3. The Strict Prompt (Prevents long explanations)
            String finalPrompt = String.format(
                "You are a professional CFO Intelligence AI. Answer the question using ONLY this data:\n\n%s\n\n" +
                "Question: %s\n\n" +
                "STRICT RULES:\n" +
                "1. Give a direct, one-sentence answer.\n" +
                "2. Do NOT show your calculations or math.\n" +
                "3. Do NOT explain how you got the answer.\n" +
                "4. Just provide the final result clearly.",
                vaultContext.toString(),
                userMessage
            );

            System.out.println(">>> AI PROCESSING CONCISE QUERY");
            return chatModel.call(finalPrompt);

        } catch (Exception e) {
            return "Advisor Error: " + e.getMessage();
        }
    }
}
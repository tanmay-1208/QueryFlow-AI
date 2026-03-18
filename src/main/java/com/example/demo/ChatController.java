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

    // --- AI CFO ADVISOR (WITH DATA-INJECTION) ---
    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        
        try {
            // 1. Fetch live data from your Supabase 'products' table
            List<Map<String, Object>> products = jdbcTemplate.queryForList(
                "SELECT name, price, stock, sold_count FROM products"
            );

            // 2. Build the context string manually to ensure it's readable
            StringBuilder vaultContext = new StringBuilder("The following is the current inventory in the user's vault:\n");
            
            if (products.isEmpty()) {
                vaultContext.append("- No items are currently stored in the vault.");
            } else {
                for (Map<String, Object> p : products) {
                    vaultContext.append(String.format("- Item: %s | Price: %s | Stock: %s | Sold: %s\n", 
                        p.get("name"), p.get("price"), p.get("stock"), p.get("sold_count")));
                }
            }

            // 3. Construct the "Augmented" Prompt for Llama 3.1
            String finalPrompt = String.format(
                "You are the QueryFlow AI CFO Advisor. Use the vault data provided below to answer the user's question.\n\n" +
                "VAULT DATA:\n%s\n\n" +
                "USER QUESTION: %s\n\n" +
                "INSTRUCTION: Be professional and concise. If the user asks for the highest stock or most expensive item, " +
                "identify it specifically from the VAULT DATA above.",
                vaultContext.toString(),
                userMessage
            );

            // Log for Render debugging
            System.out.println(">>> AI PROCESSING QUERY FOR VAULT WITH " + products.size() + " ITEMS.");

            // 4. Send the data-enriched prompt to the AI
            return chatModel.call(finalPrompt);

        } catch (Exception e) {
            System.err.println(">>> AI ERROR: " + e.getMessage());
            return "Advisor System Error: " + e.getMessage();
        }
    }
}
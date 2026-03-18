package com.example.demo;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    // --- AI CFO ADVISOR (WITH DATA CONTEXT) ---
    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        
        System.out.println(">>> AI ANALYSIS REQUEST: " + userMessage);

        try {
            // 1. Fetch live data from Supabase
            List<Map<String, Object>> products = jdbcTemplate.queryForList(
                "SELECT name, price, stock, sold_count FROM products"
            );

            // 2. Format the data into a string the AI can read
            String inventoryContext = products.stream()
                .map(p -> String.format("Item: %s | Price: %s | Stock: %s | Sold: %s", 
                    p.get("name"), p.get("price"), p.get("stock"), p.get("sold_count")))
                .collect(Collectors.joining("\n"));

            // 3. Construct the "Augmented" Prompt
            String fullPrompt = String.format(
                "You are the QueryFlow AI CFO Advisor. Your job is to analyze the user's personal vault data.\n\n" +
                "CURRENT VAULT DATA:\n%s\n\n" +
                "USER QUESTION: %s\n\n" +
                "INSTRUCTION: Use ONLY the vault data above to answer. If the data is empty, say 'Your vault is currently empty.' " +
                "Be concise, professional, and highlight the most expensive or best-selling items if asked.",
                inventoryContext.isEmpty() ? "No products found." : inventoryContext,
                userMessage
            );

            // 4. Send the data-enriched prompt to Groq
            String response = chatModel.call(fullPrompt);
            System.out.println(">>> AI ANALYSIS SUCCESSFUL");
            return response;

        } catch (Exception e) {
            System.err.println(">>> AI ANALYSIS ERROR: " + e.getMessage());
            return "Advisor Error: " + e.getMessage();
        }
    }
}
package com.example.demo;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") 
public class ChatController {

    private final ChatModel chatModel;
    private final JdbcTemplate jdbcTemplate;

    public ChatController(ChatModel chatModel, JdbcTemplate jdbcTemplate) {
        this.chatModel = chatModel;
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/ask")
    public List<Map<String, Object>> ask(@RequestParam String query) {
        String schema = "Table: products (id, name, price, stock, sold_count)";
        String promptText = "Return ONLY raw SQL. Schema: " + schema + 
                            ". User: " + query + 
                            ". Rules: Use ILIKE for names. SELECT name, price, stock, sold_count.";

        String generatedSql = chatModel.call(new Prompt(promptText)).getResult().getOutput().getContent().trim();
        generatedSql = generatedSql.replace("```sql", "").replace("```", "").split(";")[0].trim() + ";";
        
        return jdbcTemplate.queryForList(generatedSql);
    }

    @PostMapping("/add")
    public String addItem(@RequestBody Map<String, Object> item) {
        String sql = "INSERT INTO products (name, price, stock, sold_count) VALUES (?, ?, ?, 0)";
        jdbcTemplate.update(sql, 
            String.valueOf(item.get("name")), 
            Double.parseDouble(String.valueOf(item.get("price"))), 
            Integer.parseInt(String.valueOf(item.get("stock")))
        );
        return "Secured";
    }

    @PostMapping("/sell/{name}")
    public String sellItem(@PathVariable String name) {
        String sql = "UPDATE products SET stock = stock - 1, sold_count = sold_count + 1 WHERE name = ? AND stock > 0";
        int rows = jdbcTemplate.update(sql, name);
        return rows > 0 ? "Transaction Secured" : "Out of Stock";
    }

    // NEW: RESTOCK LOGIC
    @PostMapping("/restock/{name}")
    public String restockItem(@PathVariable String name) {
        String sql = "UPDATE products SET stock = stock + 1 WHERE name = ?";
        int updated = jdbcTemplate.update(sql, name);
        return updated > 0 ? "Vault Replenished" : "Item Not Found";
    }

    @DeleteMapping("/delete/{name}")
    public String deleteItem(@PathVariable String name) {
        jdbcTemplate.update("DELETE FROM products WHERE name = ?", name);
        return "Released";
    }
}
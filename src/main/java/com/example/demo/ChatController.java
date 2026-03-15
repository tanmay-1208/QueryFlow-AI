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
    private final _06_SchemaService schemaService;
    private final _08_ExecutionService executionService;
    private final JdbcTemplate jdbcTemplate;

    public ChatController(ChatModel chatModel, _06_SchemaService schemaService, 
                          _08_ExecutionService executionService, JdbcTemplate jdbcTemplate) {
        this.chatModel = chatModel;
        this.schemaService = schemaService;
        this.executionService = executionService;
        this.jdbcTemplate = jdbcTemplate;
    }

    // AI Query Engine
    @GetMapping("/ask")
    public List<Map<String, Object>> ask(@RequestParam String query) {
        String schema = schemaService.getSchemaDescription();
        String promptText = "Return ONLY one raw SQL query. Schema: " + schema + 
                            ". User: " + query + 
                            ". RULES: 1. Use ILIKE. 2. SELECT name, price, stock. 3. WHERE before ORDER BY.";

        String generatedSql = chatModel.call(new Prompt(promptText)).getResult().getOutput().getContent().trim();
        generatedSql = generatedSql.replace("```sql", "").replace("```", "").trim();
        if (generatedSql.contains(";")) {
            generatedSql = generatedSql.split(";")[0].trim() + ";";
        }
        return executionService.runQuery(generatedSql);
    }

    // Add Single/Bulk Item
    @PostMapping("/add")
    public String addItem(@RequestBody Map<String, Object> item) {
        try {
            String sql = "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)";
            String name = String.valueOf(item.get("name"));
            double price = Double.parseDouble(String.valueOf(item.get("price")));
            int stock = Integer.parseInt(String.valueOf(item.get("stock")));

            jdbcTemplate.update(sql, name, price, stock);
            return "Secured";
        } catch (Exception e) {
            throw new RuntimeException("Vault Error: " + e.getMessage());
        }
    }

    // Delete Item
    @DeleteMapping("/delete/{name}")
    public String deleteItem(@PathVariable String name) {
        String sql = "DELETE FROM products WHERE name = ?";
        jdbcTemplate.update(sql, name);
        return "Released";
    }
}
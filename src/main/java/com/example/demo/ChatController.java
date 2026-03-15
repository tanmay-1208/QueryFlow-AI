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

    // --- AI SEARCH WITH STRICT SYNTAX RULES ---
    @GetMapping("/ask")
    public List<Map<String, Object>> ask(@RequestParam String query) {
        String schema = schemaService.getSchemaDescription();
        
        String promptText = "Return ONLY one raw SQL query. Schema: " + schema + ". User: " + query + 
                            ". RULES: " +
                            "1. Use ILIKE for case-insensitive search. " +
                            "2. ALWAYS include 'name', 'price', and 'stock' columns. " +
                            "3. STRICT SQL ORDER: SELECT -> FROM -> WHERE -> ORDER BY. " +
                            "4. Never put ORDER BY before WHERE. " +
                            "5. Return only the SQL, no markdown backticks.";

        String generatedSql = chatModel.call(new Prompt(promptText)).getResult().getOutput().getContent().trim();
        
        // Final sanitization
        generatedSql = generatedSql.replace("```sql", "").replace("```", "").trim();
        if (generatedSql.contains(";")) {
            generatedSql = generatedSql.split(";")[0].trim() + ";";
        }

        System.out.println("Executing Vault Query: " + generatedSql);
        return executionService.runQuery(generatedSql);
    }

    // --- ADD ASSET WITH DATA TYPE SAFETY ---
    @PostMapping("/add")
    public String addItem(@RequestBody Map<String, Object> item) {
        try {
            String sql = "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)";
            String name = String.valueOf(item.get("name"));
            double price = Double.parseDouble(String.valueOf(item.get("price")));
            int stock = Integer.parseInt(String.valueOf(item.get("stock")));

            jdbcTemplate.update(sql, name, price, stock);
            return "Asset Secured.";
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Add Error: " + e.getMessage());
        }
    }

    // --- DELETE ASSET ---
    @DeleteMapping("/delete/{name}")
    public String deleteItem(@PathVariable String name) {
        try {
            String sql = "DELETE FROM products WHERE name = ?";
            jdbcTemplate.update(sql, name);
            return "Asset Released.";
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Delete Error: " + e.getMessage());
        }
    }
}
package com.example.demo;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatController {

    private final JdbcTemplate jdbcTemplate;

    public ChatController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/products")
    public List<Map<String, Object>> getProducts() {
        return jdbcTemplate.queryForList("SELECT * FROM products ORDER BY id DESC");
    }

    @PostMapping("/products")
    public String addItem(@RequestBody Map<String, Object> item) {
        String sql = "INSERT INTO products (name, price, stock, sold_count) VALUES (?, ?, ?, 0)";
        jdbcTemplate.update(sql, 
            item.get("name"), 
            Double.parseDouble(String.valueOf(item.get("price"))), 
            Integer.parseInt(String.valueOf(item.get("stock")))
        );
        return "Secured";
    }

    // Logic for Selling (Decreasing Stock)
    @PostMapping("/products/sell/{id}")
    public void sellItem(@PathVariable Long id) {
        jdbcTemplate.update("UPDATE products SET stock = stock - 1, sold_count = sold_count + 1 WHERE id = ? AND stock > 0", id);
    }

    // Logic for Restocking (Increasing Stock)
    @PostMapping("/products/restock/{id}")
    public void restockItem(@PathVariable Long id) {
        jdbcTemplate.update("UPDATE products SET stock = stock + 1 WHERE id = ?", id);
    }

    @DeleteMapping("/products/{id}")
    public void deleteItem(@PathVariable Long id) {
        jdbcTemplate.update("DELETE FROM products WHERE id = ?", id);
    }
}
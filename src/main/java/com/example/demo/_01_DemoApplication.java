package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class _01_DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(_01_DemoApplication.class, args);
    }

    @Bean
    public CommandLineRunner runAndFixDb(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("DELETE FROM product_price_groups WHERE product_id NOT IN (SELECT id FROM products)");
                jdbcTemplate.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(255)");
                System.out.println("Database cleaned up and category column added if necessary.");
            } catch (Exception e) {
                e.printStackTrace();
            }
        };
    }
}

package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double price;
    private Integer stock;

    @Column(name = "cost_price")
    private Double cost_price;

    @Column(name = "\"userId\"") 
    private String userId;

    // --- GETTERS & SETTERS (This removes the red lines in ChatController) ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Double getCost_price() { return cost_price; }
    public void setCost_price(Double cost_price) { this.cost_price = cost_price; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
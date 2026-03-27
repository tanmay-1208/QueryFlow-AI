package com.example.demo;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data // This provides Getters and Setters automatically
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private Double price;
    private Integer stock;
    private String category;
}
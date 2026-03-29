package com.example.demo;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
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

    @Column(name = "user_id")
    private String userId;

    @Column(name = "vault_id")
    private Long vaultId;

    @Column(name = "cost_price")
    @JsonProperty("cost_price")
    private Double costPrice;
}
package com.example.demo;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.util.Map;
import java.util.HashMap;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double price;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_price_groups", joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyEnumerated(EnumType.STRING)
    @MapKeyColumn(name = "price_group")
    @Column(name = "group_price")
    private Map<PriceGroup, Double> priceGroups = new HashMap<>();
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
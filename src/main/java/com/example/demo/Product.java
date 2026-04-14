package com.example.demo;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.util.Map;
import java.util.HashMap;

@Entity
@Getter
@Setter
@Table(name = "product")
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double price;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "product_price_groups", 
        joinColumns = @JoinColumn(name = "product_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "fk_product_price_group"))
    )
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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Map<PriceGroup, Double> getPriceGroups() { return priceGroups; }
    public void setPriceGroups(Map<PriceGroup, Double> priceGroups) { this.priceGroups = priceGroups; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Long getVaultId() { return vaultId; }
    public void setVaultId(Long vaultId) { this.vaultId = vaultId; }
    public Double getCostPrice() { return costPrice; }
    public void setCostPrice(Double costPrice) { this.costPrice = costPrice; }
}

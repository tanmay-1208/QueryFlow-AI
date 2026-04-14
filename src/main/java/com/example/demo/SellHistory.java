package com.example.demo;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter@Table(name = "sell_history")
@NoArgsConstructor
@AllArgsConstructor
public class SellHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name")
    private String productName;

    private Integer quantity;

    @Column(name = "sell_price")
    private Double sellPrice;

    @Column(name = "cost_price")
    private Double costPrice;

    private Double profit;

    @Column(name = "customer_id")
    private Long customerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "price_group")
    private PriceGroup priceGroup;

    @Column(name = "vault_id")
    private Long vaultId;

    @Column(name = "sold_at")
    private LocalDateTime soldAt;

    @PrePersist
    public void prePersist() {
        this.soldAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getSellPrice() { return sellPrice; }
    public void setSellPrice(Double sellPrice) { this.sellPrice = sellPrice; }
    public Double getCostPrice() { return costPrice; }
    public void setCostPrice(Double costPrice) { this.costPrice = costPrice; }
    public Double getProfit() { return profit; }
    public void setProfit(Double profit) { this.profit = profit; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public PriceGroup getPriceGroup() { return priceGroup; }
    public void setPriceGroup(PriceGroup priceGroup) { this.priceGroup = priceGroup; }
    public Long getVaultId() { return vaultId; }
    public void setVaultId(Long vaultId) { this.vaultId = vaultId; }
    public LocalDateTime getSoldAt() { return soldAt; }
    public void setSoldAt(LocalDateTime soldAt) { this.soldAt = soldAt; }
}

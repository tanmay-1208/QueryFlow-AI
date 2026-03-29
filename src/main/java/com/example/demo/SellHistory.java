package com.example.demo;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sell_history")
@Data
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

    @Column(name = "vault_id")
    private Long vaultId;

    @Column(name = "sold_at")
    private LocalDateTime soldAt;

    @PrePersist
    public void prePersist() {
        this.soldAt = LocalDateTime.now();
    }
}
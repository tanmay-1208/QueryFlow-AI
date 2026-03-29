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

    private String userId;
    private Long productId;
    private String productName;
    private Integer quantity;
    private Double sellPrice;
    private Double costPrice;
    private Double profit;

    @Column(name = "sold_at")
    private LocalDateTime soldAt;

    @PrePersist
    public void prePersist() {
        this.soldAt = LocalDateTime.now();
    }
}
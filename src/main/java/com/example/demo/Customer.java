package com.example.demo;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "price_group")
    private PriceGroup priceGroup = PriceGroup.RETAIL;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "vault_id")
    private Long vaultId;
}

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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public PriceGroup getPriceGroup() { return priceGroup; }
    public void setPriceGroup(PriceGroup priceGroup) { this.priceGroup = priceGroup; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Long getVaultId() { return vaultId; }
    public void setVaultId(Long vaultId) { this.vaultId = vaultId; }
}

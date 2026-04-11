package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SellHistoryRepository extends JpaRepository<SellHistory, Long> {
    List<SellHistory> findByUserIdOrderBySoldAtDesc(String userId);
    List<SellHistory> findByUserIdAndVaultIdOrderBySoldAtDesc(String userId, Long vaultId);
    List<SellHistory> findByProductId(Long productId);
}

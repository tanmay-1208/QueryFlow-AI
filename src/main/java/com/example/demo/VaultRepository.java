package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VaultRepository extends JpaRepository<VaultEntity, Long> {
    List<VaultEntity> findByUserIdOrderByCreatedAtAsc(String userId);
    long countByUserId(String userId);
}
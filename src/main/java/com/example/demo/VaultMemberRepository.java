package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VaultMemberRepository extends JpaRepository<VaultMember, Long> {
    List<VaultMember> findByVaultId(Long vaultId);
    Optional<VaultMember> findByVaultIdAndUserId(Long vaultId, String userId);
    List<VaultMember> findByUserId(String userId);
    boolean existsByVaultIdAndUserId(Long vaultId, String userId);
    void deleteByVaultIdAndUserId(Long vaultId, String userId);
}

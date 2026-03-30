package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VaultInviteRepository extends JpaRepository<VaultInvite, Long> {
    Optional<VaultInvite> findByInviteCode(String inviteCode);
    Optional<VaultInvite> findByVaultId(Long vaultId);
}

package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vaults")
public class VaultController {

    @Autowired
    private VaultRepository vaultRepository;

    @GetMapping
    public List<VaultEntity> getVaults(@RequestParam String userId) {
        return vaultRepository.findByUserIdOrderByCreatedAtAsc(userId);
    }

    @PostMapping
    public ResponseEntity<?> createVault(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String name = payload.get("name");
        String description = payload.getOrDefault("description", "");

        long count = vaultRepository.countByUserId(userId);
        if (count >= 2) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Free plan allows maximum 2 vaults. Upgrade to create more."));
        }

        VaultEntity vault = new VaultEntity();
        vault.setUserId(userId);
        vault.setName(name);
        vault.setDescription(description);

        return ResponseEntity.ok(vaultRepository.save(vault));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVault(@PathVariable Long id) {
        vaultRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVault(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return vaultRepository.findById(id).map(vault -> {
            vault.setName(payload.getOrDefault("name", vault.getName()));
            vault.setDescription(payload.getOrDefault("description", vault.getDescription()));
            return ResponseEntity.ok(vaultRepository.save(vault));
        }).orElse(ResponseEntity.notFound().build());
    }
}
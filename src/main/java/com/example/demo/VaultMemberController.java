package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/team")
public class VaultMemberController {

    @Autowired
    private VaultMemberRepository vaultMemberRepository;

    @Autowired
    private VaultInviteRepository vaultInviteRepository;

    @Autowired
    private VaultRepository vaultRepository;

    @PostMapping("/invite/generate")
    public ResponseEntity<?> generateInviteCode(@RequestBody Map<String, Object> payload) {
        Long vaultId = Long.valueOf(payload.get("vaultId").toString());
        String userId = payload.get("userId").toString();

        Optional<VaultInvite> existing = vaultInviteRepository.findByVaultId(vaultId);
        if (existing.isPresent()) {
            return ResponseEntity.ok(Map.of("inviteCode", existing.get().getInviteCode()));
        }

        String code = "VAULT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        VaultInvite invite = new VaultInvite();
        invite.setVaultId(vaultId);
        invite.setInviteCode(code);
        invite.setCreatedBy(userId);

        vaultInviteRepository.save(invite);
        return ResponseEntity.ok(Map.of("inviteCode", code));
    }

    @PostMapping("/invite/join")
    public ResponseEntity<?> joinVault(@RequestBody Map<String, Object> payload) {
        String inviteCode = payload.get("inviteCode").toString();
        String userId = payload.get("userId").toString();
        String userEmail = payload.getOrDefault("userEmail", "").toString();

        Optional<VaultInvite> inviteOpt = vaultInviteRepository.findByInviteCode(inviteCode);
        if (inviteOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid invite code. Please check and try again."));
        }

        VaultInvite invite = inviteOpt.get();

        if (vaultMemberRepository.existsByVaultIdAndUserId(invite.getVaultId(), userId)) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "You are already a member of this vault."));
        }

        VaultMember member = new VaultMember();
        member.setVaultId(invite.getVaultId());
        member.setUserId(userId);
        member.setUserEmail(userEmail);
        member.setRole("member");
        member.setInviteCode(inviteCode);

        vaultMemberRepository.save(member);

        VaultEntity vault = vaultRepository.findById(invite.getVaultId()).orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Successfully joined vault!");
        response.put("vault", vault);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/invite/email")
    public ResponseEntity<?> sendEmailInvite(@RequestBody Map<String, Object> payload) {
        Long vaultId = Long.valueOf(payload.get("vaultId").toString());
        String userId = payload.get("userId").toString();
        String toEmail = payload.get("email").toString();
        String vaultName = payload.getOrDefault("vaultName", "a vault").toString();

        String code;
        Optional<VaultInvite> existing = vaultInviteRepository.findByVaultId(vaultId);
        if (existing.isPresent()) {
            code = existing.get().getInviteCode();
        } else {
            code = "VAULT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            VaultInvite invite = new VaultInvite();
            invite.setVaultId(vaultId);
            invite.setInviteCode(code);
            invite.setCreatedBy(userId);
            vaultInviteRepository.save(invite);
        }

        // Email not configured — return code with instructions
        Map<String, Object> response = new HashMap<>();
        response.put("inviteCode", code);
        response.put("message", "Share this code with " + toEmail + " to invite them.");
        response.put("warning", "Email sending not configured. Share the code manually.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/members")
    public List<VaultMember> getMembers(@RequestParam Long vaultId) {
        return vaultMemberRepository.findByVaultId(vaultId);
    }

    @GetMapping("/my-vaults")
    public List<Long> getMyVaultIds(@RequestParam String userId) {
        return vaultMemberRepository.findByUserId(userId)
            .stream()
            .map(VaultMember::getVaultId)
            .toList();
    }

    @DeleteMapping("/members")
    public ResponseEntity<?> removeMember(
        @RequestParam Long vaultId,
        @RequestParam String userId
    ) {
        vaultMemberRepository.deleteByVaultIdAndUserId(vaultId, userId);
        return ResponseEntity.ok().build();
    }
}
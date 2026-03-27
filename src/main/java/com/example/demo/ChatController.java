package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://query-flow-ai-uq5t.vercel.app", allowCredentials = "true")
public class ChatController {

    private final ChatClient.Builder builder;

    public ChatController(ChatClient.Builder builder) {
        this.builder = builder;
    }

    @PostMapping("/chat")
public String handleChat(@RequestBody Map<String, Object> payload) {
    try {
        String userMsg = payload.getOrDefault("message", "Audit").toString();
        List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");
        StringBuilder vaultContext = new StringBuilder();
        
        if (items != null) {
            for (Map<String, Object> item : items) {
                // Check multiple possible keys for Cost and Price to prevent $0 errors
                Object cost = item.getOrDefault("cost", item.getOrDefault("costPrice", item.getOrDefault("cost_price", 0)));
                Object price = item.getOrDefault("price", item.getOrDefault("marketPrice", 0));
                Object stock = item.getOrDefault("stock", item.getOrDefault("quantity", 0));

                vaultContext.append(String.format(
                    "[Asset: %s | Market: ₹%s | Cost: ₹%s | Units: %s] ",
                    item.get("name"), price, cost, stock
                ));
            }
        }

        return builder.build()
            .prompt()
            .system(s -> s.text(
                "You are VaultCA, a blunt and elite Chartered Accountant. \n\n" +
                "RULES: \n" +
                "1. NO INTROS. Do not say 'As a CA' or 'I can help with'. \n" +
                "2. DIRECT ANSWER FIRST. Start with the exact number requested. \n" +
                "3. THE MATH: Use the VAULT_DATA. If the user asks for ₹10,000 profit, calculate (Target Profit + Total Cost) / Units. \n" +
                "4. DATA GAP: If Cost is 0, say: 'Cost is missing for [Item]. Tell me your buy-in price.' \n\n" +
                "VAULT_DATA: " + vaultContext.toString()
            ))
            .user("COMMAND: " + userMsg) 
            .call()
            .content();

    } catch (Exception e) {
        return "Vault Connection Error: " + e.getMessage();
    }
}
}
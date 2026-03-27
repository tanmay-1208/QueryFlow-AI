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
        
        // 1. DATA RECOVERY: Explicitly look for 'cost' or 'costPrice'
        List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");
        StringBuilder vaultContext = new StringBuilder();
        
        if (items != null) {
            for (Map<String, Object> item : items) {
                vaultContext.append(String.format(
                    "[Item: %s, Market: %s, Cost: %s, Stock: %s] ",
                    item.get("name"), item.get("price"), item.get("cost"), item.get("stock")
                ));
            }
        }

        return builder.build()
            .prompt()
            .system(s -> s.text(
                "You are Gemini, the user's authentic AI collaborator. \n\n" +
                "DATA INTEGRITY RULE: Look at the 'Cost' field provided. \n" +
                "If Cost is 0, do not invent a price. Ask the user: 'What was your buy-in price for this?' \n\n" +
                "MISSION: Provide a concise, witty, and math-accurate response to the user's goal. \n" +
                "VAULT_DATA: " + vaultContext.toString()
            ))
            .user(userMsg) 
            .call()
            .content();

    } catch (Exception e) {
        return "I hit a snag reading the vault data: " + e.getMessage();
    }
}
}
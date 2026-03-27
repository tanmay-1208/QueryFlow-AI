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
        // 1. Get your specific command (e.g., "Vintage Clock")
        String userMsg = payload.getOrDefault("message", "Audit portfolio").toString();
        
        // 2. Clean the vault data
        String rawItems = payload.getOrDefault("items", "[]").toString();
        String safeItems = rawItems.replace("{", "[").replace("}", "]");

        return builder.build()
            .prompt()
            .system(s -> s.text(
                "You are the QueryFlow AI Chartered Accountant (CA). \n\n" +
                "STRICT TASK: Audit ONLY the specific item the user asks for. \n" +
                "1. If the user mentions 'Vintage Clock', ignore 'gsh' and all other data. \n" +
                "2. If no specific item is mentioned, only then summarize the whole vault. \n" +
                "3. Use 'Straight Talk': Simple English, no jargon, no long intros. \n\n" +
                "REQUIRED FORMAT: \n" +
                "**AUDIT STATUS**: [Status of requested item] \n" +
                "**VALUATION**: [Quantity x Price = Total for requested item] \n" +
                "**CA ADVICE**: [One simple tip for this specific item.] \n\n" +
                "VAULT_DATA (Search here): " + safeItems
            ))
            .user("Perform a focused audit for: " + userMsg) 
            .call()
            .content();

    } catch (Exception e) {
        return "[CA_OFFLINE]: I hit a snag. " + e.getMessage();
    }
}
}
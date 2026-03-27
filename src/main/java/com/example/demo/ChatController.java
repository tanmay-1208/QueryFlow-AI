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
            String userMsg = payload.getOrDefault("message", "Audit portfolio").toString();
            String rawItems = payload.getOrDefault("items", "[]").toString();
            String safeItems = rawItems.replace("{", "[").replace("}", "]");

            return builder.build()
                .prompt()
                .system(s -> s.text(
                    "You are the QueryFlow Executive CA. Do not give 'Welcome' messages. \n\n" +
                    "DIRECTIVE: Answer the user's specific question immediately using VAULT_DATA. \n" +
                    "1. If they ask for PROFIT: Calculate the exact price or units needed. \n" +
                    "2. If they ask for AUDIT: Only show details for the item mentioned. \n" +
                    "3. If they ask for STOCK: Give a simple analysis of that stock. \n\n" +
                    "STYLE: Straight Talk. Simple English. Bullet points. \n" +
                    "VAULT_DATA: " + safeItems
                ))
                .user("EXECUTE THIS COMMAND NOW: " + userMsg) 
                .call()
                .content();

        } catch (Exception e) {
            return "[CA_OFFLINE]: " + e.getMessage();
        }
    }
}
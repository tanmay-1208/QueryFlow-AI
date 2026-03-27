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
            // Safe extraction of the message
            String userMsg = payload.getOrDefault("message", 
                             payload.getOrDefault("query", "Audit my vault")).toString();

            // THE FIX: Clean the inventory string so Spring AI doesn't try to parse it
            String rawItems = payload.getOrDefault("items", "Empty").toString();
            String safeItems = rawItems.replace("{", "[").replace("}", "]");

            // Use .system(s -> s.text(...)) to force Spring to treat this as literal text
            return builder.build()
                .prompt()
                .system(s -> s.text("You are a Senior CA. User Inventory Context: " + safeItems))
                .user(userMsg)
                .call()
                .content();

        } catch (Exception e) {
            return "[AGENT_OFFLINE]: " + e.getMessage();
        }
    }
}
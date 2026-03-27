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

    @GetMapping("/test")
    public String test() {
        return "QUERYFLOW_V5_STABLE_FINAL";
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody Map<String, Object> payload) {
        try {
            // Extracts message from frontend terminal
            String userMsg = payload.getOrDefault("message", 
                             payload.getOrDefault("query", "Audit my portfolio")).toString();

            // Sanitize inventory data to prevent Spring AI Template errors
            String rawItems = payload.getOrDefault("items", "[]").toString();
            String safeItems = rawItems.replace("{", "[").replace("}", "]");

            return builder.build()
                .prompt()
                .system(s -> s.text("You are QueryFlow Agent v5.0, a Senior CA. User Inventory Context: " + safeItems))
                .user(userMsg)
                .call()
                .content();

        } catch (Exception e) {
            return "[AGENT_OFFLINE]: " + e.getMessage();
        }
    }
}
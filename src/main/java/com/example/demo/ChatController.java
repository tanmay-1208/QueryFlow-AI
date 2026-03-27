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
        return "VAULT_FINAL_STABLE_V27";
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody Map<String, Object> payload) {
        try {
            // Bulletproof extraction: Checks all common frontend keys
            String userMsg = "Hello";
            if (payload.get("message") != null) userMsg = payload.get("message").toString();
            else if (payload.get("query") != null) userMsg = payload.get("query").toString();
            else if (payload.get("prompt") != null) userMsg = payload.get("prompt").toString();
            
            // Context injection: Pulls your $1,012 GSH holding into the AI memory
            String context = payload.getOrDefault("items", "No items in vault").toString();

            return builder.build()
                .prompt()
                .system("You are QueryFlow Agent v5.0. Senior CA. User Assets: " + context)
                .user(userMsg)
                .call()
                .content();

        } catch (Exception e) {
            // This will show exactly what Groq says if it fails
            return "[AGENT_OFFLINE]: " + e.getMessage();
        }
    }
}
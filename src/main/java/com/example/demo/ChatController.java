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

    // This fixes the 404 on the /api/test page
    @GetMapping("/test")
    public String test() {
        return "VAULT_ALIVE_STABLE_V25";
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody Map<String, Object> payload) {
        try {
            String userMsg = payload.get("message") != null ? 
                             payload.get("message").toString() : 
                             payload.get("query").toString();
            
            Object items = payload.get("items");

            return builder.build()
                .prompt()
                .system("You are QueryFlow Agent v5.0. User Context: " + items)
                .user(userMsg)
                .call()
                .content();
        } catch (Exception e) {
            return "[AGENT_OFFLINE]: Backend is stable, but Groq connection timed out. Check base-url suffix.";
        }
    }
}
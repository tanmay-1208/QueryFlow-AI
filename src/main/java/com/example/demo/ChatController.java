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
            // Frontend sends 'message' and 'items'
            String userMsg = payload.get("message") != null ? 
                             payload.get("message").toString() : 
                             payload.get("query").toString();
            
            Object items = payload.get("items");

            return builder.build()
                .prompt()
                .system("You are QueryFlow Agent v5.0. User Vault Assets: " + items)
                .user(userMsg)
                .call()
                .content();
        } catch (Exception e) {
            return "[AGENT_OFFLINE]: Backend is stable, but the AI connection timed out. Check the base-url in properties.";
        }
    }
}
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
            // Frontend sends data as { "message": "...", "items": [...] }
            String userQuery = payload.containsKey("message") ? 
                               payload.get("message").toString() : 
                               payload.get("query").toString();
            
            Object inventory = payload.get("items");

            return builder.build()
                .prompt()
                .system("You are QueryFlow Agent v5.0. User Vault: " + inventory)
                .user(userQuery)
                .call()
                .content();
        } catch (Exception e) {
            return "[AGENT_OFFLINE]: Backend is stable, but Groq connection was refused. Check your API key for hidden spaces.";
        }
    }
}
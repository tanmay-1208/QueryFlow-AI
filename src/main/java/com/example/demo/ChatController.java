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
            // Extracts 'message' from the frontend terminal
            String userMsg = payload.get("message") != null ? 
                             payload.get("message").toString() : 
                             payload.get("query").toString();
            
            // Extracts your GSH inventory so the AI knows what you own
            Object items = payload.get("items");

            return builder.build()
                .prompt()
                .system("You are QueryFlow Agent v5.0. User Inventory: " + items)
                .user(userMsg)
                .call()
                .content();
        } catch (Exception e) {
            return "[AGENT_OFFLINE]: The AI handshake failed. Ensure the Groq key has no hidden spaces in Railway.";
        }
    }
}
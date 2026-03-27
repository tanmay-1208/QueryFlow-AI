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
            // Extracts the user's question and the inventory data
            String userMessage = payload.containsKey("message") ? 
                                 payload.get("message").toString() : 
                                 payload.get("query").toString();
            
            Object inventory = payload.get("items");

            return builder.build()
                .prompt()
                .system("You are QueryFlow Agent v5.0, a Senior CA. User Inventory Context: " + inventory)
                .user(userMessage)
                .call()
                .content();
        } catch (Exception e) {
            // This will show up in your Railway logs if Groq is still mad
            e.printStackTrace();
            return "[AGENT_OFFLINE]: Backend is stable, but Groq rejected the key. Check for spaces in Railway Variables.";
        }
    }
}
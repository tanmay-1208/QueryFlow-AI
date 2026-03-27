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
            // Extracts the message and the inventory items automatically
            String userQuery = payload.get("message") != null ? 
                               payload.get("message").toString() : 
                               payload.get("query").toString();
            
            Object items = payload.get("items");

            return builder.build()
                .prompt()
                .system("You are a Senior CA. Here is the user's current vault inventory: " + items)
                .user(userQuery)
                .call()
                .content();
        } catch (Exception e) {
            // Logs the specific error to Railway so we can see exactly why Groq is mad
            return "[AGENT_OFFLINE]: Backend is stable, but Groq rejected the key. Check Railway Variables.";
        }
    }
}
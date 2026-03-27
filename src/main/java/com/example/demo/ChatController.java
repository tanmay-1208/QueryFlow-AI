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
            String userQuery = (String) payload.get("query");
            List<Object> items = (List<Object>) payload.get("items");

            // This gives the AI the "Context" of your Vault
            return builder.build()
                .prompt()
                .system("You are a Senior CA. User Assets: " + items.toString())
                .user(userQuery)
                .call()
                .content();
        } catch (Exception e) {
            return "[AGENT_OFFLINE]: Backend is running, but the AI key is invalid or Groq is busy.";
        }
    }
}
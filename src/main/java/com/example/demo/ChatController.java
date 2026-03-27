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
        return "QUERYFLOW_V5_STABLE_HUMAN_READY";
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody Map<String, Object> payload) {
        try {
            // Get user question
            String userMsg = payload.getOrDefault("message", 
                             payload.getOrDefault("query", "Summarize my vault")).toString();

            // Sanitize data so AI doesn't crash on JSON braces
            String rawItems = payload.getOrDefault("items", "[]").toString();
            String safeItems = rawItems.replace("{", "[").replace("}", "]");

            return builder.build()
                .prompt()
                .system(s -> s.text(
                    "You are QueryFlow v5.0. Speak in 'Straight Talk' mode. \n" +
                    "INSTRUCTIONS: \n" +
                    "1. BE CONCISE. Use bold headers: **THE TOTAL**, **THE GOOD**, **THE FIX**. \n" +
                    "2. Use bullet points for items. \n" +
                    "3. No 'Hello' or 'As an AI'. Just the data. \n" +
                    "4. Explain values in plain English. \n" +
                    "User Inventory: " + safeItems
                ))
                .user(userMsg)
                .call()
                .content();

        } catch (Exception e) {
            return "[OFFLINE]: I hit a snag. Check the logs. " + e.getMessage();
        }
    }
}
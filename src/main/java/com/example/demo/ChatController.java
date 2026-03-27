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
            String userMsg = payload.getOrDefault("message", "Audit my portfolio").toString();
            String rawItems = payload.getOrDefault("items", "[]").toString();
            String safeItems = rawItems.replace("{", "[").replace("}", "]");

            return builder.build()
                .prompt()
                .system(s -> s.text(
                    "You are QueryFlow Agent v5.0. Your goal is to explain financial data so " +
                    "ANYONE can understand it. Follow these rules: \n" +
                    "1. Avoid jargon. Instead of 'Portfolio Liquidity,' say 'How quickly you can get your cash.' \n" +
                    "2. Use friendly analogies (e.g., 'Your vault is like a high-tech piggy bank'). \n" +
                    "3. Highlight 'The Good News' and 'Things to Watch.' \n" +
                    "4. Be encouraging and clear. \n" +
                    "User Inventory Context: " + safeItems
                ))
                .user(userMsg)
                .call()
                .content();

        } catch (Exception e) {
            return "[AGENT_OFFLINE]: I'm having a little trouble connecting to the brain. " + e.getMessage();
        }
    }
}
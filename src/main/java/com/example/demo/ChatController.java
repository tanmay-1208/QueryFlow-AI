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
        String userMsg = payload.getOrDefault("message", "Audit portfolio").toString();
        String rawItems = payload.getOrDefault("items", "[]").toString();
        String safeItems = rawItems.replace("{", "[").replace("}", "]");

        return builder.build()
            .prompt()
            .system(s -> s.text(
                "You are QueryFlow v5.0. Speak in 'Straight Talk' mode. \n" +
                "RULES: \n" +
                "1. BE CONCISE. No long introductions. \n" +
                "2. Use only 3 sections: 'THE TOTAL', 'THE GOOD', and 'THE FIX'. \n" +
                "3. Use plain English. No financial jargon. \n" +
                "4. If the user asks a specific question, answer it in 2 sentences max. \n" +
                "Current Vault Data: " + safeItems
            ))
            .user(userMsg)
            .call()
            .content();

    } catch (Exception e) {
        return "[OFFLINE]: Check the connection. " + e.getMessage();
    }
}
}
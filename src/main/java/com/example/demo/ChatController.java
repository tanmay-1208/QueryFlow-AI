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
                "You are the QueryFlow AI Chartered Accountant (CA). \n\n" +
                "STRICT RULE: Only audit the specific items the user asks for. \n" +
                "If the user asks for 'Vintage Clock', DO NOT include 'GSH' in your report. \n\n" +
                "FORMAT: \n" +
                "1. **AUDIT STATUS**: Specific to the requested item. \n" +
                "2. **VALUATION**: Calculation for the requested item only. \n" +
                "3. **CA OBSERVATION**: One simple tip for this item. \n\n" +
                "Full Vault Context (Filter this list): " + safeItems
            ))
            .user(userMsg)
            .call()
            .content();

    } catch (Exception e) {
        return "[CA_OFFLINE]: " + e.getMessage();
    }
}
}
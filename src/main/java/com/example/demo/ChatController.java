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
            String userMsg = payload.getOrDefault("message", "Provide an audit report").toString();
            
            // Sanitize inventory data for stability
            String rawItems = payload.getOrDefault("items", "[]").toString();
            String safeItems = rawItems.replace("{", "[").replace("}", "]");

            return builder.build()
                .prompt()
                .system(s -> s.text(
                    "You are the QueryFlow AI Chartered Accountant (CA). \n\n" +
                    "CORE MISSION: Answer every question directly and simply. \n" +
                    "AUDIT MODE: When asked for an audit, use these exact headers: \n" +
                    "1. **AUDIT STATUS**: (Is the asset recorded correctly?)\n" +
                    "2. **VALUATION**: (What is the total worth in plain numbers?)\n" +
                    "3. **CA OBSERVATION**: (Simple advice on what to do next.)\n\n" +
                    "STYLE RULES: \n" +
                    "- Use 'Straight Talk' (no jargon like 'liquidity' or 'amortization'). \n" +
                    "- Keep it brief and easy for anyone to understand. \n" +
                    "User Inventory Data: " + safeItems
                ))
                .user(userMsg)
                .call()
                .content();

        } catch (Exception e) {
            return "[CA_OFFLINE]: I couldn't reach the vault. Error: " + e.getMessage();
        }
    }
}
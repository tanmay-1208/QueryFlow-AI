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
            
            // Safety check: remove JSON braces that break the AI template
            String safeItems = rawItems.replace("{", "[").replace("}", "]");

            return builder.build()
                .prompt()
                .system(s -> s.text(
                    "You are the QueryFlow AI Chartered Accountant (CA). \n\n" +
                    "CRITICAL RULE: Only report on the SPECIFIC item requested by the user. \n" +
                    "If the user asks for 'Vintage Clock', IGNORE 'GSH' entirely. \n" +
                    "Do not calculate the 'entire vault' unless explicitly asked. \n\n" +
                    "REQUIRED FORMAT: \n" +
                    "**AUDIT STATUS**: [Is the specific item recorded correctly?] \n" +
                    "**VALUATION**: [Quantity x Price = Total for THIS item only] \n" +
                    "**CA OBSERVATION**: [One simple, easy-to-understand tip.] \n\n" +
                    "Language: Simple 'Straight Talk'. No jargon. \n" +
                    "Inventory Context: " + safeItems
                ))
                .user(userMsg)
                .call()
                .content();

        } catch (Exception e) {
            return "[CA_OFFLINE]: " + e.getMessage();
        }
    }
}
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
            // Aggressive extraction of your command
            String userMsg = payload.getOrDefault("message", 
                             payload.getOrDefault("query", "Audit report")).toString();
            
            // Clean inventory data
            String rawItems = payload.getOrDefault("items", "[]").toString();
            String safeItems = rawItems.replace("{", "[").replace("}", "]");

            return builder.build()
                .prompt()
                .system(s -> s.text(
                    "You are the QueryFlow AI Chartered Accountant (CA). \n\n" +
                    "STRICT TASK: Create a 'Straight Talk' audit for the item requested. \n" +
                    "1. Scan VAULT_DATA for the requested item only. \n" +
                    "2. If 'Vintage Clock' is mentioned, ignore GSH and all other assets. \n" +
                    "3. Format with: **AUDIT STATUS**, **VALUATION**, and **CA ADVICE**. \n\n" +
                    "VAULT_DATA: " + safeItems
                ))
                .user("Please audit this specifically: " + userMsg) 
                .call()
                .content();

        } catch (Exception e) {
            // Now you'll see if the URL is still wrong
            return "[CA_ERROR]: " + e.getMessage();
        }
    }
}
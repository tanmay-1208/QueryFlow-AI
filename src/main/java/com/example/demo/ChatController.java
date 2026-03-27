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
            // Aggressive capture of your command
            String userMsg = payload.getOrDefault("message", 
                             payload.getOrDefault("query", "Audit")).toString();
            
            // Clean the inventory list
            String rawItems = payload.getOrDefault("items", "[]").toString();
            String safeItems = rawItems.replace("{", "[").replace("}", "]");

            return builder.build()
                .prompt()
                .system(s -> s.text(
                    "You are the QueryFlow Senior CA & Profit Strategist. \n\n" +
                    "YOUR MISSION: Answer every user question with a simple, direct solution. \n" +
                    "1. PROFIT MODE: If asked about profit or 'how to make money', do the math using VAULT_DATA. \n" +
                    "2. AUDIT MODE: If asked for an audit of a specific item, ignore everything else. \n" +
                    "3. STYLE: Use 'Straight Talk'—very simple English, bullet points, no long intros. \n" +
                    "4. NO WELCOME MESSAGES. Go straight to the answer. \n\n" +
                    "VAULT_DATA: " + safeItems
                ))
                .user("USER COMMAND: " + userMsg) 
                .call()
                .content();

        } catch (Exception e) {
            return "[CA_ERROR]: Neural link failed. " + e.getMessage();
        }
    }
}
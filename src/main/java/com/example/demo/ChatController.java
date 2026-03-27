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
        return "QUERYFLOW_CA_STABLE_V31";
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody Map<String, Object> payload) {
        try {
            // 1. Capture your exact command
            String userQuery = payload.getOrDefault("message", 
                               payload.getOrDefault("query", "Summarize")).toString();
            
            // 2. Capture your inventory and clean it
            String rawItems = payload.getOrDefault("items", "[]").toString();
            String safeItems = rawItems.replace("{", "[").replace("}", "]");

            // 3. The "Direct Directive" Prompt
            return builder.build()
                .prompt()
                .system(s -> s.text(
                    "You are the QueryFlow AI Chartered Accountant (CA). \n\n" +
                    "YOUR ROLE: You don't 'find' reports; you CREATE them using the VAULT_DATA provided. \n\n" +
                    "STRICT FILTERING RULES: \n" +
                    "1. Read the 'USER_COMMAND'. \n" +
                    "2. If it mentions a specific item (e.g., 'Vintage Clock'), ONLY use data for that item. \n" +
                    "3. DO NOT mention GSH or other assets if they weren't asked for. \n" +
                    "4. Explain in very simple, easy-to-understand English. \n\n" +
                    "VAULT_DATA (Your Source): " + safeItems
                ))
                .user("USER_COMMAND: " + userQuery) 
                .call()
                .content();

        } catch (Exception e) {
            return "[CA_OFFLINE]: System hiccup. " + e.getMessage();
        }
    }
}
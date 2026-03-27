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
        return "QUERYFLOW_CA_STABLE_V30";
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody Map<String, Object> payload) {
        try {
            // 1. Get the specific question you typed
            String userQuery = payload.getOrDefault("message", 
                               payload.getOrDefault("query", "Audit report")).toString();
            
            // 2. Get the inventory and clean it
            String rawItems = payload.getOrDefault("items", "[]").toString();
            String safeItems = rawItems.replace("{", "[").replace("}", "]");

            // 3. The "Laser-Focus" Prompt
            return builder.build()
                .prompt()
                .system(s -> s.text(
                    "You are the QueryFlow AI Chartered Accountant (CA). \n\n" +
                    "CRITICAL INSTRUCTION: \n" +
                    "1. Look at the 'USER_QUESTION' below. \n" +
                    "2. Only audit the specific item mentioned in that question. \n" +
                    "3. If the user asks for 'Vintage Clock', DO NOT mention 'GSH' or other items. \n" +
                    "4. Use 'Straight Talk' (Very simple English). \n\n" +
                    "VAULT_DATA: " + safeItems
                ))
                .user("USER_QUESTION: " + userQuery) 
                .call()
                .content();

        } catch (Exception e) {
            return "[CA_OFFLINE]: I hit a snag. " + e.getMessage();
        }
    }
}
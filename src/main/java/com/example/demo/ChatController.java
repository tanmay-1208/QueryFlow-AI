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
            // 1. EXTRACT: Try every possible key the frontend might use
            String rawCommand = "Audit";
            if (payload.containsKey("message")) rawCommand = payload.get("message").toString();
            else if (payload.containsKey("query")) rawCommand = payload.get("query").toString();
            else if (payload.containsKey("command")) rawCommand = payload.get("command").toString();
            
            final String userCommand = rawCommand;

            // 2. CONTEXT: Get and clean the data
            String rawItems = payload.getOrDefault("items", "[]").toString();
            String safeItems = rawItems.replace("{", "[").replace("}", "]");

            // 3. THE "LASER" PROMPT
            return builder.build()
                .prompt()
                .system(s -> s.text(
                    "You are the QueryFlow AI Chartered Accountant (CA). \n\n" +
                    "STRICT RULES: \n" +
                    "1. Only audit the item mentioned in the 'USER_COMMAND'. \n" +
                    "2. If the user mentions 'Vintage Clock', DO NOT mention 'GSH' or anything else. \n" +
                    "3. If the user does not specify an item, only then audit everything. \n" +
                    "4. Use 'Straight Talk' (Very simple English). \n\n" +
                    "FORMAT: \n" +
                    "**AUDIT STATUS**: [Status of requested item only] \n" +
                    "**VALUATION**: [Quantity x Price = Total for requested item only] \n" +
                    "**CA OBSERVATION**: [One simple tip.] \n\n" +
                    "VAULT_DATA: " + safeItems
                ))
                .user("USER_COMMAND: " + userCommand) 
                .call()
                .content();

        } catch (Exception e) {
            return "[CA_OFFLINE]: " + e.getMessage();
        }
    }
}
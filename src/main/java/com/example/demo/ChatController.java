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
        // Capture the user message (e.g., "Give me an audit report of vintage clock")
        String userMsg = payload.getOrDefault("message", "Audit portfolio").toString();
        
        // Clean the inventory data
        String rawItems = payload.getOrDefault("items", "[]").toString();
        String safeItems = rawItems.replace("{", "[").replace("}", "]");

        return builder.build()
            .prompt()
            .system(s -> s.text(
                "You are a professional Chartered Accountant (CA). \n\n" +
                "YOUR JOB: Create a simple audit based on the user's specific request using the provided VAULT_DATA. \n" +
                "1. If the user asks for 'Vintage Clock', focus ONLY on that. Ignore all other items. \n" +
                "2. DO NOT look for a report in the data. You ARE the report generator. \n" +
                "3. Use plain, simple English. \n\n" +
                "VAULT_DATA (Your Source Material): " + safeItems
            ))
            .user("Perform this audit for me: " + userMsg) 
            .call()
            .content();

    } catch (Exception e) {
        return "[CA_OFFLINE]: " + e.getMessage();
    }
}
}
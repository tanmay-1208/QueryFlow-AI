package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*") 
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder builder) {
        // Safety wrapper to ensure the app starts even if API key is missing
        ChatClient temp = null;
        try {
            temp = builder.build();
        } catch (Exception e) {
            System.err.println("AI Builder failed: " + e.getMessage());
        }
        this.chatClient = temp;
    }

    // This will now be reachable at /test (No /api prefix needed)
    @GetMapping("/test")
    public String test() {
        return "Vault AI Core is ONLINE. Status: " + (chatClient != null ? "READY" : "OFFLINE");
    }

    @PostMapping("/api/chat")
    public String handleChat(@RequestBody ChatRequest request) {
        if (chatClient == null) return "[AGENT_ERR]: AI Configuration Error on Railway.";
        
        try {
            List<Product> products = request.getItems() != null ? request.getItems() : new ArrayList<>();
            String inventorySummary = products.stream()
                .map(p -> p.getName() + ": $" + p.getPrice())
                .collect(Collectors.joining(", "));

            return chatClient.prompt()
                .system("You are a Senior CA. Inventory context: " + inventorySummary)
                .user(request.getUserQuery())
                .call()
                .content();
        } catch (Exception e) {
            return "[AGENT_ERR]: AI Request failed. Verify your Groq API Key.";
        }
    }

    public static class ChatRequest {
        private String userQuery;
        private List<Product> items;
        public String getUserQuery() { return userQuery; }
        public void setUserQuery(String userQuery) { this.userQuery = userQuery; }
        public List<Product> getItems() { return items; }
        public void setItems(List<Product> items) { this.items = items; }
    }
}
package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api") // This is CRITICAL for your products to reappear
@CrossOrigin(origins = "*") 
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder builder) {
        ChatClient temp = null;
        try {
            temp = builder.build();
        } catch (Exception e) {
            System.err.println("AI System Offline: " + e.getMessage());
        }
        this.chatClient = temp;
    }

    // Reachable at /api/test
    @GetMapping("/test")
    public String test() {
        return "VAULT_API_ALIGNED_V7";
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody ChatRequest request) {
        if (chatClient == null) return "[ERR]: AI link missing in Railway.";
        
        try {
            List<Product> products = request.getItems() != null ? request.getItems() : new ArrayList<>();
            String inventorySummary = products.stream()
                .map(p -> p.getName() + ": $" + p.getPrice())
                .collect(Collectors.joining(", "));

            return chatClient.prompt()
                .system("You are a Senior CA. Inventory: " + (inventorySummary.isEmpty() ? "None" : inventorySummary))
                .user(request.getUserQuery())
                .call()
                .content();
        } catch (Exception e) {
            return "[ERR]: Connection to Groq timed out.";
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
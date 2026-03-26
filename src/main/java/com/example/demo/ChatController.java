package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api") // This MUST be here to match your frontend /api/products path
@CrossOrigin(origins = "*") 
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder builder) {
        ChatClient temp = null;
        try {
            temp = builder.build();
        } catch (Exception e) {
            // This prevents the whole app from crashing if the AI key is missing
            System.err.println("AI System offline: " + e.getMessage());
        }
        this.chatClient = temp;
    }

    @GetMapping("/test")
    public String test() {
        return "VAULT_CORE_STABILIZED_V8";
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody ChatRequest request) {
        if (chatClient == null) return "[ERR]: AI link missing in Railway Variables.";
        
        try {
            List<Product> products = request.getItems() != null ? request.getItems() : new ArrayList<>();
            String summary = products.stream()
                .map(p -> p.getName() + ": $" + p.getPrice())
                .collect(Collectors.joining(", "));

            return chatClient.prompt()
                .system("You are a Senior CA. Inventory: " + (summary.isEmpty() ? "Empty" : summary))
                .user(request.getUserQuery())
                .call()
                .content();
        } catch (Exception e) {
            return "[ERR]: AI Request failed. Verify your Groq Key.";
        }
    }

    // Static inner class to ensure it's always available
    public static class ChatRequest {
        private String userQuery;
        private List<Product> items;
        public String getUserQuery() { return userQuery; }
        public void setUserQuery(String userQuery) { this.userQuery = userQuery; }
        public List<Product> getItems() { return items; }
        public void setItems(List<Product> items) { this.items = items; }
    }
}
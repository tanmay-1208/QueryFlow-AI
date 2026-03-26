package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*") // Allows your Vercel frontend to connect
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    // Try moving the test to the root to see if it responds
    @GetMapping("/test")
    public String test() {
        return "Vault AI Core: ONLINE";
    }

    @PostMapping("/api/chat")
    public String handleChat(@RequestBody ChatRequest request) {
        try {
            List<Product> products = request.getItems() != null ? request.getItems() : new ArrayList<>();
            String inventorySummary = products.stream()
                .map(p -> p.getName() + ": $" + p.getPrice())
                .collect(Collectors.joining(", "));

            return chatClient.prompt()
                .system("You are a Senior CA. Audit this: " + (inventorySummary.isEmpty() ? "Empty" : inventorySummary))
                .user(request.getUserQuery())
                .call()
                .content();
        } catch (Exception e) {
            return "[AGENT_ERR]: AI authentication failed. Check Railway Keys.";
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
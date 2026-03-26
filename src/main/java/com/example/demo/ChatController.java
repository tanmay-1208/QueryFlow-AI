package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
// Remove @CrossOrigin here because your WebConfig.java is now handling it globally
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder builder) {
        ChatClient temp = null;
        try {
            // We use a safe build to prevent a startup crash
            temp = builder.build();
        } catch (Exception e) {
            System.err.println("AI System offline: " + e.getMessage());
        }
        this.chatClient = temp;
    }

    @GetMapping("/test")
    public String test() {
        return "VAULT_API_READY_V6";
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody ChatRequest request) {
        if (chatClient == null) return "[ERR]: AI Link Offline.";
        
        try {
            List<Product> products = request.getItems() != null ? request.getItems() : new ArrayList<>();
            String summary = products.stream()
                .map(p -> p.getName() + ": $" + p.getPrice())
                .collect(Collectors.joining(", "));

            return chatClient.prompt()
                .system("You are a Senior CA. Inventory context: " + summary)
                .user(request.getUserQuery())
                .call()
                .content();
        } catch (Exception e) {
            return "[ERR]: AI Request Timeout.";
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
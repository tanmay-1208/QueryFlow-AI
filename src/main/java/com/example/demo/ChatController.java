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
        ChatClient temp = null;
        try {
            temp = builder.build();
        } catch (Exception e) {
            System.err.println("AI Builder failed: " + e.getMessage());
        }
        this.chatClient = temp;
    }

    // Health Check at the ROOT level
    @GetMapping("/test")
    public String test() {
        return "VAULT_API_CORE_ONLINE_V5";
    }

    @PostMapping("/api/chat")
    public String handleChat(@RequestBody ChatRequest request) {
        if (chatClient == null) return "[AGENT_ERR]: AI Configuration missing in Railway.";
        
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
            return "[AGENT_ERR]: Connection to Groq failed.";
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
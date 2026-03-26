package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") 
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody ChatRequest request) {
        try {
            // Safety: Ensure products list isn't null
            List<Product> products = request.getItems() != null ? request.getItems() : new ArrayList<>();
            
            // Format inventory for the AI
            String inventorySummary = products.stream()
                .map(p -> p.getName() + ": $" + p.getPrice() + " (Stock: " + p.getStock() + ")")
                .collect(Collectors.joining(", "));

            String systemMsg = "You are a Senior Chartered Accountant. Audit this data: " + 
                               (inventorySummary.isEmpty() ? "No assets currently vaulted." : inventorySummary);

            return chatClient.prompt()
                .system(systemMsg)
                .user(request.getUserQuery())
                .call()
                .content();

        } catch (Exception e) {
            return "[AGENT_ERR]: AI Link Offline. Verify GROQ_API_KEY in Railway Variables.";
        }
    }

    // Consolidated inner class - prevents "Class not found" errors
    public static class ChatRequest {
        private String userQuery;
        private List<Product> items;
        public String getUserQuery() { return userQuery; }
        public void setUserQuery(String userQuery) { this.userQuery = userQuery; }
        public List<Product> getItems() { return items; }
        public void setItems(List<Product> items) { this.items = items; }
    }
}
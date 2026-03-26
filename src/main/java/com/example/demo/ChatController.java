package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    // A simple GET to verify the service is up
    @GetMapping("/health")
    public String health() {
        return "Vault AI Service: ONLINE";
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody ChatRequest request) {
        try {
            List<Product> products = request.getItems() != null ? request.getItems() : new ArrayList<>();
            String inventorySummary = products.stream()
                .map(p -> p.getName() + ": $" + p.getPrice())
                .collect(Collectors.joining(", "));

            return chatClient.prompt()
                .system("You are a Senior CA. Audit this: " + (inventorySummary.isEmpty() ? "Empty Vault" : inventorySummary))
                .user(request.getUserQuery())
                .call()
                .content();
        } catch (Exception e) {
            return "[AGENT_ERR]: AI Link Offline. Verify GROQ_API_KEY in Railway.";
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
package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatClient.Builder chatClientBuilder;

    public ChatController(ChatClient.Builder chatClientBuilder) {
        this.chatClientBuilder = chatClientBuilder;
    }

    @GetMapping("/test")
    public String test() {
        return "VAULT_BACKEND_STABILIZED_V10";
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody ChatRequest request) {
        try {
            // Build the client on-demand to prevent startup crashes
            ChatClient client = chatClientBuilder.build();
            
            List<Product> products = request.getItems() != null ? request.getItems() : new ArrayList<>();
            String summary = products.stream()
                .map(p -> p.getName() + ": $" + p.getPrice())
                .collect(Collectors.joining(", "));

            return client.prompt()
                .system("You are a Senior CA. Audit this: " + (summary.isEmpty() ? "No data" : summary))
                .user(request.getUserQuery())
                .call()
                .content();
        } catch (Exception e) {
            return "[AGENT_ERR]: AI Link Offline. Your Vault data is safe, but the Agent is unavailable.";
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
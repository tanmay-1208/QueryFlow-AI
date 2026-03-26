package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import java.util.*;

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
        return "VAULT_SERVICE_ALIGNED_V12";
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody ChatRequest request) {
        try {
            // Build the client inside the request to prevent startup crashes
            ChatClient client = chatClientBuilder.build();
            return client.prompt()
                .user(request.getUserQuery())
                .call()
                .content();
        } catch (Exception e) {
            return "[AGENT_OFFLINE]: Your assets are safe, but the AI is misconfigured. Check the API Key name.";
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
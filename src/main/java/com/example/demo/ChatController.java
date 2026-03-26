package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") 
public class ChatController {

    private final ChatClient chatClient;

    // Use a try-catch in the constructor so a missing API key doesn't crash the server
    public ChatController(ChatClient.Builder builder) {
        ChatClient temp = null;
        try {
            temp = builder.build();
        } catch (Exception e) {
            System.err.println("AI System initialized in OFFLINE mode: " + e.getMessage());
        }
        this.chatClient = temp;
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody ChatRequest request) {
        if (chatClient == null) {
            return "[AGENT_ERR]: AI Core is offline. Check SPRING_AI_GROQ_API_KEY in Railway.";
        }

        try {
            List<Product> products = request.getItems() != null ? request.getItems() : new ArrayList<>();
            String summary = products.stream()
                .map(p -> p.getName() + ": $" + p.getPrice())
                .collect(Collectors.joining(", "));

            return chatClient.prompt()
                .system("You are a Senior CA. Audit this inventory: " + summary)
                .user(request.getUserQuery())
                .call()
                .content();
        } catch (Exception e) {
            return "[AGENT_ERR]: Connection to Groq failed. Verify API quota.";
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
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
            // Safety check: if items are null, create an empty list
            List<Product> items = request.getItems() != null ? request.getItems() : new ArrayList<>();

            // 1. Create a data summary for the AI
            String inventorySummary = items.stream()
                .map(p -> p.getName() + ": $" + p.getPrice() + " (Stock: " + p.getStock() + ")")
                .collect(Collectors.joining(", "));

            // 2. The CA-Level System Prompt
            String systemMessage = "You are a Senior Chartered Accountant. " +
                                 "Audit this data: " + (inventorySummary.isEmpty() ? "No data available" : inventorySummary) + ". " +
                                 "Answer the user professionally using accounting terms (GST, ROI, Margins).";

            // 3. Call the AI
            return chatClient.prompt()
                .system(systemMessage)
                .user(request.getUserQuery())
                .call()
                .content();

        } catch (Exception e) {
            e.printStackTrace();
            return "[AGENT_ERR]: AI Link Failed. Verify SPRING_AI_GROQ_API_KEY in Railway.";
        }
    }

    // Consolidated Request Class inside the controller
    public static class ChatRequest {
        private String userQuery;
        private List<Product> items;

        public String getUserQuery() { return userQuery; }
        public void setUserQuery(String userQuery) { this.userQuery = userQuery; }
        public List<Product> getItems() { return items; }
        public void setItems(List<Product> items) { this.items = items; }
    }
}
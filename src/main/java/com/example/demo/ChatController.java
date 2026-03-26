package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Ensures Vercel can talk to Railway
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody ChatRequest request) {
        // 1. Log to Railway console so you can see it working
        System.out.println("AI AUDIT REQUEST RECEIVED: " + request.getUserQuery());

        try {
            // 2. Prepare the data for the CA
            String inventoryData = request.getItems().stream()
                .map(p -> "- " + p.getName() + ": Price $" + p.getPrice() + ", Stock " + p.getStock())
                .collect(Collectors.joining("\n"));

            // 3. The Professional Prompt
            String systemMessage = "ACT AS A SENIOR CHARTERED ACCOUNTANT. " +
                "Analyze this inventory:\n" + inventoryData + "\n\n" +
                "Instructions: Answer the operator's query with high financial accuracy. " +
                "Use terms like Net Margin, GST, and Liquidity.";

            // 4. THE ACTUAL AI CALL (This replaces the placeholder)
            return chatClient.prompt()
                .system(systemMessage)
                .user(request.getUserQuery())
                .call()
                .content();

        } catch (Exception e) {
            System.err.println("Groq AI Error: " + e.getMessage());
            return "[AGENT_ERR]: Neural link severed. Verify 'SPRING_AI_GROQ_API_KEY' in Railway Variables.";
        }
    }

    // Consolidated Request Class
    public static class ChatRequest {
        private String userQuery;
        private List<Product> items;

        public String getUserQuery() { return userQuery; }
        public void setUserQuery(String userQuery) { this.userQuery = userQuery; }
        public List<Product> getItems() { return items; }
        public void setItems(List<Product> items) { this.items = items; }
    }
}
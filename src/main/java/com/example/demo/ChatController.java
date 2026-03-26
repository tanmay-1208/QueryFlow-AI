package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // CRITICAL: This allows your Vercel app to fetch data
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody ChatRequest request) {
        try {
            // 1. Build context from the items sent by the frontend
            String inventoryContext = request.getItems().stream()
                .map(p -> String.format("- %s: Price $%s, Cost $%s, Stock %s", 
                    p.getName(), p.getPrice(), p.getCost_price(), p.getStock()))
                .collect(Collectors.joining("\n"));

            // 2. The CA System Prompt
            String systemInstruction = "ACT AS A SENIOR CHARTERED ACCOUNTANT (CA). " +
                "Here is the inventory data:\n" + inventoryContext + "\n\n" +
                "Answer the user's query professionally with financial precision.";

            // 3. Call Groq
            return chatClient.prompt()
                .system(systemInstruction)
                .user(request.getUserQuery())
                .call()
                .content();

        } catch (Exception e) {
            e.printStackTrace();
            return "[AGENT_ERR]: AI authentication failed. Check SPRING_AI_GROQ_API_KEY in Railway.";
        }
    }

    // Consolidated Inner Class
    public static class ChatRequest {
        private String userQuery;
        private List<Product> items; // Ensure this matches your Product.java class name

        public String getUserQuery() { return userQuery; }
        public void setUserQuery(String userQuery) { this.userQuery = userQuery; }
        public List<Product> getItems() { return items; }
        public void setItems(List<Product> items) { this.items = items; }
    }
}
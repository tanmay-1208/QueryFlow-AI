package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://query-flow-ai-uq5t.vercel.app", allowCredentials = "true")
public class ChatController {

    private final ChatClient.Builder builder;

    public ChatController(ChatClient.Builder builder) {
        this.builder = builder;
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody Map<String, Object> payload) {
        try {
            String userMsg = payload.getOrDefault("message", "Audit portfolio").toString();
            String rawItems = payload.getOrDefault("items", "[]").toString();
            String safeItems = rawItems.replace("{", "[").replace("}", "]");

            return builder.build()
                .prompt()
                .system(s -> s.text(
                    "You are the QueryFlow Meta-Cognitive Agent. Your goal is to be an authentic, " +
                    "adaptive AI collaborator with a touch of wit. \n\n" +
                    "PROTOCOL: \n" +
                    "1. DECOMPOSE: Break the user's request into sub-problems (Math, Audit, Strategy). \n" +
                    "2. SOLVE: Address each using the VAULT_DATA. \n" +
                    "3. VERIFY: Ensure calculations are logically sound. \n" +
                    "4. SYNTHESIZE: Combine into a clear, concise, and helpful response. \n\n" +
                    "STYLE RULES: \n" +
                    "- Balance empathy with candor. \n" +
                    "- Use 'Straight Talk' (Simple English). \n" +
                    "- No robotic intros. Go straight to the insight. \n\n" +
                    "VAULT_DATA: " + safeItems
                ))
                .user("COLLABORATIVE_REQUEST: " + userMsg) 
                .call()
                .content();

        } catch (Exception e) {
            return "[SYSTEM_ERROR]: " + e.getMessage();
        }
    }
}
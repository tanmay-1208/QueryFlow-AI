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
                    "You are Gemini, the QueryFlow AI collaborator. Be authentic, grounded, and concise. \n\n" +
                    "CORE PROTOCOL: \n" +
                    "1. Reason internally (Decompose, Solve, Verify) but DO NOT output these steps. \n" +
                    "2. Only output the final insight (Synthesis). \n" +
                    "3. If the user asks for a specific item, ignore everything else. \n" +
                    "4. Balance empathy with candor. Be a helpful peer, not a rigid lecturer. \n\n" +
                    "STYLE: \n" +
                    "- Keep it short. Use bold headers only for key points. \n" +
                    "- Use a touch of wit if appropriate. \n" +
                    "VAULT_DATA: " + safeItems
                ))
                .user(userMsg) 
                .call()
                .content();

        } catch (Exception e) {
            return "[SYSTEM_ERROR]: " + e.getMessage();
        }
    }
}
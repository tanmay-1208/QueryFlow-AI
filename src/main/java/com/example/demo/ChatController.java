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
        String userMsg = payload.getOrDefault("message", "Summarize").toString();
        String rawItems = payload.getOrDefault("items", "[]").toString();
        String safeItems = rawItems.replace("{", "[").replace("}", "]");

        return builder.build()
            .prompt()
            .system(s -> s.text(
                "You are the QueryFlow AI Chartered Accountant (CA) & Strategic Advisor. \n\n" +
                "MODE 1: AUDIT (If user asks 'Audit X') \n" +
                "- Provide **AUDIT STATUS**, **VALUATION**, and **CA ADVICE** for that specific item only. \n\n" +
                "MODE 2: PROFIT STRATEGY (If user asks 'How to make X profit' or 'Strategy') \n" +
                "- Analyze the current VAULT_DATA. \n" +
                "- Calculate exactly how many more units or what price increase is needed to hit the target. \n" +
                "- Use headers: **TARGET**, **REQUIRED ACTION**, and **RISK CHECK**. \n\n" +
                "LANGUAGE: Straight Talk. Simple English. No jargon. \n" +
                "VAULT_DATA: " + safeItems
            ))
            .user("USER COMMAND: " + userMsg) 
            .call()
            .content();

    } catch (Exception e) {
        return "[CA_ERROR]: " + e.getMessage();
    }
}
}
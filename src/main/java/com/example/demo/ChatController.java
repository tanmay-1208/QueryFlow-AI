package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://query-flow-ai-uq5t.vercel.app", allowCredentials = "true")
public class ChatController {

    private final ChatClient.Builder builder;

    public ChatController(ChatClient.Builder builder) {
        this.builder = builder;
    }

    @GetMapping("/test")
    public String test() {
        return "VAULT_CORE_STABILIZED_V19";
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody String query) {
        try {
            return builder.build().prompt().user(query).call().content();
        } catch (Exception e) {
            return "[AGENT_OFFLINE]: Backend is running, but AI key check failed.";
        }
    }
}
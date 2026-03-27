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
            // Frontend sends the query under "message"
            String userMsg = payload.get("message") != null ? 
                             payload.get("message").toString() : 
                             payload.get("query").toString();
            
            // This pulls your $1,012 GSH context into the AI's "memory"
            Object items = payload.get("items");

            return builder.build()
                .prompt()
                .system("You are QueryFlow Agent v5.0. User Context: " + items)
                .user(userMsg)
                .call()
                .content();
        } catch (Exception e) {
            // This error will specifically show up in your Railway 'Logs' tab
            e.printStackTrace(); 
            return "[AGENT_OFFLINE]: The Groq connection was refused. Check Railway for hidden spaces in your API Key.";
        }
    }
}
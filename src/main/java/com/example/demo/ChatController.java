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
                        "You are VaultCA, a friendly financial helper for small business owners.\n\n" +

"HOW TO TALK:\n" +
"- Talk like you are explaining to a friend who is not good with numbers.\n" +
"- Use simple words only. No jargon. No complex terms.\n" +
"- Always use Rs. for money amounts.\n" +
"- Use emojis to make it friendly and easy to read.\n\n" +

"STRICT RULES:\n" +
"1. NEVER talk about items not mentioned in the question.\n" +
"2. ALWAYS answer the exact question asked.\n" +
"3. ALWAYS show the math in the simplest way possible.\n" +
"4. If cost price is Rs.0 or missing, say: 'I dont know the buy price of [item]. Please add it first!'\n" +
"5. End with one simple tip the person can do RIGHT NOW.\n\n" +

"RESPONSE FORMAT (always use this):\n" +
"[Item Name] - How to make Rs.[target] profit\n\n" +
"What you paid to buy it: Rs.X per piece\n" +
"What you sell it for now: Rs.Y per piece\n" +
"Your profit on each piece: Rs.(Y-X)\n\n" +
"To make Rs.[target] profit, you need to sell: [target / (Y-X)] pieces\n" +
"You have [stock] pieces -> so you can make max Rs.[stock x (Y-X)] profit right now\n\n" +
"Simple Tip: [one easy action they can take today]\n\n" +

"EXAMPLE:\n" +
"FF - How to make Rs.10,000 profit\n\n" +
"What you paid to buy it: Rs.123 per piece\n" +
"What you sell it for now: Rs.234 per piece\n" +
"Your profit on each piece: Rs.111\n\n" +
"To make Rs.10,000 profit, you need to sell: 90 pieces\n" +
"You only have 21 pieces -> so you can make max Rs.2,331 profit right now\n\n" +
"Simple Tip: Either buy 69 more pieces of FF, or raise your sell price to Rs.600 to make Rs.10,000 from just 21 pieces!\n\n" +

"VAULT_DATA:\n" + safeItems
                    ))
                    .user(userMsg)
                    .call()
                    .content();

    } catch (Exception e) {
        return "Vault Connection Error: " + e.getMessage();
    }
}
}
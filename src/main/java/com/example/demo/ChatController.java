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
                        "You are VaultCA, a personal Chartered Accountant. You have the user's inventory data below.\n\n" +

                        "STRICT RULES - NEVER BREAK THESE:\n" +
                        "1. NEVER dump a full inventory summary unless explicitly asked for 'audit' or 'summary'.\n" +
                        "2. ALWAYS answer the EXACT question asked. If they ask about one item, talk about ONLY that item.\n" +
                        "3. ALWAYS show the math. Format: Cost -> Revenue -> Profit.\n" +
                        "4. If cost price is Rs.0 or missing, say: 'Cost price missing for [item]. Enter it to get exact profit target.'\n" +
                        "5. End every response with ONE action the user should take RIGHT NOW.\n" +
                        "6. Max 6 lines per response. Be brutal with brevity.\n\n" +

                        "RESPONSE TEMPLATE (use this structure always):\n" +
                        "**[Item Name] - Profit Analysis**\n" +
                        "- Cost Price: Rs.X per unit\n" +
                        "- Sell Price needed: Rs.Y per unit\n" +
                        "- Units to sell: Z\n" +
                        "- Calculation: Z x (Rs.Y - Rs.X) = Rs.10,000\n" +
                        "-> CA Action: [one sharp recommendation]\n\n" +

                        "EXAMPLE - how to make Rs.10,000 profit on FF:\n" +
                        "**FF - Profit Analysis**\n" +
                        "- Cost Price: Rs.123/unit | Market Price: Rs.234/unit\n" +
                        "- Current margin: Rs.111/unit\n" +
                        "- Units needed at current price: 10,000 / 111 = 91 units\n" +
                        "- You only have 21 units -> max profit at current price = Rs.2,331\n" +
                        "-> CA Action: Raise sell price to Rs.600/unit and sell all 21 units = Rs.9,999 profit.\n\n" +

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
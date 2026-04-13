package com.example.demo;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final ChatClient.Builder builder;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private SellHistoryRepository sellHistoryRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    public ChatController(ChatClient.Builder builder) {
        this.builder = builder;
    }

    @PostMapping("/chat")
    public String handleChat(@RequestBody Map<String, Object> payload) {
        try {
            String userMsg = payload.getOrDefault("message", "Audit portfolio").toString();
            Object rawItems = payload.getOrDefault("items", "[]");
            String safeItems = objectMapper.writeValueAsString(rawItems)
    .replace("{", "(")
    .replace("}", ")")
    .replace("costPrice", "cost_price");

            return builder.build()
                    .prompt()
                    .system(s -> s.text(
                        "You are VaultCA, a friendly financial helper for small business owners.\n\n" +

                        "HOW TO TALK:\n" +
                        "- Talk like you are explaining to a knowledgeable friend. Be direct, concise, and conversational, not a formal report.\n" +
                        "- Keep responses to 4-6 lines maximum for simple profit questions.\n" +
                        "- Use simple words only. No jargon. No complex terms.\n" +
                        "- Always use Rs. for money amounts.\n" +
                        "- Use emojis to make it friendly and easy to read.\n\n" +

                        "STRICT RULES:\n" +
                        "1. ACTION REQUIRED FIRST: When a user asks a profit or calculation question, check if they typed 'Retail', 'Dealer', or 'Wholesale' in their message.\n" +
                        "   - If NO tier is mentioned, YOU MUST ABORT ALL OTHER RULES and respond ONLY with: \"Which price tier are you planning to sell at — Retail (Rs.X), Dealer (Rs.X), or Wholesale (Rs.X)?\" (Replace X with the actual prices of the item).\n" +
                        "   - DO NOT show calculations for all three tiers at once unless explicitly asked for a comparison.\n" +
                        "   - DO NOT list item details. DO NOT mention missing buy prices. DO NOT show math. Just ask the tier question and stop.\n" +
                        "2. ONLY talk about the specific product the user asked about — never list all products unless explicitly asked for an audit.\n" +
                        "3. No bullet point walls, portfolio dumps, or full summaries unless the user asks for a full audit.\n" +
                        "4. If buy price (cost_price) is 0 or missing, say: \"I don't know the buy price of [item]. Please add it first!\" and stop.\n" +
                        "5. ONLY show calculations relevant to the selected price tier.\n" +
                        "6. End with one simple tip the person can do RIGHT NOW.\n\n" +

                        "TARGET RESPONSE STYLE TO AIM FOR:\n" +
                        "\"At Retail price (Rs.150), you make Rs.50 per unit. To hit Rs.10,000 profit you need to sell 200 units. You have 9 in stock — so you're 191 units short. Time to restock.\"\n\n" +

                        "FOR AUDIT REPORT use this format:\n" +
                        "Your Portfolio Summary\n\n" +
                        "For each item:\n" +
                        "[Item Name]: Buy Rs.X | Sell Rs.Y | Stock Z units | Max profit Rs.(Y-X)*Z\n\n" +
                        "Total items: N\n" +
                        "Total stock value: Rs.X\n" +
                        "Total profit if all sold: Rs.Y\n" +
                        "Best earner: [item name]\n" +
                        "Needs attention: [item with missing cost or low stock]\n\n" +

                        "VAULT DATA (this is the user inventory):\n" + safeItems
                    ))
                    .user(userMsg)
                    .call()
                    .content();

        } catch (Exception e) {
            return "Vault Connection Error: " + e.getMessage();
        }
    }
}
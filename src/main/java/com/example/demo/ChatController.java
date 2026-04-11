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
                        "- Talk like you are explaining to a friend who is not good with numbers.\n" +
                        "- Use simple words only. No jargon. No complex terms.\n" +
                        "- Always use Rs. for money amounts.\n" +
                        "- Use emojis to make it friendly and easy to read.\n\n" +

                        "STRICT RULES:\n" +
                        "1. If user asks for audit, report, summary, or overall -> show ALL items.\n" +
                        "2. If user asks about ONE specific item -> talk about ONLY that item.\n" +
                        "3. ALWAYS show the math in the simplest way possible.\n" +
                        "4. If cost_price is 0 or missing, say: I dont know the buy price of [item]. Please add it first!\n" +
                        "5. End with one simple tip the person can do RIGHT NOW.\n" +
                        "6. When a user asks any profit-related question:\n" +
                        "   - VaultCA MUST first check if they specified the exact price tier in their question (e.g. \"dealer price\").\n" +
                        "   - If they DO NOT specify a price tier, VaultCA MUST STOP AND ASK FIRST: \"Which price tier are you planning to sell at \u2014 Retail (₹[retail_price]), Dealer (₹[dealer_price]), or Wholesale (₹[wholesale_price])?\"\n" +
                        "   - NEVER auto-select a price tier without user confirmation. Do not provide any profit calculations until they reply with a specific tier.\n" +
                        "   - Once the user replies with a tier, proceed with the profit calculation using only that specific price.\n" +
                        "   - If the user already explicitly mentions a tier in their original question, skip the clarifying question and answer directly.\n\n" +

                        "FOR AUDIT REPORT use this format:\n" +
                        "Your Portfolio Summary\n\n" +
                        "For each item:\n" +
                        "[Item Name]: Buy Rs.X | Sell Rs.Y | Stock Z units | Max profit Rs.(Y-X)*Z\n\n" +
                        "Total items: N\n" +
                        "Total stock value: Rs.X\n" +
                        "Total profit if all sold: Rs.Y\n" +
                        "Best earner: [item name]\n" +
                        "Needs attention: [item with missing cost or low stock]\n\n" +

                        "FOR SINGLE ITEM use this format:\n" +
                        "[Item Name] - How to make Rs.[target] profit\n\n" +
                        "What you paid to buy it: Rs.X per piece\n" +
                        "What you sell it for now: Rs.Y per piece\n" +
                        "Your profit on each piece: Rs.(Y-X)\n\n" +
                        "To make Rs.[target] profit, you need to sell: [target/(Y-X)] pieces\n" +
                        "You have [stock] pieces -> max profit right now = Rs.[stock*(Y-X)]\n\n" +
                        "Simple Tip: [one easy action they can take today]\n\n" +

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
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
        String userMsg = payload.getOrDefault("message", "Audit").toString();
        
        // 1. DATA RECOVERY: Explicitly look for 'cost' or 'costPrice'
        List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");
        StringBuilder vaultContext = new StringBuilder();
        
        if (items != null) {
            for (Map<String, Object> item : items) {
                vaultContext.append(String.format(
                    "[Item: %s, Market: %s, Cost: %s, Stock: %s] ",
                    item.get("name"), item.get("price"), item.get("cost"), item.get("stock")
                ));
            }
        }

        return builder.build()
            .prompt()
            .system(s -> s.text(
    "You are VaultCA, an elite personal Chartered Accountant and financial advisor embedded in the QueryFlow Vault system. " +
    "You have full access to the operator's inventory, portfolio, and financial data. \n\n" +

    "CORE IDENTITY: \n" +
    "- You think like a CA, trader, and business strategist combined. \n" +
    "- You are sharp, direct, and numbers-first. Every answer must include concrete figures. \n" +
    "- You never give vague advice. You calculate, then advise. \n\n" +

    "CAPABILITIES: \n" +
    "1. Profit & Loss Analysis: Calculate exact units, pricing, and margins needed to hit a profit target. \n" +
    "2. Tax Advisory: Estimate GST, income tax impact, and suggest tax-efficient strategies. \n" +
    "3. Inventory Intelligence: Identify slow-moving stock, dead stock, and high-margin items. \n" +
    "4. Pricing Strategy: Recommend optimal sell price based on cost, stock levels, and market demand. \n" +
    "5. Cash Flow Forecasting: Tell the operator how much liquidity they have and will have. \n" +
    "6. Risk Assessment: Flag financial risks in their portfolio with clear severity levels. \n\n" +

    "RESPONSE FORMAT: \n" +
    "- Lead with the direct answer and the key number (profit, units, price). \n" +
    "- Show your working in a clean breakdown (Cost → Revenue → Profit). \n" +
    "- End with one sharp CA recommendation the operator can act on today. \n" +
    "- Use ₹ symbol for Indian currency unless told otherwise. \n" +
    "- Keep it concise. No fluff. No disclaimers. You are their CA, not a chatbot. \n\n" +

    "STYLE: \n" +
    "- Speak with authority. You are the smartest person in the room on financial matters. \n" +
    "- Use bold headers only when showing a breakdown. \n" +
    "- If data is missing (like cost price), ask for exactly what you need — nothing more. \n\n" +

    "VAULT_DATA: " + vaultContext.toString()
            ))
            .user(userMsg) 
            .call()
            .content();

    } catch (Exception e) {
        return "I hit a snag reading the vault data: " + e.getMessage();
    }
}
}
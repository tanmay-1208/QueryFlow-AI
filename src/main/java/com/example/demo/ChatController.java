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
            String lowerMsg = userMsg.toLowerCase();

            // Product Name Resolution (Exact Case-Insensitive Match)
            Product resolvedProduct = null;
            int maxMatchLength = 0;
            
            // Extract valid product names for the current vault user context from rawItems
            Set<String> validContextNames = new HashSet<>();
            if (rawItems instanceof List) {
                for (Object obj : (List<?>) rawItems) {
                    if (obj instanceof Map) {
                        Object pName = ((Map<?, ?>) obj).get("productName");
                        if (pName != null) {
                            validContextNames.add(pName.toString().toLowerCase());
                        }
                    }
                }
            }

            for (Product p : productRepository.findAll()) {
                if (p.getName() == null) continue;
                String pName = p.getName().toLowerCase();
                
                // Only consider products that exist in the user's current vault payload
                if (!validContextNames.contains(pName)) continue;

                // Exact case-insensitive match (longest match wins to prevent "Test Item" overriding "Test Item 3")
                if (lowerMsg.contains(pName) && pName.length() > maxMatchLength) {
                    resolvedProduct = p;
                    maxMatchLength = pName.length();
                }
            }

            String safeItems;
            boolean isAudit = lowerMsg.contains("audit") || lowerMsg.contains("report") || lowerMsg.contains("summary") || lowerMsg.contains("overall");

            if (resolvedProduct != null && !isAudit) {
                // Log the exact matched product to the backend console
                System.out.println("Resolved Product for VaultCA context: " + resolvedProduct.getName());
                
                Map<String, Object> prodData = new HashMap<>();
                prodData.put("productName", resolvedProduct.getName());
                prodData.put("costPrice", resolvedProduct.getCostPrice() != null ? resolvedProduct.getCostPrice() : 0.0);
                
                Map<String, Double> pGroups = new HashMap<>();
                double retail = 0.0;
                if (resolvedProduct.getPriceGroups() != null && resolvedProduct.getPriceGroups().containsKey(PriceGroup.RETAIL)) {
                    Double rVal = resolvedProduct.getPriceGroups().get(PriceGroup.RETAIL);
                    retail = rVal != null ? rVal : 0.0;
                } else if (resolvedProduct.getPrice() != null) {
                    retail = resolvedProduct.getPrice();
                }
                
                double dealer = resolvedProduct.getPriceGroups() != null && resolvedProduct.getPriceGroups().containsKey(PriceGroup.DEALER) && resolvedProduct.getPriceGroups().get(PriceGroup.DEALER) != null ? resolvedProduct.getPriceGroups().get(PriceGroup.DEALER) : 0.0;
                double wholesale = resolvedProduct.getPriceGroups() != null && resolvedProduct.getPriceGroups().containsKey(PriceGroup.WHOLESALE) && resolvedProduct.getPriceGroups().get(PriceGroup.WHOLESALE) != null ? resolvedProduct.getPriceGroups().get(PriceGroup.WHOLESALE) : 0.0;
                
                pGroups.put("retail", retail);
                pGroups.put("dealer", dealer);
                pGroups.put("wholesale", wholesale);
                
                prodData.put("priceGroups", pGroups);
                prodData.put("stock", resolvedProduct.getStock() != null ? resolvedProduct.getStock() : 0);

                safeItems = objectMapper.writeValueAsString(Collections.singletonList(prodData))
                        .replace("{", "(")
                        .replace("}", ")");
            } else {
                safeItems = objectMapper.writeValueAsString(rawItems)
                        .replace("{", "(")
                        .replace("}", ")")
                        .replace("costPrice", "cost_price");
            }

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
                        "   - If NO tier is mentioned, YOU MUST ABORT ALL OTHER RULES. Find the item in VAULT DATA, check its prices, and respond ONLY with: \"Which price tier are you planning to sell at — Retail (Rs.[retail_price]), Dealer (Rs.[dealer_price]), or Wholesale (Rs.[wholesale_price])?\" replacing the bracket variables with actual numbers from VAULT DATA. NEVER output literal 'Rs.X'.\n" +
                        "   - DO NOT show calculations for all three tiers at once unless explicitly asked for a comparison.\n" +
                        "   - DO NOT list item details. DO NOT mention missing buy prices. DO NOT show math. Just ask the tier question and stop.\n" +
                        "2. ZERO PRICE GUARD: Before calculating profit for a selected price tier, check if that tier's price is Rs.0, null, or missing in the product context. If it is, respond EXACTLY with: \"The [tier name] price hasn't been set for this product yet. Please update it in the inventory first.\" replacing [tier name] with Retail, Dealer, or Wholesale. DO NOT attempt any profit calculation if the selected tier price is zero or missing.\n" +
                        "3. ONLY talk about the specific product the user asked about — never list all products unless explicitly asked for an audit.\n" +
                        "4. No bullet point walls, portfolio dumps, or full summaries unless the user asks for a full audit.\n" +
                        "5. If buy price (cost_price) is 0 or missing, say: \"I don't know the buy price of [item]. Please add it first!\" and stop.\n" +
                        "6. ONLY show calculations relevant to the selected price tier.\n" +
                        "7. PROFIT CALCULATION RULE: Profit per unit MUST always be calculated strictly as: [Selected Tier Price] - [Cost Price]. Ensure you subtract the cost price from the specific target price tier the user asked about. Example: If cost is Rs.100 and user asks for Dealer profit (Rs.120), profit is Rs.20 per unit. Do NOT use the Retail margin.\n" +
                        "8. End with one simple tip the person can do RIGHT NOW.\n\n" +

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
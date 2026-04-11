import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.HashMap;
public class test_json {
    public static void main(String[] args) throws Exception {
        Map<String, Object> item = new HashMap<>();
        item.put("name", "test item 3");
        item.put("price", 150.0);
        item.put("cost_price", 100.0);
        
        ObjectMapper mapper = new ObjectMapper();
        String safeItems = mapper.writeValueAsString(item)
            .replace("{", "(")
            .replace("}", ")")
            .replace("costPrice", "cost_price");
        System.out.println(safeItems);
    }
}

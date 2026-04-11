const fs = require('fs');
const file = '/Users/mac/Downloads/demo/src/main/java/com/example/demo/ChatController.java';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '4. If cost price is 0 or missing, say: I dont know the buy price of [item]. Please add it first!\\n" +',
  '4. If cost_price is 0 or missing, say: I dont know the buy price of [item]. Please add it first!\\n" +'
);

content = content.replace(
  'String safeItems = objectMapper.writeValueAsString(rawItems)\\n    .replace("{", "(")\\n    .replace("}", ")")\\n    .replace("costPrice", "cost_price");',
  'String safeItems = objectMapper.writeValueAsString(rawItems)\\n    .replace("{", "(")\\n    .replace("}", ")")\\n    .replace("costPrice", "cost_price");'
);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched ChatController!");

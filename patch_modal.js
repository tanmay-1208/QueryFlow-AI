const fs = require('fs');
const file = '/Users/mac/Downloads/demo/queryflow-frontend/src/components/AddAssetModal.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('const payload = {\n      name: form.name,\n      cost_price: parseFloat(form.cost_price) || 0,\n      price: parseFloat(form.price) || 0,\n      priceGroups: {\n        RETAIL: parseFloat(form.price) || 0,\n        DEALER: parseFloat(form.dealer_price) || 0,\n        WHOLESALE: parseFloat(form.wholesale_price) || 0\n      },\n      stock: parseInt(form.stock) || 0,\n      category: finalCategory || null,\n      userId: userId,\n      vaultId: vaultId\n    };',
  'const payload = {\n      name: form.name,\n      costPrice: parseFloat(form.cost_price) || 0,\n      cost_price: parseFloat(form.cost_price) || 0,\n      price: parseFloat(form.price) || 0,\n      priceGroups: {\n        RETAIL: parseFloat(form.price) || 0,\n        DEALER: parseFloat(form.dealer_price) || 0,\n        WHOLESALE: par  'const payload = {\n      n || 0\n      },\n      stock: parseInt(form.stock) || 0,\n      category: finalCategory || null,\n      userId: userId,\n      vaultId: vaultId\n    };');
fs.writeFileSync(file, content, 'utf8');
console.log("Patched AddAssetModal.js!");

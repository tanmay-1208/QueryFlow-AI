const fs = require('fs');
const file = '/Users/mac/Downloads/demo/queryflow-frontend/src/components/SellModal.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('${item.priceGroups?.RETAIL ?? item.price}', '${item.priceGroups?.RETAIL ? item.priceGroups.RETAIL : item.price}');
content = content.replace('${item.priceGroups?.DEALER ?? item.price}', '${item.priceGroups?.DEALER ? item.priceGroups.DEALER : item.price}');
content = content.replace('${item.priceGroups?.WHOLESALE ?? item.price}', '${item.priceGroups?.WHOLESALE ? item.priceGroups.WHOLESALE : item.price}');

content = content.replace(
  '  if (item.priceGroups) {\\n    if (selectedTier === "DEALER" && item.priceGroups.DEALER !== undefined) currentPrice = item.priceGroups.DEALER;\\n    else if (selectedTier === "WHOLESALE" && item.priceGroups.WHOLESALE !== undefined) currentPrice = item.priceGroups.WHOLESALE;\\n    else if (item.priceGroups.RETAIL !== undefined) currentPrice = item.priceGroups.RETAIL;\\n  }',
  '  if (item.priceGroups && Object.keys(item.priceGroups).length > 0) {\\n    if (selectedTier === "DEALER" && item.priceGroups.DEALE  '  if (item.priceGroups && Object.keys(it\n   '  if (item.priceGroups && Object.keys(item.priceGroups).length > 0) {\\n    if (selectedTier === "DEALER" && item.priceGroups.DEALE  '  ier  '  if (item.priceGroups && Object.keys(item.priceGroups).length > 0) {\\n    if (selectedTier === "DEALER" && item.priceGroups.DEALE  '  ie.log("Patched SellModal.js!");

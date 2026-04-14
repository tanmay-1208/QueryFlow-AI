const fs = require('fs');
const file = '/Users/mac/Downloads/demo/queryflow-frontend/src/components/InventoryCard.js';
let content = fs.readFileSync(file, 'utf8');

// Ensure Add/Sell buttons are min-h-[44px]
content = content.replace(/py-3/g, 'py-3 min-h-[44px]');

// Fix delete/edit buttons for mobile
content = content.replace(/absolute top-6 right-6 text-gray-700 hover:text-red-500 material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity/g, 'absolute top-4 right-4 md:top-6 md:right-6 w-[44px] h-[44px] flex items-center justify-center text-gray-400 md:text-gray-700 hover:text-red-500 material-symbols-outlined text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10');
content = content.replace(/absolute top-6 right-12 text-gray-700 hover:text-\[\#4182ff\] material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity/g, 'absolute top-4 right-[50px] md:top-6 md:right-12 w-[44px] h-[44px] flex items-center justify-center text-gray-400 md:text-gray-700 hovcontent = content.replace(/absolute top-6 right-12 text-gray-700 hover:text- md:group-hover:ocontent = content.replace(/absolute top-6 Fontcontent = content.replace(/absolute top-gridcontent = content.replace(/absolute top-6 right-12 textmb-6 sm:mb-8');

fs.writeFileSync(file, content);

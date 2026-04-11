const fs = require('fs');
const file = '/Users/mac/Downloads/demo/queryflow-frontend/src/components/InventoryCard.js';
let content = fs.readFileSync(file, 'utf8');

// We will change the "Market Point" to display 3 small points if priceGroups exist
// Wait, the grid has 2 cols: Cost Point and Market Point. We can make the grid have a whole section for Market points.
const oldGrid = `<div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
            <span className="text-[7px] text-gray-500 block uppercase font-black mb-1">Cost Point</span>
            <span className="text-xs font-black text-gray-500 block truncate">
              Rs.{(item.costPrice || item.cost_price || 0).toLocaleString()}
            </span>
          </div>
          <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
            <span className="text-[7px] text-gray-600 block uppercase font-black mb-1">Market Point</span>
            <span className="te            <span cla-whit            <span className="te            <span cla-whit            <span className="te   >
          </div>
        </div>`;

const newGrid = `<div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
            <span className="text-[7px] text-gray-500 block uppercase font-black mb-1">Cost Point</span>
            <span className="tex            <span className="tex            <span className="tex            ri            <span className="tex            <span className="tex            <span className="tex       Na            <span className="tex            <span className="tex            <ssName="text-[7px] text-[#4182ff] block uppercase font-black mb-1">Retail (Market)</span>
                        am                        am                        am                        ic                        am                        am                        am                        ic                           am                        am                        am                        ic                        am                  -w               ti              ms-c                        am                        am        ay-500 uppercase font-black">Dealer</span>
            <span className="text-[9px] font-black text-gray-400">Rs.{(item.priceGroups?.DEALER > 0 ? item.priceGroups.DEALER : item.price || 0).toLocaleString()}</span>
          </div>
          <div className="bg-black/40 p-2 rounded-xl border border-white/5 flex justify-between items-center px-4">
            <span className="text-[7px] text-gray-500 uppercase font-black">Wholesale</span>
            <span className="text-[9px] font-black text-gray-400">Rs.{(item.priceGroups?.WHOLESALE > 0 ? item.priceGroups.WHOLESALE : item.price || 0).toLocaleString()}</span>
          </div>
        </div>`;

content = content.replace(oldGrid, newGrid);
fs.writeFileSync(file, content, 'utf8');
console.log("Patched InventoryCard!");

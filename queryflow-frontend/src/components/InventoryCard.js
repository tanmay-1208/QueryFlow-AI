import React from "react";

/**
 * InventoryCard Component
 * Renders an individual asset's data and stock control buttons.
 * * Props:
 * @param {object} item - The asset data (name, price, cost_price, stock)
 * @param {function} onUpdateStock - The handler to increment/decrement stock
 */
const InventoryCard = ({ item, onUpdateStock }) => {
  // Logic to determine if stock is critically low
  const isLowStock = (Number(item.stock) || 0) <= 5;

  return (
    <div className={`
      bg-[#1c1b1b] p-6 md:p-8 rounded-[2.5rem] border transition-all duration-300 shadow-xl
      ${isLowStock ? 'border-red-500/30 bg-red-500/[0.02]' : 'border-white/5 hover:border-white/10'}
    `}>
      {/* CARD HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div className="max-w-[70%]">
          <h4 className="font-black text-xl md:text-2xl font-['Manrope'] text-white truncate">
            {item.name || "Unnamed Asset"}
          </h4>
          <p className="text-[9px] text-gray-600 uppercase font-black tracking-[0.2em] mt-1">
            SKU: {item.id ? item.id.toString().slice(-6) : 'N/A'}
          </p>
        </div>
        {isLowStock && (
          <span className="text-[9px] bg-red-500/10 text-red-500 font-black px-2 py-1 rounded-lg animate-pulse">
            LOW STOCK
          </span>
        )}
      </div>

      {/* PRICING DATA GRID */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-black/30 p-4 rounded-2xl border border-white/5 group hover:border-[#adc7ff]/30 transition-colors">
          <span className="text-[9px] text-gray-600 block uppercase font-black tracking-widest mb-1">
            Cost Point
          </span>
          <span className="text-lg font-black text-gray-500">
            ${Math.floor(item.cost_price || item.price * 0.7).toLocaleString()}
          </span>
        </div>
        
        <div className="bg-black/30 p-4 rounded-2xl border border-white/5 group hover:border-[#66dd8b]/30 transition-colors">
          <span className="text-[9px] text-gray-600 block uppercase font-black tracking-widest mb-1">
            Market Price
          </span>
          <span className="text-lg font-black text-white">
            ${Math.floor(item.price || 0).toLocaleString()}
          </span>
        </div>

        <div className="bg-black/30 p-4 rounded-2xl border border-white/5 col-span-2 flex justify-between items-center">
          <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest">
            Vaulted Units
          </span>
          <span className={`font-black text-2xl ${isLowStock ? 'text-red-500' : 'text-[#adc7ff]'}`}>
            {item.stock || 0}
          </span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3">
        <button 
          onClick={() => onUpdateStock(item.id, 1)} 
          className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#adc7ff]/10 hover:text-[#adc7ff] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Restock
        </button>
        
        <button 
          onClick={() => onUpdateStock(item.id, -1)} 
          className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">remove</span>
          Mark Sold
        </button>
      </div>
    </div>
  );
};

export default InventoryCard;
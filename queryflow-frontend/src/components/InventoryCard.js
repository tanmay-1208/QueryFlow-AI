import React from "react";

const InventoryCard = ({ item, onUpdateStock }) => {
  const isLowStock = Number(item.stock) <= 5;

  return (
    <div className={`bg-[#1c1b1b] p-8 rounded-[3rem] border transition-all shadow-xl ${isLowStock ? 'border-red-500/20' : 'border-white/5'}`}>
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-black text-2xl font-['Manrope'] text-white truncate">{item.name}</h4>
        {isLowStock && <span className="text-[9px] bg-red-500/10 text-red-500 font-black px-2 py-1 rounded-lg">LOW STOCK</span>}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
          <span className="text-[9px] text-gray-600 block uppercase font-black mb-1">Cost Point</span>
          <span className="text-lg font-black text-gray-400">${Math.floor(item.cost_price || item.price * 0.7).toLocaleString()}</span>
        </div>
        <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
          <span className="text-[9px] text-gray-600 block uppercase font-black mb-1">Market Price</span>
          <span className="text-lg font-black text-white">${Math.floor(item.price).toLocaleString()}</span>
        </div>
        <div className="bg-black/30 p-4 rounded-2xl border border-white/5 col-span-2 flex justify-between items-center">
          <span className="text-[9px] text-gray-600 uppercase font-black">Vaulted Units</span>
          <span className={`font-black text-2xl ${isLowStock ? 'text-red-500' : 'text-[#adc7ff]'}`}>{item.stock}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={() => onUpdateStock(item.id, 1)} className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#adc7ff]/10">Restock</button>
        <button onClick={() => onUpdateStock(item.id, -1)} className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500/10">Mark Sold</button>
      </div>
    </div>
  );
};

export default InventoryCard;
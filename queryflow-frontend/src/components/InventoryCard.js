import React from "react";

const InventoryCard = ({ item, onUpdateStock }) => {
  return (
    <div className="bg-[#131313] p-5 rounded-[2rem] border border-white/5 hover:bg-[#181818] transition-all flex flex-col justify-between">
      <div>
        <h4 className="font-black text-base tracking-tighter mb-4 truncate uppercase border-b border-white/5 pb-2">{item.name}</h4>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-black/30 p-3 rounded-xl border border-white/5">
            <span className="text-[7px] text-gray-500 block uppercase font-black mb-1">Cost</span>
            <span className="text-xs font-black text-gray-400">${(item.cost_price || 0).toLocaleString()}</span>
          </div>
          <div className="bg-black/30 p-3 rounded-xl border border-white/5">
            <span className="text-[7px] text-gray-500 block uppercase font-black mb-1">Market</span>
            <span className="text-xs font-black text-white">${(item.price || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-black/30 px-4 py-2 rounded-xl mb-4 border border-white/5">
        <span className="text-[8px] text-gray-500 font-black uppercase">Units</span>
        <span className="text-lg font-black text-[#4182ff]">{item.stock}</span>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-white/5 text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white/10">Restock</button>
        <button className="flex-1 bg-white/5 text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-500/10">Sold</button>
      </div>
    </div>
  );
};

export default InventoryCard;
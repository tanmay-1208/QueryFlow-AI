import React from "react";

const InventoryCard = ({ item, onUpdateStock }) => {
  return (
    <div className="bg-[#131313] p-6 rounded-[2.5rem] border border-white/5 flex flex-col hover:bg-[#1c1b1b] transition-all shadow-xl">
      <h4 className="font-black text-xl tracking-tighter mb-5 truncate uppercase text-white border-b border-white/5 pb-2">
        {item.name}
      </h4>
      
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
          <span className="text-[7px] text-gray-600 block uppercase font-black mb-1 tracking-widest">Cost Point</span>
          <span className="text-xs font-black text-gray-500 truncate block">
            ${(item.cost_price || 0).toLocaleString()}
          </span>
        </div>
        <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
          <span className="text-[7px] text-gray-600 block uppercase font-black mb-1 tracking-widest">Market Point</span>
          <span className="text-xs font-black text-white truncate block">
            ${(item.price || 0).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center bg-black/40 px-5 py-3 rounded-2xl mb-6 border border-white/5 shadow-inner">
        <span className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">Vaulted</span>
        <span className="text-2xl font-black text-[#4182ff] tracking-tighter">{item.stock}</span>
      </div>

      <div className="flex gap-3">
        <button onClick={() => onUpdateStock(item.id, 1)} className="flex-1 bg-white/5 text-white py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-white/10 active:scale-95 transition-all">Add</button>
        <button onClick={() => onUpdateStock(item.id, -1)} className="flex-1 bg-white/5 text-white py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-red-500/10 hover:text-red-500 active:scale-95 transition-all">Sell</button>
      </div>
    </div>
  );
};

export default InventoryCard;
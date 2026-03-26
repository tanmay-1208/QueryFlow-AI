import React from "react";

const InventoryCard = ({ item, onUpdateStock, onDeleteAsset }) => {
  const isLowStock = (item.stock || 0) <= 5;

  return (
    <div className={`bg-[#131313] p-6 rounded-[2.5rem] border transition-all shadow-xl relative group ${isLowStock ? 'border-red-500/20' : 'border-white/5 hover:bg-[#181818]'}`}>
      
      {/* NEW: DELETE BUTTON */}
      <button 
        onClick={() => onDeleteAsset(item.id)}
        className="absolute top-6 right-6 text-gray-700 hover:text-red-500 material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity"
      >
        delete
      </button>

      <div className="flex justify-between items-start mb-6 pr-8">
        <h4 className="font-black text-lg tracking-tighter truncate uppercase text-white w-full border-b border-white/5 pb-2">
          {item.name}
        </h4>
        {isLowStock && (
          <span className="absolute top-2 left-6 bg-red-500/10 text-red-500 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
            Low Stock
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
          <span className="text-[7px] text-gray-500 block uppercase font-black mb-1">Cost Point</span>
          <span className="text-xs font-black text-gray-500 block truncate">${(item.cost_price || 0).toLocaleString()}</span>
        </div>
        <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
          <span className="text-[7px] text-gray-600 block uppercase font-black mb-1">Market Point</span>
          <span className="text-xs font-black text-white block truncate">${(item.price || 0).toLocaleString()}</span>
        </div>
      </div>

      <div className="flex justify-between items-center bg-black/40 px-5 py-3 rounded-2xl mb-6 border border-white/5">
        <span className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">Vaulted</span>
        <span className={`text-2xl font-black tracking-tighter ${isLowStock ? 'text-red-500' : 'text-[#4182ff]'}`}>
          {item.stock}
        </span>
      </div>

      <div className="flex gap-3">
        <button onClick={() => onUpdateStock(item.id, 1)} className="flex-1 bg-white/5 text-white py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-white/10 transition-all">Add</button>
        <button onClick={() => onUpdateStock(item.id, -1)} className="flex-1 bg-white/5 text-white py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all">Sell</button>
      </div>
    </div>
  );
};

export default InventoryCard;
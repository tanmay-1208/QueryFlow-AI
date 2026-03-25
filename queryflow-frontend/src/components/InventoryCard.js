import React from "react";

const InventoryCard = ({ item, onUpdateStock }) => {
  const isLowStock = (Number(item.stock) || 0) <= 5;

  return (
    <div className="bg-[#1c1b1b] p-8 rounded-[3.5rem] border border-white/5 shadow-2xl transition-all hover:border-white/10 group">
      <div className="flex justify-between items-start mb-8">
        <h4 className="font-black text-4xl tracking-tighter text-white font-['Manrope'] lowercase">
          {item.name}
        </h4>
        {isLowStock && (
          <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            Low Stock
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-black/30 p-6 rounded-[2rem] border border-white/5">
          <span className="text-[9px] text-gray-600 block uppercase font-black tracking-[0.2em] mb-2">Cost Point</span>
          <span className="text-xl font-black text-gray-500 tracking-tighter">
            ${Math.floor(item.cost_price || item.price * 0.7).toLocaleString()}
          </span>
        </div>
        <div className="bg-black/30 p-6 rounded-[2rem] border border-white/5">
          <span className="text-[9px] text-gray-600 block uppercase font-black tracking-[0.2em] mb-2">Market Price</span>
          <span className="text-xl font-black text-white tracking-tighter">
            ${Math.floor(item.price).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="bg-black/30 p-6 rounded-[2.5rem] border border-white/5 mb-8 flex justify-between items-center">
        <span className="text-[10px] text-gray-600 uppercase font-black tracking-[0.3em]">Vaulted Units</span>
        <span className={`text-4xl font-black tracking-tighter ${isLowStock ? 'text-red-500' : 'text-[#4182ff]'}`}>
          {item.stock}
        </span>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => onUpdateStock(item.id, 1)} 
          className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white/10 transition-all"
        >
          Restock
        </button>
        <button 
          onClick={() => onUpdateStock(item.id, -1)} 
          className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-500/10 hover:text-red-500 transition-all"
        >
          Mark Sold
        </button>
      </div>
    </div>
  );
};

export default InventoryCard;
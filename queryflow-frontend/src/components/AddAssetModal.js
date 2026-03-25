import React from "react";

const AddAssetModal = ({ isOpen, onClose, onAdd, newItem, setNewItem }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-[#1c1b1b] w-full max-w-md p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-in zoom-in">
        <h3 className="text-3xl font-black mb-8 text-white font-['Manrope']">Vault New Asset</h3>
        <form onSubmit={onAdd} className="space-y-4">
          <input 
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#4182ff]" 
            placeholder="Asset Name" 
            value={newItem.name}
            onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="number" 
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#4182ff]" 
              placeholder="Cost ($)" 
              value={newItem.cost_price}
              onChange={(e) => setNewItem({...newItem, cost_price: e.target.value})} 
              required 
            />
            <input 
              type="number" 
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#4182ff]" 
              placeholder="Market ($)" 
              value={newItem.market_price}
              onChange={(e) => setNewItem({...newItem, market_price: e.target.value})} 
              required 
            />
          </div>
          <input 
            type="number" 
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#4182ff]" 
            placeholder="Units" 
            value={newItem.stock}
            onChange={(e) => setNewItem({...newItem, stock: e.target.value})} 
            required 
          />
          <div className="flex gap-4 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest">Cancel</button>
            <button type="submit" className="flex-1 bg-[#4182ff] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">Initialize</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
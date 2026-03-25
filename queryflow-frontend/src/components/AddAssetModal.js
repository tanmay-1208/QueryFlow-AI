import React from "react";

/**
 * AddAssetModal Component
 * Handles the UI and Form Logic for vaulting a new asset.
 * * Props:
 * @param {boolean} isOpen - Controls visibility of the modal
 * @param {function} onClose - Function to close the modal
 * @param {function} onAdd - Submit handler (handleAddItem from App.js)
 * @param {object} newItem - The current state of the form inputs
 * @param {function} setNewItem - State setter to update form inputs
 */
const AddAssetModal = ({ isOpen, onClose, onAdd, newItem, setNewItem }) => {
  // If the modal isn't supposed to be open, render nothing.
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#1c1b1b] w-full max-w-md p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-in zoom-in duration-300">
        
        <header className="mb-8">
          <h3 className="text-3xl font-black font-['Manrope'] text-white">Vault Asset</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mt-2">
            Initialize Institutional Ledger Entry
          </p>
        </header>

        <form onSubmit={onAdd} className="space-y-5">
          {/* ASSET NAME */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-gray-500 ml-2 tracking-widest">
              Asset Nomenclature
            </label>
            <input 
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#4182ff] transition-colors" 
              placeholder="e.g. Vintage Rolex" 
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
              required 
            />
          </div>

          {/* PRICING GRID */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-gray-500 ml-2 tracking-widest">
                Cost Point ($)
              </label>
              <input 
                type="number" 
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#4182ff] transition-colors" 
                placeholder="0.00" 
                value={newItem.cost_price}
                onChange={(e) => setNewItem({...newItem, cost_price: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-gray-500 ml-2 tracking-widest">
                Market Price ($)
              </label>
              <input 
                type="number" 
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#4182ff] transition-colors" 
                placeholder="0.00" 
                value={newItem.market_price}
                onChange={(e) => setNewItem({...newItem, market_price: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* QUANTITY */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-gray-500 ml-2 tracking-widest">
              Vaulted Units
            </label>
            <input 
              type="number" 
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#4182ff] transition-colors" 
              placeholder="Quantity" 
              value={newItem.stock}
              onChange={(e) => setNewItem({...newItem, stock: e.target.value})} 
              required 
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 pt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors"
            >
              Abort
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-[#4182ff] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-[#4182ff]/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Initialize Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
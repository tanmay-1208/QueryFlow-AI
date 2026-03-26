import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const AddAssetModal = ({ isOpen, onClose, onAdd, userId }) => {
  const [form, setForm] = useState({ name: "", cost_price: "", price: "", stock: "" });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      name: form.name,
      cost_price: parseFloat(form.cost_price) || 0,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      userId: userId
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/products`, payload);
      if (res.data) {
        onAdd(res.data);
      }
      onClose();
    } catch (err) {
      console.error("Vault Sync Error:", err);
      alert("Terminal Error: Check Railway connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      {/* Modal Container */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-[#0f0f0f] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl transition-all"
      >
        <h2 className="text-white font-black uppercase text-center mb-8 text-xs tracking-[0.4em] italic">
          Execute_Vault_Entry
        </h2>
        
        <div className="space-y-4">
          <input 
            className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold uppercase" 
            placeholder="Asset Name" 
            onChange={e => setForm({...form, name: e.target.value})} 
            required 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input 
              className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold uppercase" 
              placeholder="Buy Price" 
              type="number" 
              onChange={e => setForm({...form, cost_price: e.target.value})} 
              required 
            />
            <input 
              className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold uppercase" 
              placeholder="Sell Price" 
              type="number" 
              onChange={e => setForm({...form, price: e.target.value})} 
              required 
            />
          </div>
          
          <input 
            className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold uppercase" 
            placeholder="Inventory Units" 
            type="number" 
            onChange={e => setForm({...form, stock: e.target.value})} 
            required 
          />
          
          {/* ACTION BUTTONS */}
          <div className="flex gap-4 pt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl font-bold uppercase text-[9px] text-white/30 hover:bg-white/10 hover:text-white transition-all"
            >
              [ Cancel ]
            </button>
            
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-[#4182ff] p-4 rounded-xl font-black uppercase text-[9px] text-white shadow-[0_0_20px_rgba(65,130,255,0.2)] hover:brightness-110 active:scale-95 transition-all"
            >
              {loading ? "Syncing..." : "Execute"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAssetModal;
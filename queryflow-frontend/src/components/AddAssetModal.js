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

    // Ensure the payload keys match the Java Product class exactly
    const payload = {
      name: form.name,
      cost_price: parseFloat(form.cost_price) || 0,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      userId: userId // This must be the UUID string
    };

    try {
      console.log("Vaulting payload:", payload);
      const res = await axios.post(`${API_BASE_URL}/api/products`, payload);
      
      // Pass the saved item back to Vault.js to update the UI
      if (res.data) {
        onAdd(res.data);
      }
      onClose();
    } catch (err) {
      console.error("Vault Error:", err.response?.data || err.message);
      alert("Terminal Sync Error: Check if Railway is awake.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-[#1c1b1b] w-full max-w-md p-10 rounded-[3rem] border border-white/10 shadow-2xl">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 italic text-white text-center">Execute Vault Entry</h2>
        
        <div className="space-y-4">
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase" placeholder="Asset Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          
          <div className="grid grid-cols-2 gap-4">
            <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase" placeholder="Buy Price" type="number" value={form.cost_price} onChange={e => setForm({...form, cost_price: e.target.value})} required />
            <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase" placeholder="Sell Price" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          </div>
          
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase" placeholder="Inventory Units" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
          
          <div className="flex gap-4 pt-6">
            <button type="button" onClick={onClose} className="flex-1 bg-white/5 py-4 rounded-2xl text-[9px] font-black uppercase text-gray-500">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#4182ff] py-4 rounded-2xl text-[11px] font-black uppercase text-white hover:brightness-110 active:scale-95 transition-all">
              {loading ? "Vaulting..." : "Execute"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAssetModal;
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
    console.log("Execute Triggered for ID:", userId);

    try {
      const payload = {
        name: form.name,
        cost_price: Number(form.cost_price),
        price: Number(form.price), // Unified field name
        stock: Number(form.stock),
        userId: userId
      };

      const res = await axios.post(`${API_BASE_URL}/api/products`, payload);
      
      console.log("Vault Success:", res.data);
      onAdd(res.data); // This updates the dashboard immediately
    } catch (err) {
      console.error("Vault Error:", err);
      alert("Terminal Sync Failure: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-[#1c1b1b] w-full max-w-md p-10 rounded-[3.5rem] border border-white/10 shadow-2xl">
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic text-center">Vault New Asset</h3>
        <div className="space-y-4">
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase" placeholder="Asset Name" onChange={e => setForm({...form, name: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase" placeholder="Cost" type="number" onChange={e => setForm({...form, cost_price: e.target.value})} required />
            <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase" placeholder="Market" type="number" onChange={e => setForm({...form, price: e.target.value})} required />
          </div>
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase" placeholder="Stock" type="number" onChange={e => setForm({...form, stock: e.target.value})} required />
          
          <div className="flex gap-4 pt-6">
            <button type="button" onClick={onClose} className="flex-1 bg-white/5 py-4 rounded-2xl text-[9px] font-black uppercase text-gray-500">Cancel</button>
            <button type="submit" className="flex-1 bg-[#4182ff] py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white active:scale-95 transition-all">
              {loading ? "Syncing..." : "Execute"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAssetModal;
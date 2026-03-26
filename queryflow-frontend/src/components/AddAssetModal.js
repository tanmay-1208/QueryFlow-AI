import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const AddAssetModal = ({ isOpen, onClose, onAdd, userId }) => {
  const [form, setForm] = useState({ name: "", cost_price: "", price: "", stock: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/products`, {
        name: form.name,
        cost_price: Number(form.cost_price),
        price: Number(form.price), // backend expects 'price'
        stock: Number(form.stock),
        userId: userId
      });
      // Pass the actual new object from database back to Vault
      onAdd(response.data); 
    } catch (err) {
      alert("Terminal Sync Failed. Check Railway logs.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-[#1c1b1b] w-full max-w-md p-10 rounded-[3rem] border border-white/10 shadow-2xl">
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic">Vault New Asset</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-[11px] font-black uppercase" placeholder="Asset Name" onChange={e => setForm({...form, name: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-[11px] font-black uppercase" placeholder="Cost" type="number" onChange={e => setForm({...form, cost_price: e.target.value})} required />
            <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-[11px] font-black uppercase" placeholder="Market" type="number" onChange={e => setForm({...form, price: e.target.value})} required />
          </div>
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-[11px] font-black uppercase" placeholder="Stock" type="number" onChange={e => setForm({...form, stock: e.target.value})} required />
          <div className="flex gap-4 pt-6">
            <button type="button" onClick={onClose} className="flex-1 bg-white/5 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-500">Cancel</button>
            <button type="submit" className="flex-1 bg-[#4182ff] py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest">Execute</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
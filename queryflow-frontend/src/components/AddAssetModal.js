import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const AddAssetModal = ({ isOpen, onClose, onAdd, userId }) => {
  const [newItem, setNewItem] = useState({ name: "", cost_price: "", price: "", stock: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Logic fix: Ensure numeric conversion and proper field name ('price')
      await axios.post(`${API_BASE_URL}/api/products`, { 
        ...newItem, 
        cost_price: Number(newItem.cost_price),
        price: Number(newItem.price),
        stock: Number(newItem.stock),
        userId 
      });
      onAdd();
    } catch (err) {
      alert("Submission Error. Ensure backend is running.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-[#1c1b1b] w-full max-w-md p-10 rounded-[3.5rem] border border-white/10 shadow-2xl">
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-10 italic">Vault New Asset</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-[10px] font-black uppercase" placeholder="Asset Name" onChange={e => setNewItem({...newItem, name: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-[10px] font-black uppercase" placeholder="Cost" type="number" onChange={e => setNewItem({...newItem, cost_price: e.target.value})} required />
            <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-[10px] font-black uppercase" placeholder="Market" type="number" onChange={e => setNewItem({...newItem, price: e.target.value})} required />
          </div>
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-[10px] font-black uppercase" placeholder="Stock" type="number" onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
          <div className="flex gap-4 pt-6">
            <button type="button" onClick={onClose} className="flex-1 bg-white/5 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest">Cancel</button>
            <button type="submit" className="flex-1 bg-[#4182ff] py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest">Execute</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
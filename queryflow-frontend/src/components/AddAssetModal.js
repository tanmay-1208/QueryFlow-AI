import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const AddAssetModal = ({ isOpen, onClose, onAdd, userId }) => {
  const [form, setForm] = useState({ name: "", cost_price: "", price: "", stock: "" });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      cost_price: parseFloat(form.cost_price),
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      userId: userId // Sent to Java Backend
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/products`, payload);
      onAdd(res.data); // Confirms success and updates UI
      onClose();
    } catch (err) {
      console.error("Execute Failed:", err);
      alert("Failed to sync with Vault. check Railway logs.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 z-50">
      <form onSubmit={handleSubmit} className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/10 w-full max-w-md">
        <h2 className="text-white font-black uppercase text-center mb-8">Execute Entry</h2>
        <div className="space-y-4">
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl text-white outline-none" placeholder="Asset Name" onChange={e => setForm({...form, name: e.target.value})} required />
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl text-white outline-none" placeholder="Cost Price" type="number" onChange={e => setForm({...form, cost_price: e.target.value})} required />
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl text-white outline-none" placeholder="Market Price" type="number" onChange={e => setForm({...form, price: e.target.value})} required />
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl text-white outline-none" placeholder="Units" type="number" onChange={e => setForm({...form, stock: e.target.value})} required />
          <button className="w-full bg-[#4182ff] p-4 rounded-2xl font-black uppercase">Execute</button>
        </div>
      </form>
    </div>
  );
};

export default AddAssetModal;
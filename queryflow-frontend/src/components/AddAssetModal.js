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
      userId: userId // Matches the @JsonProperty in Java
    };

    try {
      console.log("Vaulting Payload:", payload);
      const res = await axios.post(`${API_BASE_URL}/api/products`, payload);
      onAdd(res.data);
      onClose();
    } catch (err) {
      console.error("Sync Error:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100]">
      <form onSubmit={handleSubmit} className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/10 w-full max-w-sm">
        <h2 className="text-white font-black uppercase text-center mb-6">Execute Entry</h2>
        <div className="space-y-3">
          <input className="w-full bg-[#2a2a2a] p-4 rounded-xl text-white outline-none" placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} required />
          <input className="w-full bg-[#2a2a2a] p-4 rounded-xl text-white outline-none" placeholder="Buy Price" type="number" onChange={e => setForm({...form, cost_price: e.target.value})} required />
          <input className="w-full bg-[#2a2a2a] p-4 rounded-xl text-white outline-none" placeholder="Market Price" type="number" onChange={e => setForm({...form, price: e.target.value})} required />
          <input className="w-full bg-[#2a2a2a] p-4 rounded-xl text-white outline-none" placeholder="Units" type="number" onChange={e => setForm({...form, stock: e.target.value})} required />
          <button className="w-full bg-[#4182ff] p-4 rounded-xl font-black uppercase text-white mt-4">Execute</button>
        </div>
      </form>
    </div>
  );
};

export default AddAssetModal;
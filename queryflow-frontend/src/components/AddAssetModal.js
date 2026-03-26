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

    // Payload keys must match Java Product class fields exactly
    const payload = {
      name: form.name,
      cost_price: parseFloat(form.cost_price) || 0,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      userId: userId // This must match the private String userId in Java
    };

    try {
      console.log("Terminal Sync - Sending Payload:", payload);
      const res = await axios.post(`${API_BASE_URL}/api/products`, payload);
      
      if (res.data) {
        onAdd(res.data); // Update the UI immediately
      }
      onClose();
    } catch (err) {
      console.error("Vault Execute Error:", err);
      alert("Failed to sync with Vault. Verify Railway connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-[#1c1b1b] w-full max-w-md p-10 rounded-[3rem] border border-white/10">
        <h2 className="text-xl font-black uppercase text-white mb-8 text-center italic">Execute Entry</h2>
        
        <div className="space-y-4">
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl text-white outline-none font-bold uppercase text-[10px]" placeholder="Asset Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <input className="bg-[#2a2a2a] p-4 rounded-2xl text-white outline-none font-bold uppercase text-[10px]" placeholder="Buy Price" type="number" value={form.cost_price} onChange={e => setForm({...form, cost_price: e.target.value})} required />
            <input className="bg-[#2a2a2a] p-4 rounded-2xl text-white outline-none font-bold uppercase text-[10px]" placeholder="Sell Price" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          </div>
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl text-white outline-none font-bold uppercase text-[10px]" placeholder="Units" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
          
          <button type="submit" disabled={loading} className="w-full bg-[#4182ff] p-4 rounded-2xl font-black uppercase text-white mt-4">
            {loading ? "Syncing..." : "Execute"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAssetModal;
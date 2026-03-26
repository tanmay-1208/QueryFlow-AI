import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const AddAssetModal = ({ isOpen, onClose, onAdd, userId }) => {
  const [form, setForm] = useState({ name: "", cost_price: "", price: "", stock: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Logic fix: Ensure numeric conversion and proper field names
      const payload = {
        name: form.name,
        cost_price: Number(form.cost_price),
        price: Number(form.price), // database expects 'price'
        stock: Number(form.stock),
        userId: userId
      };

      const response = await axios.post(`${API_BASE_URL}/api/products`, payload);
      
      if (response.data) {
        onAdd(response.data); // SUCCESS: Update Vault.js state
      } else {
        throw new Error("Empty Response");
      }
    } catch (err) {
      console.error("Critical Sync Failure:", err);
      // Give the user a fallback option to add it locally if DB is down
      if (window.confirm("Backend unreachable. Add to local terminal session only?")) {
          onAdd({ ...form, id: Date.now() }); 
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-[#1c1b1b] w-full max-w-md p-10 rounded-[3.5rem] border border-white/10 shadow-2xl animate-in zoom-in-95">
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic text-white">Vault New Asset</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-[11px] font-black uppercase text-white" placeholder="Asset Name" onChange={e => setForm({...form, name: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-[11px] font-black uppercase text-white" placeholder="Cost" type="number" onChange={e => setForm({...form, cost_price: e.target.value})} required />
            <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-[11px] font-black uppercase text-white" placeholder="Market" type="number" onChange={e => setForm({...form, price: e.target.value})} required />
          </div>
          <input className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-[11px] font-black uppercase text-white" placeholder="Units" type="number" onChange={e => setForm({...form, stock: e.target.value})} required />
          <div className="flex gap-4 pt-6">
            <button type="button" onClick={onClose} className="flex-1 bg-white/5 py-4 rounded-2xl text-[9px] font-black uppercase text-gray-600">Cancel</button>
            <button type="submit" className="flex-1 bg-[#4182ff] py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white active:scale-95 transition-all">
                {isSubmitting ? 'Syncing...' : 'Execute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
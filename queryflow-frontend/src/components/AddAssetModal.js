import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const AddAssetModal = ({ isOpen, onClose, onAdd, userId }) => {
  const [formData, setFormData] = useState({
    name: "",
    cost_price: "",
    price: "",
    stock: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Construct the payload exactly as the backend expects
    const payload = {
      name: formData.name,
      cost_price: Number(formData.cost_price),
      price: Number(formData.price),
      stock: Number(formData.stock),
      userId: userId
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/products`, payload);
      
      // If the server returns the new object, we pass it to onAdd
      if (response.data) {
        onAdd(response.data); 
        onClose();
        setFormData({ name: "", cost_price: "", price: "", stock: "" });
      }
    } catch (err) {
      console.error("Vaulting Error:", err);
      alert("Protocol Failed: Could not sync with Railway backend.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-[#1c1b1b] w-full max-w-md p-10 rounded-[3.5rem] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 italic text-white">Vault New Asset</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase focus:ring-1 ring-[#4182ff]" 
            placeholder="Asset Name" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase" 
              placeholder="Cost Point" 
              type="number"
              value={formData.cost_price}
              onChange={e => setFormData({...formData, cost_price: e.target.value})} 
              required 
            />
            <input 
              className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase" 
              placeholder="Market Price" 
              type="number"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})} 
              required 
            />
          </div>
          <input 
            className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase" 
            placeholder="Initial Units" 
            type="number"
            value={formData.stock}
            onChange={e => setFormData({...formData, stock: e.target.value})} 
            required 
          />
          <div className="flex gap-4 pt-6">
            <button type="button" onClick={onClose} className="flex-1 bg-white/5 text-gray-500 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest">Cancel</button>
            <button type="submit" className="flex-1 bg-[#4182ff] text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">Execute</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
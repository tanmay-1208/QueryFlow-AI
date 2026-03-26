import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const AddAssetModal = ({ isOpen, onClose, onAdd, userId }) => {
  const [form, setForm] = useState({ name: "", cost_price: "", price: "", stock: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If modal isn't open, don't render anything
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    // 1. STOP the page from reloading
    e.preventDefault(); 
    
    // 2. DEBUG: This MUST show up in console now
    console.log("EXECUTE CLICKED. Payload:", { ...form, userId });

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name,
        cost_price: Number(form.cost_price),
        price: Number(form.price),
        stock: Number(form.stock),
        userId: userId
      };

      const res = await axios.post(`${API_BASE_URL}/api/products`, payload);
      
      console.log("SERVER RESPONSE:", res.data);
      
      // Success: Tell Vault.js to update the UI
      onAdd(res.data); 
      onClose();
    } catch (err) {
      console.error("VAULTING ERROR:", err);
      
      // FALLBACK: If the server is offline, we force it into the UI locally
      if (window.confirm("Backend unreachable. Add to local session only?")) {
        onAdd({ 
          ...form, 
          id: Date.now(), 
          cost_price: Number(form.cost_price), 
          price: Number(form.price), 
          stock: Number(form.stock) 
        }); 
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
      {/* 3. FORM WRAPPER: Must have onSubmit */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-[#1c1b1b] w-full max-w-md p-10 rounded-[3rem] border border-white/10 shadow-2xl"
      >
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic text-white text-center">
          Vault Asset
        </h3>
        
        <div className="space-y-4">
          <input 
            className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase" 
            placeholder="Asset Name" 
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} 
            required 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input 
              className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase" 
              placeholder="Cost" 
              type="number"
              value={form.cost_price}
              onChange={e => setForm({...form, cost_price: e.target.value})} 
              required 
            />
            <input 
              className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase" 
              placeholder="Market" 
              type="number"
              value={form.price}
              onChange={e => setForm({...form, price: e.target.value})} 
              required 
            />
          </div>
          
          <input 
            className="w-full bg-[#2a2a2a] p-4 rounded-2xl border-none outline-none text-white text-[11px] font-black uppercase" 
            placeholder="Units" 
            type="number"
            value={form.stock}
            onChange={e => setForm({...form, stock: e.target.value})} 
            required 
          />
          
          <div className="flex gap-4 pt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-white/5 py-4 rounded-2xl text-[9px] font-black uppercase text-gray-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
            
            {/* 4. THE EXECUTE BUTTON: Must be type="submit" */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-[#4182ff] py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white active:scale-95 transition-all"
            >
              {isSubmitting ? "Syncing..." : "Execute"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAssetModal;
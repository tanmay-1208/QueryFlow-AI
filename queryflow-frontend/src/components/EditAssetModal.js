import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const EditAssetModal = ({ isOpen, onClose, onUpdate, item }) => {
  const [form, setForm] = useState({ name: "", cost_price: "", price: "", stock: "" });
  const [loading, setLoading] = useState(false);

  // Pre-fill form when item changes
  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || "",
        cost_price: item.costPrice || item.cost_price || "",
        price: item.price || "",
        stock: item.stock || ""
      });
    }
  }, [item]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...item,
      name: form.name,
      costPrice: parseFloat(form.cost_price) || 0,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
    };

    try {
      const res = await axios.put(`${API_BASE_URL}/api/products/${item.id}`, payload);
      if (res.data) {
        onUpdate(res.data);
      }
      onClose();
    } catch (err) {
      console.error("Edit Error:", err);
      alert("Terminal Error: Could not update asset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0f0f0f] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl transition-all"
      >
        <h2 className="text-white font-black uppercase text-center mb-2 text-xs tracking-[0.4em] italic">
          Modify_Vault_Entry
        </h2>
        <p className="text-white/20 text-[9px] text-center uppercase tracking-widest mb-8">
          Editing: {item?.name}
        </p>

        <div className="space-y-4">
          <input
            className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold uppercase"
            placeholder="Asset Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold uppercase"
              placeholder="Buy Price"
              type="number"
              value={form.cost_price}
              onChange={e => setForm({ ...form, cost_price: e.target.value })}
              required
            />
            <input
              className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold uppercase"
              placeholder="Sell Price"
              type="number"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>

          <input
            className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold uppercase"
            placeholder="Inventory Units"
            type="number"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
            required
          />

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl font-bold uppercase text-[9px] text-white/30 hover:bg-white/10 hover:text-white transition-all"
            >
              [ Cancel ]
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#4182ff] p-4 rounded-xl font-black uppercase text-[9px] text-white shadow-[0_0_20px_rgba(65,130,255,0.2)] hover:brightness-110 active:scale-95 transition-all"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditAssetModal;
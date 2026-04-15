import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://tanmaysingh12r-queryflow-ai.hf.space";

const PRESET_CATEGORIES = [
  "Electronics", "Clothing", "Food & Beverage", "Furniture",
  "Jewellery", "Automotive", "Health & Beauty", "Sports",
  "Books & Stationery", "Tools & Hardware", "Toys", "Other"
];

const EditAssetModal = ({ isOpen, onClose, onUpdate, item }) => {
  const [form, setForm] = useState({ name: "", cost_price: "", price: "", dealer_price: "", wholesale_price: "", stock: "", category: "" });
  const [customCategory, setCustomCategory] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      const isPreset = PRESET_CATEGORIES.includes(item.category);
      setForm({
        name: item.name || "",
        cost_price: item.cost_price || item.costPrice || "",
        price: item.priceGroups?.RETAIL > 0 ? item.priceGroups.RETAIL : item.price || "",
        dealer_price: item.priceGroups?.DEALER || "",
        wholesale_price: item.priceGroups?.WHOLESALE || "",
        stock: item.stock || "",
        category: isPreset ? item.category : ""
      });
      setIsCustom(!isPreset && !!item.category);
      setCustomCategory(!isPreset ? item.category || "" : "");
    }
  }, [item]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalCategory = isCustom ? customCategory : form.category;

    const payload = {
      id: item.id,
      name: form.name,
      cost_price: parseFloat(form.cost_price) || 0,
      price: parseFloat(form.price) || 0,
      priceGroups: {
        RETAIL: parseFloat(form.price) || 0,
        DEALER: parseFloat(form.dealer_price) || 0,
        WHOLESALE: parseFloat(form.wholesale_price) || 0
      },
      stock: parseInt(form.stock) || 0,
      category: finalCategory || null,
      userId: item.userId,
    };

    try {
      const res = await axios.put(`${API_BASE_URL}/api/products/${item.id}`, payload);
      if (res.data) onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error("Edit Error:", err);
      alert("Terminal Error: Could not update asset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#080A0F]/95 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0D1117] border border-[#C9A84C]/20 p-6 md:p-10 rounded-2xl w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent"></div>
        <h2 className="text-[#C9A84C] font-syne font-bold uppercase text-center mb-2 text-sm tracking-[0.3em]">
          Modify_Vault_Entry
        </h2>
        <p className="text-white/20 text-[14px] md:text-[9px] text-center uppercase tracking-widest mb-8 font-dm">
          Editing: {item?.name}
        </p>

        <div className="space-y-4">
          <input
            className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-4 rounded-xl text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-dm uppercase shadow-inner placeholder:text-[#C9A84C]/30"
            placeholder="Asset Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-bold uppercase"
              placeholder="Buy Price"
              type="number"
              value={form.cost_price}
              onChange={e => setForm({ ...form, cost_price: e.target.value })}
              required
            />
            <input
              className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-bold uppercase"
              placeholder="Retail Price"
              type="number"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              required
            />
            <input
              className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-bold uppercase"
              placeholder="Dealer Price"
              type="number"
              value={form.dealer_price}
              onChange={e => setForm({ ...form, dealer_price: e.target.value })}
              required
            />
            <input
              className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-bold uppercase"
              placeholder="Wholesale Price"
              type="number"
              value={form.wholesale_price}
              onChange={e => setForm({ ...form, wholesale_price: e.target.value })}
              required
            />
          </div>

          <input
            className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-4 rounded-xl text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-dm uppercase shadow-inner placeholder:text-[#C9A84C]/30"
            placeholder="Inventory Units"
            type="number"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
            required
          />

          {/* CATEGORY SELECTOR */}
          {!isCustom ? (
            <div className="flex gap-2">
              <select
                className="flex-1 bg-[#080A0F] border border-[#C9A84C]/20 p-4 rounded-xl text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-dm uppercase shadow-inner"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ background: '#080A0F' }}
              >
                <option value="">Select Category</option>
                {PRESET_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className="bg-transparent border border-[#C9A84C]/20 px-4 rounded-xl text-[#C9A84C]/60 hover:text-[#C9A84C] text-[14px] md:text-[9px] font-syne font-bold uppercase transition-all"
              >
                Custom
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                className="flex-1 bg-[#080A0F] border border-[#C9A84C]/20 p-4 rounded-xl text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-dm uppercase shadow-inner placeholder:text-[#C9A84C]/30"
                placeholder="Type custom category..."
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setIsCustom(false)}
                className="bg-transparent border border-[#C9A84C]/20 px-4 rounded-xl text-[#C9A84C]/60 hover:text-[#C9A84C] text-[14px] md:text-[9px] font-syne font-bold uppercase transition-all"
              >
                Preset
              </button>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-transparent border border-white/10 p-4 rounded-xl font-syne font-bold uppercase text-[14px] md:text-[10px] tracking-[0.2em] text-white/40 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#C9A84C] p-4 rounded-xl font-syne font-bold uppercase text-[14px] md:text-[10px] tracking-[0.2em] text-[#080A0F] shadow-[0_0_15px_rgba(201,168,76,0.3)] hover:brightness-110 active:scale-95 transition-all duration-200 disabled:opacity-50"
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

//extro
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://tanmaysingh12r-queryflow-ai.hf.space";

const SellModal = ({ isOpen, onClose, item, userId, onSellComplete, customers = [] }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState("RETAIL");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  useEffect(() => {
    if (item && !selectedCustomerId) {
      const retailPrice = item.priceGroups?.RETAIL || item.price || 0;
      const dealerPrice = item.priceGroups?.DEALER || 0;
      const wholesalePrice = item.priceGroups?.WHOLESALE || 0;
      
      if (retailPrice > 0) setSelectedTier("RETAIL");
      else if (dealerPrice > 0) setSelectedTier("DEALER");
      else if (wholesalePrice > 0) setSelectedTier("WHOLESALE");
    }
  }, [item, selectedCustomerId]);
  
  useEffect(() => {
    if (!isOpen) { 
      setSelectedCustomerId("");
      setQuantity(1);
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const costPrice = item.costPrice || item.cost_price || 0;
  
  const retailPrice = item.priceGroups?.RETAIL || item.price || 0;
  const dealerPrice = item.priceGroups?.DEALER || 0;
  const wholesalePrice = item.priceGroups?.WHOLESALE || 0;

  const pricing = {
    RETAIL: retailPrice,
    DEALER: dealerPrice,
    WHOLESALE: wholesalePrice
  };

  const currentPrice = pricing[selectedTier] || 0;

  const profitPerUnit = currentPrice - costPrice;
  const totalProfit = profitPerUnit * quantity;
  const totalRevenue = currentPrice * quantity;

  const handleSell = async () => {
    if (quantity <= 0 || quantity > item.stock) return;
    setLoading(true);
    try {
      const payload = {
        productId: item.id,
        userId: userId,
        quantity: quantity,
        vaultId: item.vaultId,
        sellPrice: currentPrice,
        priceGroup: selectedTier
      };

      if (selectedCustomerId) {
        payload.customerId = selectedCustomerId;
        const cust = customers.find(c => String(c.id) === String(selectedCustomerId));
        if (cust) {
          payload.customerName = cust.name;
        }
      }

      const res = await axios.post(`${API_BASE_URL}/api/sell`, payload);
      onSellComplete(res.data);
      onClose();
    } catch (err) {
      console.error("Sell Error:", err);
      alert("Terminal Error: Could not process sale.");
    } finally {
      setLoading(false);
    }
  };

  const renderTierButton = (tier, price, label) => {
    const disabled = price <= 0;
    const isActive = selectedTier === tier;
    return (
      <button
        type="button"
        title={disabled ? "Price not set" : `Sell at ${label} price`}
        disabled={disabled}
        onClick={() => setSelectedTier(tier)}
        className={`p-3 rounded-xl border text-center transition-all duration-200 ${
          disabled 
            ? 'bg-transparent border-white/5 text-white/10 cursor-not-allowed' 
            : isActive 
              ? 'bg-[#C9A84C]/5 border-[#C9A84C] text-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.1)]' 
              : 'bg-transparent border-[#C9A84C]/20 text-white/40 hover:border-[#C9A84C]/50 hover:text-white cursor-pointer'
        }`}
      >
        <p className="text-[14px] md:text-[10px] font-syne font-bold tracking-widest">[ {label}: ₹{price} ]</p>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#080A0F]/95 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <div className="bg-[#0D1117] border border-[#C9A84C]/20 p-6 md:p-10 rounded-2xl w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent"></div>

        <h2 className="text-[#C9A84C] font-syne font-bold uppercase text-center mb-2 text-sm tracking-[0.3em]">
          Execute_Sale
        </h2>
        <p className="text-white/20 text-[14px] md:text-[9px] text-center uppercase tracking-widest mb-6 font-dm">
          Selling: {item?.name}
        </p>

        {/* CUSTOMER SELECTOR */}
        <div className="mb-6">
          <p className="text-[14px] md:text-[8px] text-white/30 uppercase font-black mb-2 tracking-widest flex justify-between">
            <span>Customer (Optional)</span>
          </p>
          <select
            value={selectedCustomerId}
            onChange={(e) => {
              const cid = e.target.value;
              setSelectedCustomerId(cid);
              if (cid !== "") {
                const cust = customers.find(c => String(c.id) === String(cid));
                if (cust && cust.priceGroup) {
                  setSelectedTier(cust.priceGroup);
                }
              }
            }}
            className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-4 rounded-xl text-[#C9A84C] font-dm text-sm outline-none focus:border-[#C9A84C] shadow-inner transition-all appearance-none cursor-pointer"
          >
            <option value="">-- None --</option>
            {customers.map((c, i) => (
              <option key={i} value={c.id}>
                {c.name} ({c.phone || 'No Contact'})
              </option>
            ))}
          </select>
        </div>

        {/* PRICE TIERS */}
        <div className="flex flex-col gap-2 mb-6">
          {renderTierButton("RETAIL", retailPrice, "RETAIL")}
          {renderTierButton("DEALER", dealerPrice, "DEALER")}
          {renderTierButton("WHOLESALE", wholesalePrice, "WHOLESALE")}
        </div>

        {/* QUANTITY INPUT */}
        <div className="mb-6">
          <p className="text-[14px] md:text-[8px] text-white/30 uppercase font-black mb-3 tracking-widest">Quantity to Sell</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-12 h-12 bg-[#080A0F] border border-[#C9A84C]/20 rounded-xl text-[#C9A84C] font-dm text-lg hover:bg-[#C9A84C]/10 transition-all"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={item.stock}
              value={quantity}
              onChange={e => setQuantity(Math.min(item.stock, Math.max(1, parseInt(e.target.value) || 1)))}
              className="flex-1 bg-[#080A0F] border border-[#C9A84C]/20 p-4 rounded-xl text-[#C9A84C] text-center font-dm text-lg outline-none focus:border-[#C9A84C] shadow-inner transition-all"
            />
            <button
              onClick={() => setQuantity(q => Math.min(item.stock, q + 1))}
              className="w-12 h-12 bg-[#080A0F] border border-[#C9A84C]/20 rounded-xl text-[#C9A84C] font-dm text-lg hover:bg-[#C9A84C]/10 transition-all"
            >
              +
            </button>
          </div>
          <p className="text-[14px] md:text-[8px] text-white/20 uppercase font-black mt-2 text-center">
            {item.stock} units available
          </p>
        </div>

        {/* TOTAL SUMMARY */}
        <div className="bg-black/60 p-5 rounded-2xl border border-white/5 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[14px] md:text-[9px] text-white/30 uppercase font-black">Total Revenue</span>
            <span className="text-[14px] md:text-[11px] font-black text-white">₹{totalRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] md:text-[9px] text-white/30 uppercase font-black">Total Profit</span>
            <span className={`text-[14px] md:text-[11px] font-black ${totalProfit >= 0 ? 'text-[#2ECC8A]' : 'text-[#E05555]'}`}>
              ₹{totalProfit.toFixed(2)}
            </span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-transparent border border-white/10 p-4 rounded-xl font-syne font-bold uppercase text-[14px] md:text-[10px] tracking-[0.2em] text-white/40 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSell}
            disabled={loading || quantity > item.stock || currentPrice <= 0}
            className="flex-1 bg-[#C9A84C] p-4 rounded-xl font-syne font-bold uppercase text-[14px] md:text-[10px] tracking-[0.2em] text-[#080A0F] shadow-[0_0_15px_rgba(201,168,76,0.3)] hover:brightness-110 active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Processing..." : `Sell ${quantity}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellModal;

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://tanmaysingh12r-queryflow-ai.hf.space";

const SellModal = ({ isOpen, onClose, item, userId, onSellComplete }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState("RETAIL");

  useEffect(() => {
    if (item) {
      const retailPrice = item.priceGroups?.RETAIL || item.price || 0;
      const dealerPrice = item.priceGroups?.DEALER || 0;
      const wholesalePrice = item.priceGroups?.WHOLESALE || 0;
      
      if (retailPrice > 0) setSelectedTier("RETAIL");
      else if (dealerPrice > 0) setSelectedTier("DEALER");
      else if (wholesalePrice > 0) setSelectedTier("WHOLESALE");
    }
  }, [item]);

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
      const res = await axios.post(`${API_BASE_URL}/api/sell`, {
        productId: item.id,
        userId: userId,
        quantity: quantity,
        vaultId: item.vaultId,
        sellPrice: currentPrice,
        priceGroup: selectedTier
      });
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
        className={`p-3 rounded-2xl border text-center transition-all ${
          disabled 
            ? 'bg-black/20 border-white/5 text-white/10 cursor-not-allowed' 
            : isActive 
              ? 'bg-[#4182ff]/20 border-[#4182ff] text-white' 
              : 'bg-black/40 border-white/5 text-white/40 hover:bg-white/5 cursor-pointer'
        }`}
      >
        <p className="text-[14px] md:text-[10px] font-black tracking-widest">[ {label}: ₹{price} ]</p>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <div className="bg-[#0f0f0f] border border-white/10 p-6 md:p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl">

        <h2 className="text-white font-black uppercase text-center mb-2 text-xs tracking-[0.4em] italic">
          Execute_Sale
        </h2>
        <p className="text-white/20 text-[14px] md:text-[9px] text-center uppercase tracking-widest mb-8">
          Selling: {item?.name}
        </p>

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
              className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-white font-black text-lg hover:bg-white/10 transition-all"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={item.stock}
              value={quantity}
              onChange={e => setQuantity(Math.min(item.stock, Math.max(1, parseInt(e.target.value) || 1)))}
              className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl text-white text-center font-black text-lg outline-none focus:border-[#4182ff] transition-all"
            />
            <button
              onClick={() => setQuantity(q => Math.min(item.stock, q + 1))}
              className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-white font-black text-lg hover:bg-white/10 transition-all"
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
            <span className={`text-[14px] md:text-[11px] font-black ${totalProfit >= 0 ? 'text-[#00ff88]' : 'text-red-500'}`}>
              ₹{totalProfit.toFixed(2)}
            </span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl font-bold uppercase text-[14px] md:text-[9px] text-white/30 hover:bg-white/10 hover:text-white transition-all"
          >
            [ Cancel ]
          </button>
          <button
            onClick={handleSell}
            disabled={loading || quantity > item.stock || currentPrice <= 0}
            className="flex-1 bg-[#00ff88] p-4 rounded-xl font-black uppercase text-[14px] md:text-[9px] text-black shadow-[0_0_20px_rgba(0,255,136,0.2)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : `Sell ${quantity} Units`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellModal;

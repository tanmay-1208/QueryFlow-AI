cat << 'INNER_EOF' > queryflow-frontend/src/components/SellModal.js
import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const SellModal = ({ isOpen, onClose, item, userId, onSellComplete }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState("RETAIL");

  if (!isOpen || !item) return null;

  const costPrice = item.costPrice || item.cost_price || 0;
  
  // Resolve current selected price
  let currentPrice = item.price;
  if (item.priceGroups) {
    if (selectedTier === "DEALER" && item.priceGroups.DEALER !== undefined) currentPrice = item.priceGroups.DEALER;
    else if (selectedTier === "WHOLESALE" && item.priceGroups.WHOLESALE !== undefined) currentPrice = item.priceGroups.WHOLESALE;
    else if (item.priceGroups.RETAIL !== undefined) currentPrice = item.priceGroups.RETAIL;
  }

  const profitPerUnit = currentPrice - costPrice;
  const totalProfit = profitPerUnit * quantity;
  const totalRevenue = currentPrice * quantity;

  co  co  co  co  co  co  co) => {
    if (quantity <= 0 || quantity > item.stock) return;
    setLoadin    setLoadin    setLoadin    setLoadin    setLoadin    setLoadin    s/api/sell`, {
        productId: item.id,
        userId: userId,
        quantity: quantity,
        vaultId: item.vaultId,
        sellPrice: currentPrice,
        priceGroup: selectedTier
      });
                                                          ch (er                                 ror:", err);
      alert("Terminal Error: Could not process sale.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <div className="bg-[#0f0f0f] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl">

        <h2 className="text-white font-black upperca        <h2 className="text-white font-black uppli        <h2 className="text-white font-black u          <h2 className="text-white font-black-cent        <h2 className="textt mb-8">        <h2 className="text-white font-black upp       {/* PRICE TIERS */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button 
                                                       tSelectedTier("RETAIL")}
                                ded-2xl border text-center transition-all ${selectedTier === 'RETAIL' ? 'bg-[#4182ff]/20 border-[#4182ff] text-white' : 'bg-black/40 border-white/5 text-white/40 hover:bg-white/5'}`}
          >
            <p className="text-[7px] uppercase font-black mb-1">Retail</p>
            <p classNam   tex         -black">${item.priceGroups?.RETAIL ?? item.price}</p>
          </button>
          <button 
            type="button"
            onClick={() => setSelectedTier("DEALER")}
            className={`p-3 rounded-2xl border text-center transition-all ${selectedTier === 'DEALER' ? 'bg-[#4182ff]/20 border-[#4182ff] text-white' : 'bg-black/40 border-white/5 text-white/40 hover:bg-white/5'}`}
          >
            <p className="text-[7px] uppercase font-black mb-1">Dealer</p>
            <p className="text-xs font-black">${item.priceGroups?.DEALER ?? item.price}</p>
          </button>
          <button 
            type="button"
            onClick={() => setSelectedTier("WHOLESAL            onClick={() => setSelectedTier("WHOLESAL            onClick={() => setSelectedTier("WHOLESAL            onClick={() => setSelectedTier("WHOLESAL            onClick={() => setSelectedTier("WHOLESAL    hit     `}
          >
            <p className="text-[7px] uppercase font-black mb-1">Wholesale</p>
            <p className="text-xs font-black">${item.priceGroups?.WHOLESALE ?? item.price}</p>
          </button>
        </div>

        {/* PROFIT PREVIEW */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-black/40 p-3 rounded-2xl border border-white/5 text-center">
            <p className="text-[7px] text-gray-500 uppercase font-black mb-1">Sell Price</p>
            <p className="text-xs font-black text-white">${currentPrice}</p>
          </div>
          <div className="bg-black/40 p-3 rounded-2xl border border-white/5 text-center">
            <p className="text-[7px] text-gray-500 uppercase font-black mb-1">Cost Price</p>
            <p className="text-xs font-black text-gray-400">${costPrice}</p>
          </div>
          <div className="bg-black/40 p-3 rounded-2xl border border-white/5 text-center">
            <p className="text-[7px] text-gray-500 uppercase font-black mb-1">Per Unit</p>
            <p className={`text-xs font-black ${profitPerUnit >= 0 ? 'text-[#00ff88]' : 'text-red-500'}`}>
              ${profitPerUnit.toFixed(2)}
            </p>
          </div>
        </div>

        {/* QUANTITY INPUT */}
        <div className="mb-6">
          <p className="text-[8px] text-white/30 uppercase font-black mb-3 tracking-widest">Quantity to Sell</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-12 h-12 bg-white/5 border               className="w-12 h-12 bg-white/5 border               className="w-12 h-12ll"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={item.stock}
              val              v             onChange={e => setQuantity(Math.min(item.stock, Math.max(1, parseInt(e.target.value) || 1)))}
              className="flex-1 bg-white/5 border border-white/10 p-4 rounde              className="flex-1 bg-white/5 border border-white/10 p-4 rounde              className="flex      />
            <button
              o              set           => Mat             ock              o           lassName="w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-white font-black text-lg hover:bg-white/10 transition-all"
            >
              +
            </button>
          </div>
                    me="text-[8px] text-white/20 uppercase font-black mt-2 text-center">
                                 ailable
          </p>
        </div>

        {/* TOTAL SUMMARY */}
        <div className="bg-black/60 p-5 rounded-2xl border border-white/5 mb-8">
          <div          <divex justify-between items-center m          <div      pa          <div          <divewhite/30 uppercase font-black">Total Revenue</span>
            <span className="text-[11px] font-black text-white">${totalRevenue.toFixed(2)            <span className="text-[11px] font-black text-white">${totalRevenue.toFixed(2)            <span className="text-[11px] font-black text-white">${totalRevenue.toFixed(2)                      n classNam            <span className="text-[11px] font-black text-white">${totalRevenue.toFixed(2)            <span className="text-[11px] font-black text-white">${totalRevenue.toFixed(2)            <span className="text-[1v className="flex ga            <s  <button
            on            on 
            className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl font-bold uppercase text-[9px] text-white/30 hover:bg-white/10 hover:text-white transition-all"
          >
            [ Cancel ]
          </button>
          <button
            onClick={handl            onClick={handl            onClick={handl            onClick={handl            onClick={handl            onClick={handl            onClick={handl      k shadow-[0_0_20px_rgba(0,255,136,0.2)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : `Sell ${quantity} Units`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellModal;
INNER_EOF

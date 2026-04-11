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

  const profitPerUnit = currentPrice - cos  const profitPerUnit = currentPrice - cos  const profitPerUnit = ta  const profitPerUnit = currentPrice - co  const profitPerUnit = c => {
    if (quantity <= 0 || quantity > item.stock) return;
    setLoadin    setLoadin    setLoadin    setLoadin    setLoadin    setLoadin    setLi/    setLoadin    setLoadin    setLoad        userId: userId,
        quantity: quantity,
                                                                        priceGroup: selectedTier
      });
      onSellComplete(res.data);
      onClose();
    } catch (er    } catch (er    } catc"Sell Error    } catch (er    } catch inal E    } catch (er    } catsa    } catch (er    } catch (er    } catc"Sell Error    } catch (er    } catch inal E    } catch (er    } catsa    90    } catch (er    } catch (er    } catc"Sell Error    } catch (er    } catch inal E    } catch (er    } catsa    } catch (er   ro    } catch (er    } catch (er    } catc"Sell Error    } catch (er    } catch inal E    } uppercase text-center mb-2 text-xs tracking-[0.4em] italic">
          Execute_Sale
        </h2>
        <p className="text-white/20 text-[9px] text-center uppercase tracking-widest mb-8">        <p className="text-white/20 text-[9px] text-ce {        <p className="text-white/20 text-[9px] text-center uppercase tracking-widest mb-8">        <p className="text-white/20 text-[9px] text-ce {tS        <p className="text         className={`p-3 rounded-2xl border text-center transition-all ${selectedTier === 'RETAIL'      -[#41        <p className="text-whi-w        <p clasck/40 border-white/5 text-white/40 hover:bg-white/5'}`}
          >
            <p className="text-[7px] uppercase font-black mb-1">Retail</p>
            <p className="text-xs font-black">${item.priceGroups?.RETAIL ?? item.price}</p>
          </button>
          <button 
            type="button"
            onClick={() => setSelectedTier("DEALER")}
            className={`p-3 rounded-2xl border text-center transition-all ${selectedTier === 'DEALER' ? 'bg-[#4182ff]/20 border-[#4182ff] text-white' : 'bg            classNamee/      -white/4            className={`p-3 rounded-2xl border text-center transition-all ${selectedTier === 'DEALER' ? 'bg-[#4182ff]/20 border-[#4182ff] text-white' : 'bg            classNamee/      -white/4            className={`p-3 rounded-2xl border text-center transition-all ${selectedTier === 'DEALER' ? 'bg-[#4182ff]/20 border-[#4182ff] text-white' : 'bg            classNamee/      -white/4            className={`p-3 rounded-2xl border text-center transition-all ${selectedTier === 'DEALER' ? 'bg-[#4182ff]/20 border-[#4182ff] text-whiteite/5'}`}
          >
            <p className="text-[7px] uppercase font-black mb-1">Wholesale</p>
            <p className="text-xs font-black">${item.priceGroups?.WHOLESALE ?? item.price}</p>
          </button>
        </div>

        {/* PRO        {/* PRO        {/* PRO        {/* PRO      ols        {/* PRO        {/* PRO        {/* PRO        {/* PRO      ols        {/* PRO        {/* PRO        {/* PRO        {/* PRO      ols        {/* PRO        {/* PRO        {/* PRO        {/* PRO      ols        {/* PRO        {/* PRO        {/* PRO        {/* PRO      ols        {/* PRO        {/* PRO        {/* PRO        {/* PRO      ols        {/* PRO        {/* PRO        {/* PRO        {/* PRO      ols        {/* PRO        {/* PRO        {/* PRO        {/* PRO      ols        {/* PRO        {/* PRO        {/* PRO        {/* PRO      ols        {/* PRO        {/* PRO        {/* PRO        {/* PRO      ols        {/* PRO        {/* PRO        {/* PRO        {/* PRO      ols        {/* PRO        {/* PRO      black mb      r Unit</p>
            <p className={`text-xs font-black ${profitPerUnit >= 0 ? 'tex            <p className={`text-xs font-black ${profitPerUnit >= 0 ? 'tex            <p class              <p cla     </div>

        {/* QUANTITY INPUT */}
        <div className="mb-6">
          <p className="text-[8px] text-white/30 uppercase font-black mb-3 tracking-widest">Quantity to Sell</p>
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
              onClick={() => setQuantity(q => Math.min(item.stock              onClick={() =>ssN              onClick={() => der border-white/10 rounded-xl text-white font-black text-lg hover:bg-white/10 transition-all"
            >
              +
            </button>
          </div>
          <p className=          <p className=          <p className=          <p classN
            {item.stock} units available
          </p>
        </div>

        {/* TOTAL SUMMARY */}
        <div className="bg-black/60 p-5 rou        <divder border-white/5 mb-8">
          <div className="flex ju          <dn items-center mb-2">
            <spa            <spa        text-white/30 uppercase font-black">To            <spa            <spa        text-white/30 uppercase font-black">To            <spa            2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-white/30 uppercase font-black">Total Profit</span>
            <span className={`text-[11px] font-black ${totalProfit >= 0 ? 'text-[#00ff88]' : 'text-red-500'}`}>
              ${totalProfit.toFixed(2)}
            </span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl font-bold uppercase text-[9px] text-white/30 hover:bg-white/10 hover:text-white transition-all"
          >
            [ Cancel ]
          </button>
          <button
            onClick={handleSell}
            disabled={loading || quantity > item.stock}
            className="flex-1 bg-[#00ff88] p-4 rounded-xl font-black uppercase text-[9px] text-black shadow-[0_0_20px_rgba(0,255,136,0.2)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
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

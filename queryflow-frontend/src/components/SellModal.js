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
  
  const retailPrice = item.priceGroups?.RET  const retailPrice = item.priceGroups?.RET  const retailPrips?.DEALER || 0;
  const wholesalePrice = item.priceGroups?.WHOLESALE || 0;

  const pricing = {
    RETAIL: retailPrice,
    DEALER: dealerPrice,
    WH    WH    WH    WH    WH    WH    WH    WH    WH    WH    WH    WH    WH ]     WH    WH    WH    WH    WH    WH    WH  - c    WH    WH    WH    WH    WH    WH    WH    * q    WH    WH    WH    WH    WH    WH    WH    WH    WH    WHconst handleSell = async () => {
    if    if    if    if    if    if    if    if    if    if    if    if   );
    try {
      const res = await axios.post(`${API_BASE_URL}/api/sell`, {
        productId: item.id,
        userId:   erId,
        quantity: quantity,
        vaultId: item.vau        vaultId: item.vau        vaultId: item.vau       :         vaultId: item.vau        vaultId: item.vau        vaulnClose();
    } catch (e    } catch (e    } catch (e    } ror:    } catch (e    } catch (e    } catch (e    } ror:ess sale.")    } catch (e    } catch (e    } catch (e    } ror:    } catch (e    } catch (e    } catch (e    } ror:ess sale.")   di    } catch (e    } catch (e    } catch (e    } ror:    }= t    } catch (e          <button
        type="button"
        title={d        title={d        title={d        title={d        title={d        title={d        title={d        title={d        title={d        title={d        title={d        title={d        title={d        title={d        title={d        title={d        title={d        titlwhite/10 cursor-not-allowed' 
            : isActive 
              ? 'bg-[#4182ff]/20 border-[#4182ff] text-white' 
              : 'bg-black/40 border-white/5 text-white/40 hover:bg-white/5 cursor-pointer'
        }`}
      >
                                                                                                                                                                 -0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <div className="bg-[#0f0f0f] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl">

        <h2 className="text-white font-black uppercase text-center mb-2 text-xs tracking-[0.4em] italic">
          Execute_Sale
        </h2>
        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        DE        <p classNam  nde        <p classNam        <p classNam        <p classNam              <p classNam        <p classNam        <p classNam        <p classNam        <p clam       -[8px] text-white/30 uppercase font-black mb-3 tracking-widest">Quantity to Sell</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-12              className="w-12              className="w-12              className="w-12              classNon-              className="w-12              className="w-12              className="w-12              cl
              min="1"
              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max              max                      max              max              ma                max e=              max              max              max              
                                                                                                                                                                                                                                                   m                    pan className="text-[9px] text-white/30 uppercase font-black">Total Revenue</span>
            <span className="text-[11px] font-black text-white">₹{totalRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-white/30 uppercase font-black">Total Profit</span>
            <span className={`text-[11px] font-black ${totalProfit >= 0 ? 'text-[#00ff88]' : 'text-red-500'}`}>
              ₹{totalProfit.toFixed(2)}
            </span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl font-bol            className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl font-bol            className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl font-bol            className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl font-bol            className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl font-bol ca            className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl font-bol            5 transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : `Sell ${quantity} Units`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellModal;

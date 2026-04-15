import React, { useState } from "react";
import EditAssetModal from "./EditAssetModal";
import SellModal from "./SellModal";
import { ScaleIn } from "./AnimatedPage";

const InventoryCard = ({ item, onUpdateStock, onDeleteAsset, onEditAsset, onSellComplete, userId }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const isLowStock = (item.stock || 0) <= 5;

  return (
    <ScaleIn>
      <div className={`bg-[#0D1117] p-6 rounded-[2.5rem] border transition-all shadow-xl relative group ${isLowStock ? 'border-[#E05555]/20' : 'border-white/5 hover:bg-transparent'}`}>

        <button
          onClick={() => onDeleteAsset(item.id)}
          className="absolute top-4 right-4 md:top-6 md:right-6 w-[44px] h-[44px] flex items-center justify-center text-gray-400 md:text-gray-700 hover:text-[#E05555] material-symbols-outlined text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
        >
          delete
        </button>

        <button
          onClick={() => setIsEditOpen(true)}
          className="absolute top-4 right-[50px] md:top-6 md:right-12 w-[44px] h-[44px] flex items-center justify-center text-gray-400 md:text-gray-700 hover:text-[#C9A84C] material-symbols-outlined text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
        >
          edit
        </button>

        <div className="flex justify-between items-start mb-6 pr-16">
          <div className="w-full">
            <h4 className="font-black text-lg tracking-tighter truncate uppercase text-white w-full border-b border-white/5 pb-2">
              {item.name}
            </h4>
            {item.category && (
              <span className="inline-block mt-2 bg-[#C9A84C]/10 text-[#C9A84C] text-[14px] md:text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-[#C9A84C]/20">
                {item.category}
              </span>
            )}
          </div>
          {isLowStock && (
            <span className="absolute top-2 left-6 bg-[#E05555]/10 text-[#E05555] text-[14px] md:text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
              Low Stock
            </span>
          )}
        </div>

        <div className="mb-6 space-y-2">
          {/* Top Row: Cost Point */}
          <div className="bg-[#0D1117]/80 border border-[#C9A84C]/15 p-3 rounded-2xl border border-white/5">
            <span className="text-[14px] md:text-[7px] text-gray-500 block uppercase font-black mb-1">Cost Point</span>
            <span className="text-xs font-black text-gray-500 block truncate">
              Rs.{(item.costPrice || item.cost_price || 0).toLocaleString()}
            </span>
          </div>
          
          {/* Bottom Row: 3 Price Tiers */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#0D1117]/80 border border-[#C9A84C]/15 p-2 rounded-xl border border-white/5 flex flex-col items-start px-3">
              <span className="text-[14px] md:text-[6px] text-[#C9A84C] uppercase font-black mb-1 opacity-80">Retail</span>
              <span className="text-[14px] md:text-[10px] font-black text-white truncate">
                Rs.{(item.priceGroups?.RETAIL > 0 ? item.priceGroups.RETAIL : item.price || 0).toLocaleString()}
              </span>
            </div>
            <div className="bg-[#0D1117]/80 border border-[#C9A84C]/15 p-2 rounded-xl border border-white/5 flex flex-col items-start px-3">
              <span className="text-[14px] md:text-[6px] text-purple-400 uppercase font-black mb-1 opacity-80">Dealer</span>
              <span className="text-[14px] md:text-[10px] font-black text-white truncate">
                Rs.{(item.priceGroups?.DEALER || 0).toLocaleString()}
              </span>
            </div>
            <div className="bg-[#0D1117]/80 border border-[#C9A84C]/15 p-2 rounded-xl border border-white/5 flex flex-col items-start px-3">
              <span className="text-[14px] md:text-[6px] text-emerald-400 uppercase font-black mb-1 opacity-80">Wholesale</span>
              <span className="text-[14px] md:text-[10px] font-black text-white truncate">
                Rs.{(item.priceGroups?.WHOLESALE || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-[#0D1117]/80 border border-[#C9A84C]/15 px-5 py-3 min-h-[44px] rounded-2xl mb-6 border border-white/5">
          <span className="text-[14px] md:text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">Vaulted</span>
          <span className={`text-2xl font-black tracking-tighter ${isLowStock ? 'text-[#E05555]' : 'text-[#C9A84C]'}`}>
            {item.stock}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onUpdateStock(item.id, 1)}
            className="flex-1 bg-white/5 text-white py-3 min-h-[44px] rounded-xl font-black uppercase text-[14px] md:text-[9px] tracking-widest hover:bg-white/10 transition-all"
          >
            Add
          </button>
          <button
            onClick={() => setIsSellOpen(true)}
            className="flex-1 bg-white/5 text-white py-3 min-h-[44px] rounded-xl font-black uppercase text-[14px] md:text-[9px] tracking-widest hover:bg-[#2ECC8A]/10 hover:text-[#2ECC8A] transition-all"
          >
            Sell
          </button>
        </div>
      </div>

      <EditAssetModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdate={(updated) => {
          onEditAsset(updated);
          setIsEditOpen(false);
        }}
        item={item}
      />

      <SellModal
        isOpen={isSellOpen}
        onClose={() => setIsSellOpen(false)}
        item={item}
        userId={userId}
        onSellComplete={onSellComplete}
      />
    </ScaleIn>
  );
};

export default InventoryCard;
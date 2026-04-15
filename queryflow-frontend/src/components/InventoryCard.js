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
      <div className={`bg-[#0D1117] p-6 rounded-2xl border border-[#C9A84C]/15 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative group hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(201,168,76,0.15)] hover:border-t-[2px] hover:border-[#C9A84C]`}>

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

        <div className="flex justify-between items-start mb-6 pr-16 relative">
          <div className="w-full">
            <h4 className="font-syne font-bold text-lg tracking-widest truncate uppercase text-white w-full pb-2">
              {item.name}
            </h4>
            {item.category && (
              <span className="inline-block mt-2 bg-[#C9A84C]/10 text-[#C9A84C] text-[14px] md:text-[8px] font-bold px-3 py-1 rounded-sm uppercase tracking-widest">
                {item.category}
              </span>
            )}
          </div>
          {isLowStock && (
             <span className="absolute top-0 right-0 bg-[#E05555]/10 text-[#E05555] text-[14px] md:text-[7px] font-bold px-3 py-1 rounded-full uppercase tracking-widest animate-pulse shadow-[0_0_10px_rgba(224,85,85,0.2)] border border-[#E05555]/30">
              Low Stock
            </span>
          )}
        </div>

        <div className="mb-6 space-y-2">
          {/* Top Row: Cost Point */}
          <div className="bg-transparent border-b border-[#C9A84C]/10 pb-2">
            <span className="text-[14px] md:text-[8px] text-[#6a7382] block uppercase tracking-[0.2em] mb-1 font-syne">Cost Point</span>
            <span className="text-sm font-dm text-[#4A9EFF] block truncate">
              Rs.{(item.costPrice || item.cost_price || 0).toLocaleString()}
            </span>
          </div>
          
          {/* Bottom Row: 3 Price Tiers */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="flex flex-col items-start">
              <span className="text-[14px] md:text-[8px] text-[#4A9EFF] font-syne uppercase tracking-widest mb-1">Retail</span>
              <span className="text-[14px] md:text-[11px] font-dm text-white truncate">
                Rs.{(item.priceGroups?.RETAIL > 0 ? item.priceGroups.RETAIL : item.price || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[14px] md:text-[8px] text-[#C9A84C] font-syne uppercase tracking-widest mb-1">Dealer</span>
              <span className="text-[14px] md:text-[11px] font-dm text-white truncate">
                Rs.{(item.priceGroups?.DEALER || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[14px] md:text-[8px] text-[#6a7382] font-syne uppercase tracking-widest mb-1">Wholesale</span>
              <span className="text-[14px] md:text-[11px] font-dm text-white truncate">
                Rs.{(item.priceGroups?.WHOLESALE || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-[#C9A84C]/10 pt-4 mt-6 mb-6">
          <span className="text-[14px] md:text-[10px] text-[#C9A84C]/50 font-syne font-bold uppercase tracking-[0.3em]">Vaulted</span>
          <span className={`text-3xl font-dm ${isLowStock ? 'text-[#E05555]' : 'text-[#C9A84C]'}`}>
            {item.stock}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onUpdateStock(item.id, 1)}
            className="flex-1 bg-transparent border border-[#4A9EFF]/30 text-[#4A9EFF] py-3 min-h-[44px] rounded-xl font-syne font-bold uppercase text-[14px] md:text-[10px] tracking-[0.2em] hover:bg-[#4A9EFF]/10 hover:border-[#4A9EFF] transition-all duration-200"
          >
            Add
          </button>
          <button
            onClick={() => setIsSellOpen(true)}
            className="flex-1 bg-transparent border border-[#C9A84C]/30 text-[#C9A84C] py-3 min-h-[44px] rounded-xl font-syne font-bold uppercase text-[14px] md:text-[10px] tracking-[0.2em] hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all duration-200"
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
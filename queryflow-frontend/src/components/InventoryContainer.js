import React from "react";
import InventoryCard from "./InventoryCard";

const InventoryContainer = ({ items = [], searchTerm = "", onUpdateStock, onDeleteAsset, onEditAsset }) => {
  
  // 1. CRITICAL SAFETY: Ensure items is always an array
  // This prevents the "items.filter is not a function" error
  const safeItems = Array.isArray(items) ? items : [];

  // 2. SAFE FILTERING: Check if item and item.name exist before calling toLowerCase
  const filteredItems = safeItems.filter((item) => {
    if (!item || !item.name) return false;
    return item.name.toLowerCase().includes((searchTerm || "").toLowerCase());
  });

  return (
    <div className="animate-in fade-in duration-500">
      {/* 3. EMPTY STATE: Show a message if no items are found instead of a blank screen */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#131313] rounded-[3rem] border border-white/5 border-dashed">
          <span className="material-symbols-outlined text-gray-800 text-5xl mb-4">inventory_2</span>
          <p className="text-gray-600 font-black text-[10px] uppercase tracking-[0.3em]">
            No Active Assets Found in Vault
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <InventoryCard
               key={item.id || Math.random()}
  item={item}
  onUpdateStock={onUpdateStock}
  onDeleteAsset={onDeleteAsset}
  onEditAsset={onEditAsset}
/>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryContainer;
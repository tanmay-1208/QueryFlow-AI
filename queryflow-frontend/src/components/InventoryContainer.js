import React from "react";
import InventoryCard from "./InventoryCard";
import { StaggerContainer, StaggerItem } from "./AnimatedPage";

const InventoryContainer = ({ items = [], searchTerm = "", onUpdateStock, onDeleteAsset, onEditAsset, onSellComplete, userId }) => {

  const safeItems = Array.isArray(items) ? items : [];

  const filteredItems = safeItems.filter((item) => {
    if (!item || !item.name) return false;
    return item.name.toLowerCase().includes((searchTerm || "").toLowerCase());
  });

  return (
    <div className="animate-in fade-in duration-500">
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0D1117] rounded-[3rem] border border-white/5 border-dashed">
          <span className="material-symbols-outlined text-gray-800 text-3xl md:text-5xl mb-4">inventory_2</span>
          <p className="text-gray-600 font-black text-[14px] md:text-[10px] uppercase tracking-[0.3em]">
            No Active Assets Found in Vault
          </p>
        </div>
      ) : (
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <StaggerItem key={item.id || Math.random()}>
                <InventoryCard
                  item={item}
                  userId={userId}
                  onUpdateStock={onUpdateStock}
                  onDeleteAsset={onDeleteAsset}
                  onEditAsset={onEditAsset}
                  onSellComplete={onSellComplete}
                />
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      )}
    </div>
  );
};

export default InventoryContainer;
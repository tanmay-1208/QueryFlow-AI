import React from "react";
import InventoryCard from "./InventoryCard";

const InventoryContainer = ({ items, searchTerm, onUpdateStock }) => {
  const filtered = items.filter(i => (i.name || "").toLowerCase().includes(searchTerm.toLowerCase()));

  if (items.length === 0) return <div className="text-center py-20 text-gray-700 text-[10px] font-black uppercase tracking-[0.4em]">Vault is Empty</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in">
      {filtered.map(item => (
        <InventoryCard key={item.id} item={item} onUpdateStock={onUpdateStock} />
      ))}
    </div>
  );
};

export default InventoryContainer;
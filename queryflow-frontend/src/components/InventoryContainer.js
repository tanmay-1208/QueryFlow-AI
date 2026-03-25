import React from "react";
import InventoryCard from "./InventoryCard";

const InventoryContainer = ({ items, searchTerm, onUpdateStock }) => {
  const filteredItems = items.filter(i => 
    (i.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in">
      {filteredItems.map(item => (
        <InventoryCard 
          key={item.id} 
          item={item} 
          onUpdateStock={onUpdateStock} 
        />
      ))}
    </div>
  );
};

export default InventoryContainer;
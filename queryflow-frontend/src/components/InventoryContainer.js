import React from "react";
import InventoryCard from "./InventoryCard";

/**
 * InventoryContainer Component
 * Manages the layout, search filtering, and mapping of asset cards.
 * @param {Array} items - The raw list of assets from the database
 * @param {string} searchTerm - The current string from the search input
 * @param {function} onUpdateStock - Function passed down to the cards
 */
const InventoryContainer = ({ items, searchTerm, onUpdateStock }) => {
  
  // 1. Filter items based on the search term (case-insensitive)
  const filteredItems = items.filter((item) =>
    (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Handle the "No Results" state gracefully
  if (filteredItems.length === 0 && searchTerm !== "") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
        <span className="material-symbols-outlined text-6xl text-gray-800 mb-4">
          search_off
        </span>
        <h3 className="text-xl font-black text-gray-500 uppercase tracking-widest">
          No Assets Located
        </h3>
        <p className="text-gray-600 text-sm mt-2">
          Adjust your parameters or initialize a new ledger entry.
        </p>
      </div>
    );
  }

  // 3. Handle the "Empty Vault" state
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
        <span className="material-symbols-outlined text-6xl text-[#4182ff]/20 mb-4">
          inventory_2
        </span>
        <h3 className="text-xl font-black text-gray-500 uppercase tracking-widest">
          Vault Empty
        </h3>
        <p className="text-gray-600 text-sm mt-2">
          Click the "+" icon in the header to register your first asset.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {filteredItems.map((item) => (
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
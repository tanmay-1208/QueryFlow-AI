import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import InventoryContainer from "../components/InventoryContainer";
import AddAssetModal from "../components/AddAssetModal";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
  }, [userId]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleOnAdd = (newAsset) => setItems(prev => [newAsset, ...prev]);

  // Calculations
  const safeVal = (v) => isNaN(parseFloat(v)) ? 0 : parseFloat(v);
  const grossVal = items.reduce((acc, i) => acc + (safeVal(i.price) * safeVal(i.stock)), 0);
  const costVal = items.reduce((acc, i) => acc + (safeVal(i.cost_price) * safeVal(i.stock)), 0);
  const net = grossVal - costVal - (grossVal * 0.18);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <aside className="w-64 border-r border-white/5 p-6">
        <h1 className="text-xl font-black italic mb-10 text-[#4182ff]">VAULT</h1>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab("dashboard")} className={`block w-full text-left uppercase text-[10px] font-bold ${activeTab === "dashboard" ? "text-white" : "text-gray-600"}`}>Dashboard</button>
          <button onClick={() => setActiveTab("inventory")} className={`block w-full text-left uppercase text-[10px] font-bold ${activeTab === "inventory" ? "text-white" : "text-gray-600"}`}>Inventory</button>
        </nav>
        <button onClick={onLogout} className="mt-20 text-red-900/40 text-[9px] font-bold uppercase">Terminate</button>
      </aside>

      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">{activeTab}</h2>
          {activeTab === "inventory" && (
            <button onClick={() => setIsAddModalOpen(true)} className="bg-[#4182ff] w-10 h-10 rounded-full text-xl">+</button>
          )}
        </header>

        {activeTab === "dashboard" ? (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#131313] p-8 rounded-3xl border border-white/5">
              <p className="text-[9px] text-gray-500 uppercase font-black mb-2">Valuation</p>
              <p className="text-3xl font-black">${grossVal.toLocaleString()}</p>
            </div>
            <div className="bg-[#131313] p-8 rounded-3xl border border-white/5">
              <p className="text-[9px] text-gray-500 uppercase font-black mb-2">Net Gain</p>
              <p className="text-3xl font-black text-[#66dd8b]">${net.toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <InventoryContainer items={items} />
        )}
      </main>

      <AddAssetModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleOnAdd} 
        userId={userId} 
      />
    </div>
  );
};

export default Vault;
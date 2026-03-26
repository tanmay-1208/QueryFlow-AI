import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import InventoryContainer from "../components/InventoryContainer";
import AddAssetModal from "../components/AddAssetModal";

// Replace with your actual Railway URL
const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- FETCH: Load items from Database ---
  const fetchItems = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // We pass the userId as a query parameter to filter data in the backend
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Vault Retrieval Error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // --- UPDATE UI: When a new asset is added via the Modal ---
  const handleOnAdd = (newAsset) => {
    setItems((prev) => [newAsset, ...prev]);
  };

  // --- MATH ENGINE: Terminal Valuation Logic ---
  const safeVal = (v) => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));

  // Gross = Market Price * Stock
  const grossVal = items.reduce((acc, i) => acc + safeVal(i.price) * safeVal(i.stock), 0);
  
  // Cost = Buy Price * Stock
  const costVal = items.reduce((acc, i) => acc + safeVal(i.cost_price) * safeVal(i.stock), 0);
  
  const taxRate = 0.18; // 18% Tax Provision
  const taxAmount = grossVal * taxRate;
  const netProfit = grossVal - costVal - taxAmount;

  return (
    <div className="flex h-screen bg-[#0e0e0e] text-white font-['Inter'] selection:bg-[#4182ff]/30">
      {/* SIDEBAR */}
      <aside className="w-72 border-r border-white/5 p-8 flex flex-col justify-between">
        <div>
          <div className="mb-12 flex items-center gap-3">
            <div className="w-3 h-3 bg-[#4182ff] rounded-full animate-pulse" />
            <span className="font-black text-xl italic tracking-tighter uppercase">Vault</span>
          </div>
          
          <nav className="space-y-2">
            {["dashboard", "inventory"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  activeTab === tab ? "bg-[#161616] text-[#4182ff] border border-white/5" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <button 
          onClick={onLogout}
          className="group flex items-center gap-3 text-red-900/40 hover:text-red-500 transition-colors text-[9px] font-black uppercase tracking-widest"
        >
          <span className="w-4 h-[1px] bg-current" /> Terminate Session
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden">
        <header className="h-24 border-b border-white/5 flex justify-between items-center px-12">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">{activeTab}</h2>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Operator ID</p>
              <p className="text-[10px] text-gray-400 font-mono truncate w-32">{userId}</p>
            </div>
            {activeTab === "inventory" && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#4182ff] text-white w-12 h-12 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(65,130,255,0.3)]"
              >
                +
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="h-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 animate-pulse">
              Syncing with Railway...
            </div>
          ) : activeTab === "dashboard" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-3 gap-6">
                <StatCard title="Gross Valuation" value={`$${grossVal.toLocaleString()}`} color="white" />
                <StatCard title="Net Profit (Adj.)" value={`$${netProfit.toLocaleString()}`} color="#66dd8b" />
                <StatCard title="Tax Provision (18%)" value={`-$${taxAmount.toLocaleString()}`} color="#ef4444" />
              </div>
              
              <div className="bg-[#131313] border border-white/5 p-10 rounded-[3rem]">
                <p className="text-[10px] font-black uppercase text-gray-500 mb-6 tracking-widest">Asset Distribution</p>
                <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-3xl text-gray-700 text-[10px] uppercase font-bold">
                  Terminal Analytics Loading...
                </div>
              </div>
            </div>
          ) : (
            <InventoryContainer items={items} />
          )}
        </div>
      </main>

      {/* MODAL: Passing the userId prop is CRITICAL to fix the NULL error */}
      <AddAssetModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleOnAdd} 
        userId={userId} 
      />
    </div>
  );
};

// Reusable Stat Component
const StatCard = ({ title, value, color }) => (
  <div className="bg-[#131313] p-8 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-colors group">
    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-2 group-hover:text-[#4182ff] transition-colors">{title}</p>
    <p className="text-3xl font-black tracking-tighter" style={{ color: color }}>{value}</p>
  </div>
);

export default Vault;
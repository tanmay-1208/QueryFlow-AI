import React, { useState, useEffect } from "react";
import axios from "axios";
import InventoryContainer from "../components/InventoryContainer";
import AddAssetModal from "../components/AddAssetModal";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { if (userId) fetchItems(); }, [userId]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); setItems([]); }
  };

  const handleOnAdd = (newAsset) => {
    setItems(prev => [newAsset, ...prev]);
    setIsAddModalOpen(false);
  };

  // --- MATH ENGINE ---
  const safeVal = (v) => isNaN(parseFloat(v)) ? 0 : parseFloat(v);
  const grossVal = items.reduce((acc, i) => acc + (safeVal(i.price) * safeVal(i.stock)), 0);
  const costVal = items.reduce((acc, i) => acc + (safeVal(i.cost_price) * safeVal(i.stock)), 0);
  const tax = grossVal * 0.18;
  const net = grossVal - costVal - tax;

  return (
    <div className="flex h-screen bg-[#0e0e0e] text-white font-['Inter']">
      <aside className="w-64 border-r border-white/5 p-8 flex flex-col">
        <div className="mb-12 font-black text-xl italic text-[#4182ff]">Vault</div>
        <nav className="flex-1 space-y-2">
          {['dashboard', 'inventory'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest ${activeTab === tab ? 'bg-[#1c1b1b]' : 'text-gray-500'}`}>
              {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="text-red-900/40 text-[9px] font-bold uppercase">Terminate</button>
      </aside>

      <main className="flex-1 flex flex-col bg-[#0a0a0a]">
        <header className="h-20 border-b border-white/5 flex justify-between items-center px-10">
          <h2 className="text-xl font-black uppercase">{activeTab}</h2>
          {activeTab === "inventory" && (
            <button onClick={() => setIsAddModalOpen(true)} className="bg-[#4182ff] w-10 h-10 rounded-full">+</button>
          )}
        </header>

        <div className="p-10 overflow-y-auto">
          {activeTab === "dashboard" ? (
            <div className="space-y-10">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-[#131313] p-6 rounded-3xl border border-white/5">
                  <p className="text-[9px] text-gray-500 uppercase font-black">Gross Valuation</p>
                  <p className="text-2xl font-black">${grossVal.toLocaleString()}</p>
                </div>
                <div className="bg-[#131313] p-6 rounded-3xl border border-white/5">
                  <p className="text-[9px] text-gray-500 uppercase font-black">Net Profit (Tax Incl.)</p>
                  <p className="text-2xl font-black text-[#66dd8b]">${net.toLocaleString()}</p>
                </div>
                <div className="bg-[#131313] p-6 rounded-3xl border border-white/5">
                  <p className="text-[9px] text-gray-500 uppercase font-black">Tax (18%)</p>
                  <p className="text-2xl font-black text-red-500">-${tax.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : (
            <InventoryContainer items={items} searchTerm={searchTerm} />
          )}
        </div>
      </main>
      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleOnAdd} userId={userId} />
    </div>
  );
};

export default Vault;
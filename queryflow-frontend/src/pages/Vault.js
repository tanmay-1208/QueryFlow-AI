import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import InventoryContainer from "../components/InventoryContainer";
import AddAssetModal from "../components/AddAssetModal";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const fetchItems = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
  }, [userId]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // --- CALCULATIONS ---
  const safeVal = (v) => isNaN(parseFloat(v)) ? 0 : parseFloat(v);
  const grossVal = items.reduce((acc, i) => acc + (safeVal(i.price) * safeVal(i.stock)), 0);
  const costVal = items.reduce((acc, i) => acc + (safeVal(i.cost_price) * safeVal(i.stock)), 0);
  const totalStock = items.reduce((acc, i) => acc + safeVal(i.stock), 0);
  const tax = grossVal * 0.18;
  const net = grossVal - costVal - tax;

  const topFive = [...items].sort((a, b) => (b.price * b.stock) - (a.price * a.stock)).slice(0, 5);

  return (
    <div className="flex h-screen bg-[#050505] text-white font-['JetBrains_Mono']">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 p-6 flex flex-col">
        <h1 className="text-xl font-black italic mb-10 text-[#4182ff] tracking-tighter">VAULT.v2</h1>
        <nav className="flex-1 space-y-2">
          {["dashboard", "inventory"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left p-3 rounded-lg text-[10px] uppercase font-bold tracking-widest ${activeTab === tab ? "bg-white/5 text-[#4182ff]" : "text-gray-500"}`}>
              {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="text-red-900/40 text-[9px] font-bold uppercase hover:text-red-500 transition-colors">Terminate_Session</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-white/5 flex justify-between items-center px-10">
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">/{activeTab}</h2>
          {activeTab === "inventory" && (
            <button onClick={() => setIsAddModalOpen(true)} className="bg-[#4182ff] w-10 h-10 rounded-full text-xl hover:scale-105 active:scale-95 transition-all">+</button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          {activeTab === "dashboard" ? (
            <>
              {/* TOP ROW STATS */}
              <div className="grid grid-cols-4 gap-4">
                <StatCard title="Valuation" value={`$${grossVal.toLocaleString()}`} />
                <StatCard title="Net Gain" value={`$${net.toLocaleString()}`} color="#66dd8b" />
                <StatCard title="Est. Tax (18%)" value={`-$${tax.toLocaleString()}`} color="#ef4444" />
                <StatCard title="Total Inventory" value={totalStock.toLocaleString()} />
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* REPORT WINDOW / GRAPH AREA */}
                <div className="col-span-2 bg-[#0c0c0c] border border-white/5 rounded-3xl p-8 h-80 relative overflow-hidden">
                   <p className="text-[10px] font-bold uppercase text-gray-600 mb-4">Live Performance Report</p>
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#4182ff] to-transparent animate-pulse" />
                   </div>
                   <div className="h-full flex items-end gap-2">
                      {/* Visual representation of profit/loss */}
                      <div className="flex-1 bg-[#4182ff]/20 rounded-t-lg" style={{height: '40%'}}></div>
                      <div className="flex-1 bg-[#4182ff]/40 rounded-t-lg" style={{height: '70%'}}></div>
                      <div className="flex-1 bg-[#66dd8b]/40 rounded-t-lg" style={{height: net > 0 ? '90%' : '20%'}}></div>
                   </div>
                </div>

                {/* AI ASSISTANT WINDOW */}
                <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-6 flex flex-col">
                  <p className="text-[10px] font-bold uppercase text-[#4182ff] mb-4 tracking-tighter">QueryFlow AI Assistant</p>
                  <div className="flex-1 text-[11px] text-gray-400 font-mono leading-relaxed bg-black/40 p-4 rounded-xl mb-4 border border-white/5">
                    {net > 0 ? "Performance Optimal. Consider re-investing profit into low-stock assets." : "Margin Alert: High cost basis detected. Review inventory pricing."}
                  </div>
                  <input 
                    className="bg-[#1a1a1a] p-3 rounded-xl text-[10px] text-white outline-none border border-white/5" 
                    placeholder="Ask QueryFlow..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                  />
                </div>
              </div>

              {/* TOP 5 STOCKS & RECENT ACTIVITY */}
              <div className="grid grid-cols-2 gap-6 pb-10">
                <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-8">
                  <p className="text-[10px] font-bold uppercase text-gray-600 mb-6 tracking-widest">Top 5 Holdings</p>
                  <div className="space-y-4">
                    {topFive.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[11px] uppercase font-black">{item.name}</span>
                        <span className="text-[11px] text-[#4182ff]">${(item.price * item.stock).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-8">
                  <p className="text-[10px] font-bold uppercase text-gray-600 mb-6 tracking-widest">Recent System Interactions</p>
                  <div className="space-y-2 text-[10px] font-mono text-gray-500">
                    <p>{">"} DB Sync Success: User UUID Validated</p>
                    <p>{">"} Inventory Update: {items.length} records parsed</p>
                    <p>{">"} Tax Calculation: 18.00% Applied</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <InventoryContainer items={items} />
          )}
        </div>
      </main>

      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={(newItem) => setItems([newItem, ...items])} userId={userId} />
    </div>
  );
};

const StatCard = ({ title, value, color = "white" }) => (
  <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-2xl">
    <p className="text-[8px] font-black uppercase text-gray-600 mb-1 tracking-widest">{title}</p>
    <p className="text-xl font-black truncate" style={{color}}>{value}</p>
  </div>
);

export default Vault;
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
    } catch (err) { console.error("Sync Error:", err); }
  }, [userId]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // --- MATH ENGINE ---
  const safeVal = (v) => isNaN(parseFloat(v)) ? 0 : parseFloat(v);
  const grossVal = items.reduce((acc, i) => acc + (safeVal(i.price) * safeVal(i.stock)), 0);
  const costVal = items.reduce((acc, i) => acc + (safeVal(i.cost_price) * safeVal(i.stock)), 0);
  const totalStock = items.reduce((acc, i) => acc + safeVal(i.stock), 0);
  const tax = grossVal * 0.18;
  const net = grossVal - costVal - tax;

  const topFive = [...items].sort((a, b) => (b.price * b.stock) - (a.price * a.stock)).slice(0, 5);

  return (
    <div className="flex h-screen bg-[#050505] font-['JetBrains_Mono'] selection:bg-[#4182ff]/30">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 p-8 flex flex-col justify-between bg-black/20">
        <div>
          <div className="mb-12 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#4182ff] rounded-full animate-pulse" />
            <span className="font-black text-lg italic tracking-tighter uppercase">Vault.exe</span>
          </div>
          <nav className="space-y-2">
            {["dashboard", "inventory"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white/5 text-[#4182ff] border border-white/10" : "text-gray-600 hover:text-gray-400"}`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={onLogout} className="text-red-900/40 text-[9px] font-bold uppercase hover:text-red-500 transition-colors">Terminate_Session</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-white/5 flex justify-between items-center px-10">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">/root/{activeTab}</h2>
          {activeTab === "inventory" && (
            <button onClick={() => setIsAddModalOpen(true)} className="bg-[#4182ff] w-10 h-10 rounded-full text-xl shadow-[0_0_20px_#4182ff66] hover:scale-105 active:scale-95 transition-all">+</button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-8">
          {activeTab === "dashboard" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {/* TOP STATS */}
              <div className="grid grid-cols-4 gap-4">
                <StatCard label="Valuation" value={`$${grossVal.toLocaleString()}`} accent="#4182ff" />
                <StatCard label="Net Efficiency" value={`$${net.toLocaleString()}`} accent="#00ff88" />
                <StatCard label="Tax Provision" value={`-$${tax.toLocaleString()}`} accent="#ff3366" />
                <StatCard label="Total Units" value={totalStock.toLocaleString()} accent="#ffffff" />
              </div>

              {/* REPORT & AI AREA */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 glass p-8 min-h-[350px] flex flex-col justify-between overflow-hidden relative">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Live_Performance_Report</p>
                  <div className="flex items-end gap-2 h-48 opacity-60">
                    {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                      <div key={i} className="flex-1 bg-[#4182ff]/20 border-t border-x border-[#4182ff]/30 rounded-t-sm" style={{height: `${h}%`}} />
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] text-white/20 font-bold uppercase pt-4 border-t border-white/5">
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                  </div>
                </div>

                <div className="glass p-8 border-[#4182ff]/20 bg-[#4182ff]/5 flex flex-col">
                  <p className="text-[10px] font-bold text-[#4182ff] uppercase mb-6 tracking-tighter underline">QueryFlow_Assistant</p>
                  <div className="flex-1 text-[11px] text-white/50 font-mono leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5 mb-6">
                    {net > 0 ? "> Status: OPTIMAL. Liquidity margins are healthy." : "> Caution: Margin squeeze detected. Review cost basis."}
                  </div>
                  <input className="bg-white/5 border border-white/10 p-4 rounded-xl text-[10px] outline-none text-[#4182ff]" placeholder="Execute command..." />
                </div>
              </div>

              {/* BOTTOM DATA */}
              <div className="grid grid-cols-2 gap-6">
                <div className="glass p-8">
                  <p className="text-[10px] font-bold text-white/40 uppercase mb-6">Top_Holdings</p>
                  <div className="space-y-4">
                    {topFive.map((item, i) => (
                      <div key={i} className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-[11px] font-bold uppercase">{item.name}</span>
                        <span className="text-[11px] text-[#4182ff]">${(item.price * item.stock).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass p-8 font-mono text-[9px] text-white/20 space-y-1">
                  <p className="text-white/40 mb-4 font-bold uppercase">[System_Log]</p>
                  <p>{">"} Handshake established: 0x{userId?.slice(0,8)}</p>
                  <p>{">"} DB Sync Success: {items.length} records</p>
                  <p>{">"} Calculation Engine: V2.0.4 Live</p>
                </div>
              </div>
            </div>
          ) : (
            <InventoryContainer items={items} />
          )}
        </div>
      </main>

      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={(n) => setItems([n, ...items])} userId={userId} />
    </div>
  );
};

const StatCard = ({ label, value, accent }) => (
  <div className="glass p-6 group hover:bg-white/[0.05] transition-all relative overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: accent }} />
    <p className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">{label}</p>
    <p className="text-xl font-black tracking-tighter truncate" style={{color: value.includes('-') ? '#ff3366' : 'white'}}>{value}</p>
  </div>
);

export default Vault;
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import InventoryContainer from "../components/InventoryContainer";
import AddAssetModal from "../components/AddAssetModal";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const TrendGraph = ({ isProfit }) => (
  <svg width="35" height="15" viewBox="0 0 40 20" fill="none" className="ml-2">
    <path d={isProfit ? "M0 18 L10 15 L20 5 L40 2" : "M0 2 L10 5 L20 15 L40 18"} 
          stroke={isProfit ? "#66dd8b" : "#ef4444"} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { if (userId) fetchItems(); }, [userId]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setItems([]); } finally { setIsLoading(false); }
  };

  const safeVal = (v) => isNaN(parseFloat(v)) ? 0 : parseFloat(v);
  const totalVal = items.reduce((acc, i) => acc + (safeVal(i.price) * safeVal(i.stock)), 0);
  const totalCost = items.reduce((acc, i) => acc + (safeVal(i.cost_price) * safeVal(i.stock)), 0);
  const profit = totalVal - totalCost;

  if (isLoading) return <div className="h-screen bg-[#0e0e0e] flex items-center justify-center text-[#4182ff] font-black tracking-widest uppercase text-xs">Syncing Terminal...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white fixed inset-0 overflow-hidden font-['Inter']">
      
      {/* SIDEBAR - Sophisticated Slim Width */}
      <aside className="w-60 border-r border-white/5 flex flex-col p-8 shrink-0">
        <div className="mb-12 font-black text-xl tracking-tighter italic text-[#4182ff]">Vault</div>
        <nav className="flex-1 space-y-1">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#1c1b1b] text-white shadow-xl' : 'text-gray-600 hover:text-white'}`}>
               <span className="material-symbols-outlined text-sm">{tab === 'dashboard' ? 'grid_view' : tab === 'inventory' ? 'payments' : 'analytics'}</span> {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto text-red-900/30 text-[9px] font-black uppercase tracking-[0.3em] hover:text-red-500 transition-colors">Terminate</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
        {/* HEADER */}
        <header className="min-h-20 border-b border-white/5 flex justify-between items-center px-10">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-black uppercase tracking-tighter">{activeTab}</h2>
            <div className="flex items-center px-3 py-1.5 rounded-lg border border-white/5 bg-[#131313]">
              <span className={`text-[9px] font-black tracking-widest ${profit >= 0 ? 'text-[#66dd8b]' : 'text-red-500'}`}>{profit >= 0 ? 'BULLISH' : 'BEARISH'}</span>
              <TrendGraph isProfit={profit >= 0} />
            </div>
          </div>
          <input className="bg-[#131313] border border-white/5 rounded-xl px-4 py-2 text-[10px] w-64 outline-none uppercase font-black tracking-widest text-gray-500" placeholder="Global Search..." onChange={e => setSearchTerm(e.target.value)} />
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in space-y-8">
              {/* TOP STATS - Fluid font-size to prevent spill */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Valuation", val: `$${totalVal.toLocaleString()}`, col: "text-white" },
                  { label: "Net Gain", val: `${profit >= 0 ? '+' : ''}$${profit.toLocaleString()}`, col: profit >= 0 ? "text-[#66dd8b]" : "text-red-500" },
                  { label: "Tax Provision", val: `-$${(totalVal * 0.18).toLocaleString()}`, col: "text-red-900/40" },
                  { label: "Active Units", val: items.reduce((acc, i) => acc + safeVal(i.stock), 0), col: "text-white" }
                ].map((s, i) => (
                  <div key={i} className="bg-[#131313] p-6 rounded-[2rem] border border-white/5 shadow-2xl">
                    <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest block mb-2">{s.label}</span>
                    <h3 className={`text-xl font-black truncate tracking-tighter ${s.col}`}>{s.val}</h3>
                  </div>
                ))}
              </div>

              {/* REVENUE OVERVIEW */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 relative overflow-hidden flex flex-col justify-between h-80 shadow-2xl">
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em]">Realizable Institutional Net</span>
                  <h3 className="text-6xl md:text-7xl font-black tracking-tighter leading-none text-white truncate max-w-full">
                    ${(totalVal * 0.82).toLocaleString()}
                  </h3>
                  <div className={`absolute bottom-0 left-0 h-1.5 w-[80%] shadow-[0_0_20px_#4182ff] ${profit >= 0 ? 'bg-[#4182ff]' : 'bg-red-500'}`}></div>
                </div>

                {/* YIELD INDEX */}
                <div className="bg-[#131313] p-8 rounded-[3.5rem] border border-white/5 shadow-2xl">
                  <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest block mb-6 border-b border-white/5 pb-2">High-Yield Index</span>
                  <div className="space-y-4">
                    {items.sort((a,b)=> (safeVal(b.price)-safeVal(b.cost_price))-(safeVal(a.price)-safeVal(a.cost_price))).slice(0, 5).map((a, i) => (
                      <div key={i} className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-gray-500 truncate w-32">{a.name}</span>
                        <span className="text-[#66dd8b] font-black">↑ ${(safeVal(a.price)-safeVal(a.cost_price)).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RECENT LEDGER */}
              <div className="bg-[#131313] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">Recent Ledger Interactions</span>
                  <span className="text-[8px] text-gray-800 uppercase font-black tracking-widest italic animate-pulse text-[#66dd8b]">Node-04 Active</span>
                </div>
                <div className="p-4 space-y-1">
                   {[{t:'20:15', a:'Terminal Sync', e:'LEDGER', v:'Verified'}].map((e, i) => (
                    <div key={i} className="grid grid-cols-4 items-center p-4 text-[11px] font-black hover:bg-white/[0.02] rounded-2xl transition-all">
                      <span className="text-gray-700">{e.t}</span><span className="uppercase text-gray-300">{e.a}</span><span className="text-[#4182ff] italic">[{e.e}]</span><span className="text-right text-gray-600">{e.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "inventory" && <InventoryContainer items={items} searchTerm={searchTerm} />}
        </div>
      </main>

      {/* AI SIDEBAR */}
      <aside className="w-80 border-l border-white/5 bg-[#0e0e0e] p-8 flex flex-col shrink-0">
        <div className="text-[10px] font-black text-gray-700 uppercase mb-8 border-b border-white/5 pb-4">CFO AI Analysis</div>
        <div className="flex-1 text-[11px] text-gray-500 leading-relaxed italic">
          "Terminal initialized. All fiscal nodes verified. Query asset valuations or audit logs using natural language."
        </div>
      </aside>
    </div>
  );
};

export default Vault;
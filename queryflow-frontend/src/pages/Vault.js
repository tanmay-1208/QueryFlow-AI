import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import InventoryContainer from "../components/InventoryContainer";
import AddAssetModal from "../components/AddAssetModal";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const TrendGraph = ({ isProfit }) => (
  <svg width="30" height="15" viewBox="0 0 40 20" fill="none" className="ml-2">
    <path d={isProfit ? "M0 18 L15 12 L25 5 L40 2" : "M0 2 L15 8 L25 15 L40 18"} 
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

  if (isLoading) return <div className="h-screen bg-[#0e0e0e] flex items-center justify-center text-[#4182ff] font-black tracking-widest text-[10px]">TERMINAL SYNC...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white fixed inset-0 overflow-hidden font-['Inter']">
      
      {/* SIDEBAR */}
      <aside className="w-56 border-r border-white/5 flex flex-col p-6 shrink-0">
        <div className="mb-10 font-black text-lg tracking-tighter italic text-[#4182ff]">Vault</div>
        <nav className="flex-1 space-y-1">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'bg-[#1c1b1b]' : 'text-gray-600 hover:text-white'}`}>
               <span className="material-symbols-outlined text-sm">{tab === 'dashboard' ? 'grid_view' : tab === 'inventory' ? 'payments' : 'analytics'}</span> {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="text-red-900/40 text-[9px] font-black uppercase tracking-widest hover:text-red-500">Terminate</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
        <header className="min-h-16 border-b border-white/5 flex justify-between items-center px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black uppercase tracking-tight">{activeTab}</h2>
            <div className="flex items-center px-3 py-1 rounded-lg border border-white/5 bg-[#131313]">
              <span className={`text-[8px] font-black ${profit >= 0 ? 'text-[#66dd8b]' : 'text-red-500'}`}>{profit >= 0 ? 'BULLISH' : 'BEARISH'}</span>
              <TrendGraph isProfit={profit >= 0} />
            </div>
          </div>
          <input className="bg-[#131313] border border-white/5 rounded-lg px-4 py-1.5 text-[10px] w-64 outline-none uppercase font-black tracking-widest text-gray-500" placeholder="Search..." onChange={e => setSearchTerm(e.target.value)} />
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Valuation", val: `$${totalVal.toLocaleString()}`, col: "text-white" },
                  { label: "Net Gain", val: `$${profit.toLocaleString()}`, col: profit >= 0 ? "text-[#66dd8b]" : "text-red-500" },
                  { label: "Tax (18%)", val: `-$${(totalVal * 0.18).toLocaleString()}`, col: "text-gray-600" },
                  { label: "Units", val: items.reduce((acc, i) => acc + safeVal(i.stock), 0), col: "text-white" }
                ].map((s, i) => (
                  <div key={i} className="bg-[#131313] p-5 rounded-2xl border border-white/5">
                    <span className="text-[8px] text-gray-600 uppercase font-black block mb-1">{s.label}</span>
                    <h3 className={`text-base font-black truncate ${s.col}`}>{s.val}</h3>
                  </div>
                ))}
              </div>

              <div className="bg-[#1c1b1b] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden flex flex-col justify-between h-56 shadow-2xl">
                <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Realizable Portfolio</span>
                <h3 className="text-5xl font-black tracking-tighter leading-none">${(totalVal * 0.82).toLocaleString()}</h3>
                <div className={`absolute bottom-0 left-0 h-1 w-[80%] ${profit >= 0 ? 'bg-[#4182ff]' : 'bg-red-500'}`}></div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <InventoryContainer items={items} searchTerm={searchTerm} onUpdateStock={fetchItems} />
          )}

          {activeTab === "reports" && (
            <div className="bg-[#131313] p-10 rounded-[3rem] border border-white/5 text-center">
              <h3 className="text-3xl font-black mb-6">Fiscal Audit</h3>
              <div className="space-y-4 text-left max-w-md mx-auto">
                 <div className="flex justify-between border-b border-white/5 py-2">
                   <span className="text-gray-500 text-xs font-bold uppercase">Asset Value</span>
                   <span className="font-black">${totalVal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between border-b border-white/5 py-2">
                   <span className="text-gray-500 text-xs font-bold uppercase">Capital Cost</span>
                   <span className="font-black text-red-500">-${totalCost.toLocaleString()}</span>
                 </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <aside className="w-64 border-l border-white/5 bg-[#0e0e0e] p-6 flex flex-col shrink-0">
        <div className="text-[9px] font-black text-gray-700 uppercase mb-6 border-b border-white/5 pb-2">CFO AI Analysis</div>
        <p className="text-[10px] text-gray-500 italic leading-relaxed">"System synchronized. Assets verified. Ready for query."</p>
      </aside>
    </div>
  );
};

export default Vault;
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
  
  // --- CORE MATH ---
  const totalValuation = items.reduce((acc, i) => acc + (safeVal(i.price) * safeVal(i.stock)), 0);
  const totalInvestment = items.reduce((acc, i) => acc + (safeVal(i.cost_price) * safeVal(i.stock)), 0);
  const taxReserve = totalValuation * 0.18;
  const netProfit = totalValuation - totalInvestment - taxReserve;
  const totalUnits = items.reduce((acc, i) => acc + safeVal(i.stock), 0);

  if (isLoading) return <div className="h-screen bg-[#0e0e0e] flex items-center justify-center text-[#4182ff] font-black tracking-widest uppercase text-[10px]">Syncing Terminal...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white fixed inset-0 overflow-hidden font-['Inter']">
      
      {/* SIDEBAR */}
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
        <header className="min-h-20 border-b border-white/5 flex justify-between items-center px-10">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-black uppercase tracking-tighter">{activeTab}</h2>
            <div className="flex items-center px-3 py-1.5 rounded-lg border border-white/5 bg-[#131313]">
              <span className={`text-[9px] font-black tracking-widest ${netProfit >= 0 ? 'text-[#66dd8b]' : 'text-red-500'}`}>{netProfit >= 0 ? 'BULLISH' : 'BEARISH'}</span>
              <TrendGraph isProfit={netProfit >= 0} />
            </div>
          </div>
          <input className="bg-[#131313] border border-white/5 rounded-xl px-4 py-2 text-[10px] w-64 outline-none uppercase font-black tracking-widest text-gray-500" placeholder="Global Search..." onChange={e => setSearchTerm(e.target.value)} />
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in space-y-8">
              {/* RESTORED 4-STAT GRID */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Valuation", val: `$${totalValuation.toLocaleString()}`, col: "text-white" },
                  { label: "Projected Profit", val: `$${Math.floor(netProfit).toLocaleString()}`, col: "text-[#66dd8b]" },
                  { label: "Tax Reserve (18%)", val: `-$${Math.floor(taxReserve).toLocaleString()}`, col: "text-red-900/40" },
                  { label: "Total Units", val: totalUnits, col: "text-white" }
                ].map((s, i) => (
                  <div key={i} className="bg-[#131313] p-5 rounded-[2rem] border border-white/5 shadow-2xl">
                    <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest block mb-2">{s.label}</span>
                    <h3 className={`text-lg font-black truncate tracking-tighter ${s.col}`}>{s.val}</h3>
                  </div>
                ))}
              </div>

              {/* REALIZABLE NET DISPLAY */}
              <div className="bg-[#1c1b1b] p-10 rounded-[4rem] border border-white/5 relative overflow-hidden flex flex-col justify-between h-72 shadow-2xl">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em]">Realizable Institutional Net</span>
                <h3 className="text-6xl font-black tracking-tighter leading-none text-white truncate max-w-full">
                  ${(totalValuation - taxReserve).toLocaleString()}
                </h3>
                <div className={`absolute bottom-0 left-0 h-1.5 w-[80%] shadow-[0_0_20px_#4182ff] ${netProfit >= 0 ? 'bg-[#4182ff]' : 'bg-red-500'}`}></div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <InventoryContainer items={items} searchTerm={searchTerm} onUpdateStock={fetchItems} />
          )}

          {activeTab === "reports" && (
            <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4">
               <div className="bg-[#131313] p-16 rounded-[4rem] border border-white/5 shadow-2xl">
                  <h3 className="text-4xl font-black mb-4 font-['Manrope'] tracking-tighter text-center">Fiscal Audit</h3>
                  <p className="text-center text-gray-600 uppercase font-black text-[10px] tracking-[0.5em] mb-12">Institutional Report v4.0</p>
                  
                  <div className="space-y-6 text-left border-t border-white/5 pt-12">
                     <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Gross Asset Value</span>
                        <span className="font-black text-2xl tracking-tighter">${totalValuation.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Calculated Tax Liability</span>
                        <span className="font-black text-2xl tracking-tighter text-red-900/40">-${Math.floor(taxReserve).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Capital Expenditure</span>
                        <span className="font-black text-2xl tracking-tighter text-red-500">-${totalInvestment.toLocaleString()}</span>
                     </div>
                     <div className="bg-[#66dd8b]/5 p-10 rounded-[3rem] mt-10 border border-[#66dd8b]/10 flex justify-between items-center shadow-inner">
                       <span className="text-[#66dd8b] font-black text-[10px] uppercase tracking-[0.2em]">Net Realizable Yield</span>
                       <span className="font-black text-5xl tracking-tighter text-[#66dd8b]">${Math.floor(netProfit).toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Vault;
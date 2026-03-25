import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import InventoryContainer from "../components/InventoryContainer";
import AddAssetModal from "../components/AddAssetModal";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

// --- SOPHISTICATED TREND GRAPH ---
const TrendGraph = ({ isProfit, isNeutral }) => {
  const color = isNeutral ? "#6b7280" : isProfit ? "#66dd8b" : "#ef4444";
  const path = isNeutral 
    ? "M0 12 L10 12 L20 12 L30 12 L40 12" 
    : isProfit 
      ? "M0 18 L10 16 L20 10 L30 12 L40 2" 
      : "M0 2 L10 5 L20 15 L30 12 L40 20";

  return (
    <svg width="35" height="18" viewBox="0 0 40 20" fill="none" className="ml-3">
      <path d={path} stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", cost_price: "", market_price: "", stock: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const [userQuery, setUserQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', text: "Terminal Secure. CFO AI standing by." }]);
  const [ledger] = useState([
    { id: 1, type: 'SYS', action: 'Terminal Sync', entity: 'NODE-04', val: 'Success', time: '20:04' },
    { id: 2, type: 'IN', action: 'Asset Purchase', entity: 'Rolex Sub', val: '+$12.4k', time: '19:42' },
    { id: 3, type: 'OUT', action: 'Liquidation', entity: 'Vintage Pen', val: '-$2.1k', time: '18:15' },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => { if (userId) fetchItems(); }, [userId]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setItems([]); } finally { setIsLoading(false); }
  };

  const safeVal = (v) => isNaN(parseFloat(v)) ? 0 : parseFloat(v);
  const totalValuation = items.reduce((acc, i) => acc + (safeVal(i.price) * safeVal(i.stock)), 0);
  const totalInvestment = items.reduce((acc, i) => acc + (safeVal(i.cost_price) * safeVal(i.stock)), 0);
  const netProfit = totalValuation - totalInvestment;
  const isProfit = netProfit > 0;

  if (isLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-black animate-pulse">TERMINAL ENCRYPTING...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white fixed inset-0 overflow-hidden font-['Inter']">
      
      {/* SIDEBAR */}
      <aside className="w-60 border-r border-white/5 bg-[#0e0e0e] flex flex-col p-6 shrink-0">
        <div className="mb-10 font-black text-lg tracking-tighter italic text-[#4182ff]">Vault</div>
        <nav className="flex-1 space-y-1">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#1c1b1b] text-white shadow-lg' : 'text-gray-600 hover:text-white'}`}>
               <span className="material-symbols-outlined text-sm">{tab === 'dashboard' ? 'grid_view' : tab === 'inventory' ? 'account_balance_wallet' : 'analytics'}</span> {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto text-red-900/40 text-[8px] font-black tracking-[0.3em] uppercase hover:text-red-500">Terminate</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
        <header className="min-h-16 border-b border-white/5 flex justify-between items-center px-8">
          <div className="flex items-center gap-5">
            <h2 className="text-lg font-black uppercase tracking-tighter">{activeTab}</h2>
            <div className="flex items-center px-3 py-1 rounded-lg border border-white/5 bg-[#131313]">
              <span className={`text-[8px] font-black tracking-widest ${isProfit ? 'text-[#66dd8b]' : 'text-red-500'}`}>{isProfit ? 'BULLISH' : 'BEARISH'}</span>
              <TrendGraph isProfit={isProfit} isNeutral={netProfit === 0} />
            </div>
          </div>
          <input className="bg-[#131313] border border-white/5 rounded-xl px-4 py-2 text-[9px] w-56 outline-none uppercase font-black tracking-widest text-gray-500 focus:border-white/10" placeholder="Search..." onChange={e => setSearchTerm(e.target.value)} />
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in duration-500 space-y-6">
              
              {/* TOP STATS - Corrected font sizes for no overflow */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Gross Valuation", val: `$${totalValuation.toLocaleString()}`, color: "text-white" },
                  { label: "Net Gain", val: `${isProfit ? '+' : ''}$${netProfit.toLocaleString()}`, color: isProfit ? "text-[#66dd8b]" : "text-red-500" },
                  { label: "Tax Provision", val: `-$${Math.floor(totalValuation * 0.18).toLocaleString()}`, color: "text-red-900/40" },
                  { label: "Assets", val: items.length, color: "text-white" }
                ].map((stat, i) => (
                  <div key={i} className="bg-[#131313] p-5 rounded-2xl border border-white/5 overflow-hidden">
                    <span className="text-[8px] text-gray-600 uppercase font-black tracking-widest block mb-1">{stat.label}</span>
                    <h3 className={`text-lg font-black tracking-tight truncate ${stat.color}`}>{stat.val}</h3>
                  </div>
                ))}
              </div>

              {/* MAIN CONTENT GRID */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#1c1b1b] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden flex flex-col justify-between h-72 shadow-2xl">
                  <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Realizable Institutional Net</span>
                  {/* Reduced from 7xl to 5xl to prevent spill-out */}
                  <h3 className="text-5xl md:text-6xl font-black tracking-tighter leading-none text-white truncate max-w-full">
                    ${(totalValuation * 0.82).toLocaleString()}
                  </h3>
                  <div className={`absolute bottom-0 left-0 h-1 w-[80%] ${isProfit ? 'bg-[#4182ff]' : 'bg-red-500'}`}></div>
                </div>

                <div className="bg-[#131313] p-6 rounded-[2.5rem] border border-white/5">
                   <h4 className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-4">High-Yield Index</h4>
                   <div className="space-y-3">
                     {[...items].sort((a,b)=> (b.price-b.cost_price)-(a.price-a.cost_price)).slice(0,4).map((asset, i) => (
                       <div key={i} className="flex justify-between items-center text-[9px] font-bold">
                         <span className="text-gray-500 truncate w-20">{asset.name}</span>
                         <span className="text-[#66dd8b] tracking-tighter">↑ ${(asset.price-asset.cost_price).toLocaleString()}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              {/* RECENT INTERACTIONS */}
              <div className="bg-[#131313] rounded-[2rem] border border-white/5 overflow-hidden">
                <div className="px-6 py-3 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">Terminal Ledger</span>
                </div>
                <div className="p-2 space-y-1">
                  {ledger.map(entry => (
                    <div key={entry.id} className="grid grid-cols-4 items-center p-3 hover:bg-white/[0.01] rounded-xl transition-all">
                      <span className="text-[9px] font-black text-gray-700">{entry.time}</span>
                      <span className="text-[8px] w-fit bg-white/5 px-2 py-0.5 rounded text-gray-600 uppercase font-black">{entry.type}</span>
                      <span className="text-[9px] font-bold uppercase truncate">{entry.action}</span>
                      <span className="text-right text-[9px] font-black text-gray-500">{entry.val}</span>
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
      <aside className="w-72 border-l border-white/5 bg-[#0e0e0e] p-6 flex flex-col h-full shrink-0">
        <div className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-6 border-b border-white/5 pb-3">CFO AI Analysis</div>
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar mb-4">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-4 rounded-xl text-[9px] leading-relaxed ${msg.role === 'assistant' ? 'bg-[#131313] border border-white/5 text-gray-500' : 'bg-[#4182ff]/10 text-[#4182ff]'}`}>
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={(e)=>e.preventDefault()} className="relative mt-auto">
          <input className="w-full bg-[#131313] border border-white/5 rounded-xl px-4 py-2.5 text-[9px] text-white outline-none" placeholder="Query terminal..." />
          <button className="absolute right-3 top-2 text-[#4182ff] material-symbols-outlined text-sm">send</button>
        </form>
      </aside>

      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} newItem={newItem} setNewItem={setNewItem} />
    </div>
  );
};

export default Vault;
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import InventoryContainer from "../components/InventoryContainer";
import AddAssetModal from "../components/AddAssetModal";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

// --- SOPHISTICATED TREND GRAPH ---
const TrendGraph = ({ isProfit, isNeutral }) => {
  const color = isNeutral ? "#6b7280" : isProfit ? "#66dd8b" : "#ef4444";
  const path = isNeutral 
    ? "M0 15 L8 14 L16 16 L24 13 L32 15 L40 14" 
    : isProfit 
      ? "M0 20 L10 17 L20 18 L30 8 L40 2" 
      : "M0 2 L10 5 L20 18 L30 14 L40 22";

  return (
    <svg width="48" height="24" viewBox="0 0 40 25" fill="none" className="ml-3">
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
  
  // AI State
  const [userQuery, setUserQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', text: "Terminal Secure. CFO AI standing by." }]);
  const chatEndRef = useRef(null);

  // LEDGER STATE (Mock history for professional look)
  const [ledger] = useState([
    { id: 1, type: 'System', action: 'Terminal Initialized', entity: 'NODE-04', val: 'Verified', time: '20:00' },
    { id: 2, type: 'Buy', action: 'Asset Restock', entity: 'Vintage Rolex', val: '+$1.5M', time: '19:42' },
    { id: 3, type: 'Sell', action: 'Liquidation', entity: 'Diamond Ring', val: '-$1.2M', time: '18:15' },
  ]);

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
  const isNeutral = netProfit === 0;

  const topAssets = [...items]
    .sort((a, b) => (safeVal(b.price) - safeVal(b.cost_price)) - (safeVal(a.price) - safeVal(a.cost_price)))
    .slice(0, 5);

  const handleChat = (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    const newHist = [...chatHistory, { role: 'user', text: userQuery }];
    setChatHistory(newHist);
    setUserQuery("");
    setTimeout(() => {
      setChatHistory([...newHist, { role: 'assistant', text: `Audit Complete. Current Portfolio Health: ${isProfit ? 'Optimal' : 'Neutral'}. Realizable Net: $${(totalValuation * 0.82).toLocaleString()}.` }]);
    }, 800);
  };

  if (isLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-black animate-pulse uppercase tracking-[0.4em]">Decrypting Vault...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white fixed inset-0 overflow-hidden font-['Inter'] selection:bg-[#4182ff]">
      
      {/* LEFT NAVIGATION */}
      <aside className="w-72 border-r border-white/5 flex flex-col p-10 shrink-0">
        <div className="mb-16 font-black text-2xl font-['Manrope'] tracking-tighter italic text-white flex items-center gap-2">
          <span className="w-2 h-2 bg-[#4182ff] rounded-full"></span> Vault
        </div>
        <nav className="flex-1 space-y-3">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === tab ? 'bg-[#1c1b1b] text-white shadow-xl shadow-black' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}>
               <span className="material-symbols-outlined text-lg">{tab === 'dashboard' ? 'grid_view' : tab === 'inventory' ? 'account_balance_wallet' : 'analytics'}</span> {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto text-red-900/40 py-4 text-[10px] font-black tracking-[0.5em] uppercase hover:text-red-500 transition-colors">Terminate</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
        {/* TOP BAR */}
        <header className="min-h-24 border-b border-white/5 flex justify-between items-center px-12">
          <div className="flex items-center gap-10">
            <h2 className="text-3xl font-black uppercase font-['Manrope'] tracking-tight">{activeTab}</h2>
            <div className={`flex items-center px-5 py-2.5 rounded-2xl border border-white/5 bg-[#131313]`}>
              <span className={`text-[10px] font-black tracking-[0.3em] ${isNeutral ? 'text-gray-600' : isProfit ? 'text-[#66dd8b]' : 'text-red-500'}`}>
                {isNeutral ? 'STABLE' : isProfit ? 'BULLISH' : 'BEARISH'}
              </span>
              <TrendGraph isProfit={isProfit} isNeutral={isNeutral} />
            </div>
          </div>
          <input className="bg-[#131313] border border-white/5 rounded-2xl px-6 py-3 text-[10px] w-80 outline-none uppercase font-black tracking-[0.2em] text-gray-400 focus:border-[#4182ff]/50 transition-all" placeholder="Global Search..." onChange={e => setSearchTerm(e.target.value)} />
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
              
              {/* TOP STATS */}
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: "Gross Valuation", val: `$${totalValuation.toLocaleString()}`, color: "text-white" },
                  { label: "Net Gain", val: `${isProfit ? '+' : ''}$${netProfit.toLocaleString()}`, color: isProfit ? "text-[#66dd8b]" : "text-red-500" },
                  { label: "Tax Provision", val: `-$${Math.floor(totalValuation * 0.18).toLocaleString()}`, color: "text-red-900/50" },
                  { label: "Assets Vaulted", val: items.reduce((acc, i) => acc + safeVal(i.stock), 0), color: "text-white" }
                ].map((stat, i) => (
                  <div key={i} className="bg-[#131313] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <span className="text-[10px] text-gray-600 uppercase font-black tracking-[0.2em] block mb-3">{stat.label}</span>
                    <h3 className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.val}</h3>
                  </div>
                ))}
              </div>

              {/* MAIN REVENUE & TOP YIELDS */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/10 relative overflow-hidden flex flex-col justify-between h-[28rem] shadow-2xl">
                  <span className="text-[11px] text-gray-500 uppercase font-black tracking-[0.4em]">Realizable Institutional Net</span>
                  <h3 className="text-9xl font-black tracking-tighter leading-none text-white">${(totalValuation * 0.82).toLocaleString()}</h3>
                  <div className={`absolute bottom-0 left-0 h-1.5 w-[80%] shadow-[0_0_25px_#4182ff] ${isProfit ? 'bg-[#4182ff]' : 'bg-red-500'}`}></div>
                </div>

                <div className="bg-[#131313] p-10 rounded-[4rem] border border-white/5 shadow-2xl">
                   <h4 className="text-[10px] text-gray-600 uppercase font-black tracking-[0.3em] mb-10 pb-4 border-b border-white/5">High-Yield Index</h4>
                   <div className="space-y-6">
                     {topAssets.map((asset, i) => (
                       <div key={i} className="flex justify-between items-center group cursor-pointer">
                         <span className="text-xs font-bold text-gray-500 group-hover:text-white transition-colors truncate w-32">{asset.name}</span>
                         <span className="text-[#66dd8b] font-black text-xs tracking-tighter">↑ ${(safeVal(asset.price) - safeVal(asset.cost_price)).toLocaleString()}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              {/* RECENT INTERACTIONS LEDGER */}
              <div className="bg-[#131313] rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="px-10 py-7 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Live Transaction Ledger</span>
                  <div className="flex gap-4">
                    <span className="w-2 h-2 bg-[#66dd8b] rounded-full animate-pulse"></span>
                    <span className="text-[9px] font-black text-gray-700 tracking-widest uppercase italic">Node-04 Active</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {ledger.map(entry => (
                    <div key={entry.id} className="grid grid-cols-5 items-center p-5 hover:bg-white/[0.03] rounded-3xl transition-all group">
                      <span className="text-[11px] font-black text-gray-700 group-hover:text-gray-500 transition-colors">{entry.time}</span>
                      <span className="text-[9px] w-fit bg-white/5 px-4 py-1.5 rounded-full font-black text-gray-600 uppercase tracking-widest">{entry.type}</span>
                      <span className="text-xs font-black uppercase tracking-tight col-span-2">{entry.action} <span className="text-[#4182ff] ml-2 italic">[{entry.entity}]</span></span>
                      <span className="text-right text-xs font-black text-gray-400">{entry.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "inventory" && <InventoryContainer items={items} searchTerm={searchTerm} />}
        </div>
      </main>

      {/* AI ANALYTICS SIDEBAR */}
      <aside className="w-[22rem] border-l border-white/5 bg-[#0e0e0e] flex flex-col p-10 shrink-0 shadow-2xl">
        <div className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-700 mb-12 border-b border-white/5 pb-6">CFO AI Analysis</div>
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-7 rounded-[2.5rem] text-[11px] leading-relaxed shadow-xl transition-all ${msg.role === 'assistant' ? 'bg-[#131313] border border-white/5 text-gray-400' : 'bg-[#4182ff]/10 text-[#4182ff] ml-6 border border-[#4182ff]/20'}`}>
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleChat} className="mt-8 relative group">
          <input 
            className="w-full bg-[#131313] border border-white/5 rounded-2xl px-6 py-4 text-[11px] text-white outline-none focus:border-[#4182ff]/30 transition-all placeholder:text-gray-800" 
            placeholder="Query terminal data..." 
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-4 top-3.5 text-[#4182ff] material-symbols-outlined text-lg opacity-50 group-hover:opacity-100 transition-opacity">send</button>
        </form>
      </aside>

      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} newItem={newItem} setNewItem={setNewItem} />
    </div>
  );
};

export default Vault;
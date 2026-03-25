import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import InventoryContainer from "../components/InventoryContainer";
import AddAssetModal from "../components/AddAssetModal";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

// --- SPARKLINE GRAPH COMPONENT ---
const TrendGraph = ({ isProfit, isNeutral }) => {
  const color = isNeutral ? "#6b7280" : isProfit ? "#66dd8b" : "#ef4444";
  const path = isNeutral 
    ? "M0 15 L10 12 L20 18 L30 10 L40 15" 
    : isProfit 
      ? "M0 20 L10 18 L20 10 L30 12 L40 2" 
      : "M0 2 L10 5 L20 15 L30 12 L40 22";

  return (
    <svg width="40" height="25" viewBox="0 0 40 25" fill="none" className="ml-2">
      <path d={path} stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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

  useEffect(() => { if (userId) fetchItems(); }, [userId]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setItems([]); } finally { setIsLoading(false); }
  };

  // --- MATH SAFETY ---
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
    
    // Simple AI simulation
    setTimeout(() => {
      setChatHistory([...newHist, { role: 'assistant', text: `Analysis complete. Portfolio is currently ${isProfit ? 'Bullish' : 'Neutral'}. Net Liquidity: $${totalValuation.toLocaleString()}.` }]);
    }, 800);
  };

  if (isLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-black animate-pulse uppercase tracking-[0.3em]">Syncing Terminal...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white fixed inset-0 overflow-hidden font-['Inter']">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-8 shrink-0">
        <div className="mb-12 font-black text-xl font-['Manrope'] tracking-tighter italic text-[#adc7ff]">Vault Terminal</div>
        <nav className="flex-1 space-y-2">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#1c1b1b] text-white' : 'text-gray-600 hover:text-white'}`}>
               <span className="material-symbols-outlined text-sm">{tab === 'dashboard' ? 'dashboard' : tab === 'inventory' ? 'inventory_2' : 'description'}</span> {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto bg-red-500/5 text-red-900/40 py-4 rounded-xl text-[9px] font-black tracking-[0.3em] uppercase hover:text-red-500">Exit Terminal</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="min-h-20 border-b border-white/5 flex justify-between items-center px-10">
          <h2 className="text-2xl font-black uppercase font-['Manrope'] tracking-tighter">{activeTab}</h2>
          
          <div className="flex items-center gap-6">
            <div className={`flex items-center px-4 py-2 rounded-xl border border-white/5 bg-[#131313]`}>
              <span className={`text-[9px] font-black tracking-[0.2em] ${isNeutral ? 'text-gray-500' : isProfit ? 'text-[#66dd8b]' : 'text-red-500'}`}>
                {isNeutral ? 'NEUTRAL' : isProfit ? 'BULLISH' : 'BEARISH'}
              </span>
              <TrendGraph isProfit={isProfit} isNeutral={isNeutral} />
            </div>
            <input className="bg-[#1c1b1b] border-none rounded-xl px-4 py-2 text-[10px] w-64 outline-none uppercase font-black tracking-widest text-gray-400" placeholder="Search Terminal..." onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in duration-500 space-y-6">
              
              {/* TOP STATS */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#131313] p-6 rounded-[2rem] border border-white/5 shadow-xl">
                  <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest block mb-2">Valuation</span>
                  <h3 className="text-xl font-black">${totalValuation.toLocaleString()}</h3>
                </div>
                <div className="bg-[#131313] p-6 rounded-[2rem] border border-white/5 shadow-xl">
                  <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest block mb-2">Net Gain</span>
                  <h3 className={`text-xl font-black ${isProfit ? 'text-[#66dd8b]' : 'text-red-500'}`}>
                    {isProfit ? '+' : ''}${netProfit.toLocaleString()}
                  </h3>
                </div>
                <div className="bg-[#131313] p-6 rounded-[2rem] border border-white/5 shadow-xl">
                  <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest block mb-2">Tax Reserve</span>
                  <h3 className="text-xl font-black text-red-500/50">-${Math.floor(totalValuation * 0.18).toLocaleString()}</h3>
                </div>
                <div className="bg-[#131313] p-6 rounded-[2rem] border border-white/5 shadow-xl">
                  <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest block mb-2">Total Units</span>
                  <h3 className="text-xl font-black">{items.reduce((acc, i) => acc + safeVal(i.stock), 0)}</h3>
                </div>
              </div>

              {/* CENTER GRID */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col justify-between h-72">
                  <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Realizable Net at Risk</span>
                  <h3 className="text-7xl font-black tracking-tighter leading-none">${(totalValuation - (totalValuation * 0.18)).toLocaleString()}</h3>
                  <div className={`absolute bottom-0 left-0 h-1 w-[85%] shadow-[0_0_15px_#4182ff] ${isProfit ? 'bg-[#4182ff]' : 'bg-red-500'}`}></div>
                </div>

                {/* TOP 5 */}
                <div className="bg-[#131313] p-8 rounded-[3rem] border border-white/5">
                   <h4 className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-6">Top 5 Yield Assets</h4>
                   <div className="space-y-4">
                     {topAssets.map((asset, i) => (
                       <div key={i} className="flex justify-between items-center text-[11px] font-bold">
                         <span className="text-gray-400 truncate w-32">{asset.name}</span>
                         <span className="text-[#66dd8b] font-black">↑ ${(safeVal(asset.price) - safeVal(asset.cost_price)).toLocaleString()}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "inventory" && <InventoryContainer items={items} searchTerm={searchTerm} />}
        </div>
      </main>

      {/* --- RESTORED: AI ADVISOR SIDEBAR --- */}
      <aside className="w-80 border-l border-white/5 bg-[#0e0e0e] flex flex-col p-8 shrink-0">
        <div className="mb-8 font-black text-[10px] text-gray-600 uppercase tracking-widest border-b border-white/5 pb-4">CFO AI Advisor</div>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-5 rounded-2xl text-[10px] leading-relaxed transition-all ${msg.role === 'assistant' ? 'bg-[#1c1b1b] border-l-2 border-[#adc7ff] text-gray-400' : 'bg-[#adc7ff]/10 text-[#adc7ff] ml-6'}`}>
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleChat} className="mt-6 relative">
          <input 
            className="w-full bg-[#1c1b1b] border border-white/5 rounded-xl px-5 py-3 text-[10px] text-white outline-none focus:border-[#adc7ff]/30" 
            placeholder="Ask terminal..." 
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-2.5 text-[#adc7ff] material-symbols-outlined text-base">send</button>
        </form>
      </aside>

      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} newItem={newItem} setNewItem={setNewItem} />
    </div>
  );
};

export default Vault;
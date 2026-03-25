import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import InventoryContainer from "../components/InventoryContainer";
import AddAssetModal from "../components/AddAssetModal";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", cost_price: "", market_price: "", stock: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', text: "Terminal Secure. CFO AI standing by." }]);
  const [userQuery, setUserQuery] = useState("");
  
  // LIVE LEDGER STATE
  const [ledger, setLedger] = useState([
    { id: 1, action: "System Initialization", entity: "Node 04", value: 0, type: 'neutral', time: "10:45 AM" }
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

  // --- CALCULATIONS ---
  const totalValuation = items.reduce((acc, i) => acc + (Number(i.price || 0) * Number(i.stock || 0)), 0);
  const totalInvestment = items.reduce((acc, i) => acc + (Number(i.cost_price || 0) * Number(i.stock || 0)), 0);
  const totalUnits = items.reduce((acc, i) => acc + (Number(i.stock || 0)), 0);
  const netProfit = totalValuation - totalInvestment;
  const margin = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

  // TOP 5 PROFITABLE STOCKS
  const topAssets = [...items]
    .map(item => ({
      ...item,
      profitPerUnit: Number(item.price || 0) - Number(item.cost_price || 0)
    }))
    .sort((a, b) => b.profitPerUnit - a.profitPerUnit)
    .slice(0, 5);

  const updateStock = async (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, (Number(item.stock) || 0) + delta);
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: newStock } : i));
    
    const newEntry = { 
      id: Date.now(), 
      action: delta > 0 ? "Asset Purchase" : "Asset Liquidation", 
      entity: item.name, 
      value: delta * item.price,
      type: delta > 0 ? 'neutral' : 'gain',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setLedger(prev => [newEntry, ...prev.slice(0, 4)]);
    try { await axios.put(`${API_BASE_URL}/api/products/${id}`, { stock: newStock, userId }); } catch (err) { console.error(err); }
  };

  if (isLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-black animate-pulse">BOOTING TERMINAL...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[#0e0e0e] text-white fixed inset-0 overflow-hidden font-['Inter']">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#0e0e0e] flex flex-col p-8 shrink-0">
        <div className="mb-12 font-black text-xl font-['Manrope'] tracking-tighter italic">Vault Terminal</div>
        <nav className="flex-1 space-y-2">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#1c1b1b] text-white' : 'text-gray-600 hover:text-white'}`}>
               <span className="material-symbols-outlined text-sm">{tab === 'dashboard' ? 'dashboard' : tab === 'inventory' ? 'inventory_2' : 'description'}</span> {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto bg-red-500/5 text-red-900/40 py-4 rounded-xl text-[9px] font-black tracking-[0.3em] uppercase hover:text-red-500 transition-all">Logout</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="min-h-20 border-b border-white/5 flex justify-between items-center px-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black font-['Manrope'] tracking-tighter uppercase">{activeTab}</h2>
            {activeTab === "inventory" && (
              <button onClick={() => setIsAddModalOpen(true)} className="bg-[#4182ff] w-8 h-8 rounded-full flex items-center justify-center material-symbols-outlined text-sm">add</button>
            )}
          </div>
          <input className="bg-[#1c1b1b] border border-white/5 rounded-xl px-4 py-2 text-[10px] w-64 outline-none uppercase font-black tracking-widest text-gray-400" placeholder="Search Terminal..." onChange={e => setSearchTerm(e.target.value)} />
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in duration-500 space-y-8">
              
              {/* TOP 4 STATS GRID */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#131313] p-6 rounded-3xl border border-white/5">
                  <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest block mb-2">Total Valuation</span>
                  <h3 className="text-2xl font-black">${totalValuation.toLocaleString()}</h3>
                </div>
                <div className="bg-[#131313] p-6 rounded-3xl border border-white/5">
                  <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest block mb-2">Net Gain/Loss</span>
                  <h3 className={`text-2xl font-black ${netProfit >= 0 ? 'text-[#66dd8b]' : 'text-red-500'}`}>
                    {netProfit >= 0 ? '+' : ''}${Math.abs(netProfit).toLocaleString()}
                  </h3>
                </div>
                <div className="bg-[#131313] p-6 rounded-3xl border border-white/5">
                  <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest block mb-2">Margin</span>
                  <h3 className={`text-2xl font-black ${margin >= 0 ? 'text-[#66dd8b]' : 'text-red-500'}`}>
                    {margin.toFixed(1)}%
                  </h3>
                </div>
                <div className="bg-[#131313] p-6 rounded-3xl border border-white/5">
                  <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest block mb-2">Total Units</span>
                  <h3 className="text-2xl font-black">{totalUnits}</h3>
                </div>
              </div>

              {/* MAIN REVENUE VISUAL */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col justify-between h-80">
                  <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Realizable Portfolio Net</span>
                  <h3 className="text-8xl font-black tracking-tighter leading-none">${totalValuation.toLocaleString()}</h3>
                  <div className="absolute bottom-0 left-0 h-1 bg-[#4182ff] w-[80%]"></div>
                </div>

                {/* TOP PROFITABLE STOCKS */}
                <div className="bg-[#131313] p-8 rounded-[3rem] border border-white/5">
                  <h4 className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-6">High-Yield Assets</h4>
                  <div className="space-y-4">
                    {topAssets.map((asset, idx) => (
                      <div key={idx} className="flex justify-between items-center group">
                        <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{asset.name}</span>
                        <span className="text-xs font-black text-[#66dd8b]">↑ ${asset.profitPerUnit.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RECENT INTERACTIONS LEDGER */}
              <div className="bg-[#131313] rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Terminal Ledger interactions</span>
                  <div className={`h-2 w-2 rounded-full animate-pulse ${netProfit >= 0 ? 'bg-[#66dd8b]' : 'bg-red-500'}`}></div>
                </div>
                <div className="p-2 space-y-1">
                  {ledger.map(entry => (
                    <div key={entry.id} className="grid grid-cols-4 items-center p-4 hover:bg-white/[0.02] rounded-2xl transition-all">
                      <span className="text-[10px] font-black text-gray-600">{entry.time}</span>
                      <span className="text-xs font-bold uppercase tracking-tight">{entry.action}</span>
                      <span className="text-[10px] font-black text-[#4182ff] uppercase">{entry.entity}</span>
                      <span className={`text-right text-xs font-black ${entry.type === 'gain' ? 'text-[#66dd8b]' : 'text-gray-500'}`}>
                        {entry.value !== 0 ? `${entry.value > 0 ? '+' : ''}${entry.value.toLocaleString()}` : '----'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && <InventoryContainer items={items} searchTerm={searchTerm} onUpdateStock={updateStock} />}
        </div>
      </main>

      {/* AI SIDEBAR */}
      <aside className="w-80 border-l border-white/5 bg-[#0e0e0e] p-8 flex flex-col h-full shadow-2xl">
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-8 border-b border-white/5 pb-4">AI Advisor</div>
        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar mb-4">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-5 rounded-2xl text-[10px] leading-relaxed ${msg.role === 'assistant' ? 'bg-[#1c1b1b] border-l-2 border-[#adc7ff] text-gray-400' : 'bg-[#adc7ff]/10 text-[#adc7ff]'}`}>{msg.text}</div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </aside>

      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddItem} newItem={newItem} setNewItem={setNewItem} />
    </div>
  );
};

export default Vault;
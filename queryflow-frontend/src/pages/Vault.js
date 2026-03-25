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
  
  // Ledger State
  const [ledger, setLedger] = useState([
    { id: 1, action: "System Initialization", entity: "Node 04", value: 0, status: 'neutral', time: "Start" }
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

  // --- CALCULATIONS (With Safety Defaults) ---
  const safeItems = items || [];
  const totalValuation = safeItems.reduce((acc, i) => acc + (Number(i.price || 0) * Number(i.stock || 0)), 0);
  const totalInvestment = safeItems.reduce((acc, i) => acc + (Number(i.cost_price || 0) * Number(i.stock || 0)), 0);
  const totalUnits = safeItems.reduce((acc, i) => acc + (Number(i.stock || 0)), 0);
  const netProfit = totalValuation - totalInvestment;
  const status = netProfit > 0 ? "PROFIT" : netProfit < 0 ? "LOSS" : "NEUTRAL";
  const statusColor = netProfit > 0 ? "text-[#66dd8b]" : netProfit < 0 ? "text-red-500" : "text-gray-500";

  // Top 5 Profitable Assets Logic
  const topAssets = [...safeItems]
    .sort((a, b) => (b.price - b.cost_price) - (a.price - a.cost_price))
    .slice(0, 5);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/products`, { ...newItem, userId });
      setItems([...items, res.data]);
      setIsAddModalOpen(false);
      setLedger(prev => [{ id: Date.now(), action: "Asset Vaulted", entity: newItem.name, value: newItem.market_price, status: 'neutral', time: "Now" }, ...prev.slice(0, 4)]);
      setNewItem({ name: "", cost_price: "", market_price: "", stock: "" });
    } catch (err) { alert("Vaulting failed."); }
  };

  const updateStock = async (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, (Number(item.stock) || 0) + delta);
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: newStock } : i));
    setLedger(prev => [{ id: Date.now(), action: delta > 0 ? "Restock" : "Sale", entity: item.name, value: delta * item.price, status: delta > 0 ? 'neutral' : 'gain', time: "Sync" }, ...prev.slice(0, 4)]);
    try { await axios.put(`${API_BASE_URL}/api/products/${id}`, { stock: newStock, userId }); } catch (err) { console.error(err); }
  };

  if (isLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-black animate-pulse uppercase tracking-[0.3em]">Syncing Terminal...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white fixed inset-0 overflow-hidden font-['Inter']">
      
      {/* SIDEBAR - Fixed Width */}
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
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black uppercase font-['Manrope'] tracking-tighter">{activeTab}</h2>
            {activeTab === "inventory" && <button onClick={() => setIsAddModalOpen(true)} className="bg-[#4182ff] w-8 h-8 rounded-full flex items-center justify-center material-symbols-outlined text-sm">add</button>}
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1 rounded-full border border-white/5 text-[10px] font-black tracking-widest ${statusColor}`}>STATUS: {status}</div>
            <input className="bg-[#1c1b1b] border-none rounded-xl px-4 py-2 text-[10px] w-64 outline-none uppercase font-black tracking-widest text-gray-400" placeholder="Search Terminal..." onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in duration-500 space-y-6">
              
              {/* TOP STATS - Correct Scaling */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Valuation", val: `$${totalValuation.toLocaleString()}`, color: "text-white" },
                  { label: "Net Profit", val: `${netProfit >= 0 ? '+' : ''}$${netProfit.toLocaleString()}`, color: statusColor },
                  { label: "Tax Reserve", val: `-$${Math.floor(totalValuation * 0.18).toLocaleString()}`, color: "text-red-500/50" },
                  { label: "Total Units", val: totalUnits, color: "text-white" }
                ].map((stat, i) => (
                  <div key={i} className="bg-[#131313] p-6 rounded-[2rem] border border-white/5">
                    <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest block mb-2">{stat.label}</span>
                    <h3 className={`text-xl font-black tracking-tighter ${stat.color}`}>{stat.val}</h3>
                  </div>
                ))}
              </div>

              {/* CENTER GRID: REVENUE & TOP 5 */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col justify-between h-72">
                  <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Realizable Net at Risk</span>
                  <h3 className="text-7xl font-black tracking-tighter leading-none">${(totalValuation - (totalValuation * 0.18)).toLocaleString()}</h3>
                  <div className="absolute bottom-0 left-0 h-1 bg-[#4182ff] w-[75%] shadow-[0_0_15px_#4182ff]"></div>
                </div>

                <div className="bg-[#131313] p-8 rounded-[3rem] border border-white/5 flex flex-col">
                   <h4 className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-6">Top 5 Yield Assets</h4>
                   <div className="space-y-4">
                     {topAssets.map((asset, i) => (
                       <div key={i} className="flex justify-between items-center text-[11px] font-bold">
                         <span className="text-gray-400">{asset.name}</span>
                         <span className="text-[#66dd8b]">↑ ${(asset.price - asset.cost_price).toLocaleString()}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              {/* RECENT INTERACTIONS - FIXED POSITION */}
              <div className="bg-[#131313] rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Terminal Ledger Interactions</span>
                  <span className="text-[8px] text-gray-700 uppercase font-black tracking-widest">Live Node-04 Feed</span>
                </div>
                <div className="p-2 space-y-1">
                  {ledger.map(entry => (
                    <div key={entry.id} className="grid grid-cols-4 items-center p-4 hover:bg-white/[0.01] rounded-2xl transition-all">
                      <span className="text-[10px] font-black text-gray-700">{entry.time}</span>
                      <span className="text-[11px] font-black uppercase tracking-tight">{entry.action}</span>
                      <span className="text-[10px] font-black text-[#4182ff] uppercase italic">{entry.entity}</span>
                      <span className={`text-right text-[11px] font-black ${entry.status === 'gain' ? 'text-[#66dd8b]' : 'text-gray-600'}`}>
                        {entry.value !== 0 ? `${entry.value > 0 ? '+' : ''}${entry.value.toLocaleString()}` : '0.00'}
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

      {/* AI ADVISOR - Fixed Scaling */}
      <aside className="w-80 border-l border-white/5 bg-[#0e0e0e] p-8 flex flex-col h-full shadow-2xl">
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-8 border-b border-white/5 pb-4">CFO AI Advisor</div>
        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar mb-4">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-5 rounded-2xl text-[10px] leading-relaxed ${msg.role === 'assistant' ? 'bg-[#1c1b1b] border-l-2 border-[#adc7ff] text-gray-400' : 'bg-[#adc7ff]/10 text-[#adc7ff] ml-6'}`}>{msg.text}</div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={(e) => { e.preventDefault(); }} className="relative mt-auto">
          <input className="w-full bg-[#1c1b1b] border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white outline-none" placeholder="Query Terminal..." />
          <button className="absolute right-3 top-2.5 text-[#adc7ff] material-symbols-outlined text-base">send</button>
        </form>
      </aside>

      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddItem} newItem={newItem} setNewItem={setNewItem} />
    </div>
  );
};

export default Vault;
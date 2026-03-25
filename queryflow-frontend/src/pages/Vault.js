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
  
  // RESTORED: Recent Interactions Ledger
  const [ledger, setLedger] = useState([
    { id: 1, action: "System Initialization", entity: "Node 04", status: "Verified", value: 0, time: "Start" }
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

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/products`, { ...newItem, userId });
      setItems([...items, res.data]);
      setIsAddModalOpen(false);
      
      // Add to ledger
      const newEntry = { 
        id: Date.now(), action: "Asset Vaulted", entity: newItem.name, 
        status: "Confirmed", value: newItem.market_price, time: "Now" 
      };
      setLedger(prev => [newEntry, ...prev.slice(0, 5)]);
      
      setNewItem({ name: "", cost_price: "", market_price: "", stock: "" });
    } catch (err) { alert("Vaulting failed."); }
  };

  const updateStock = async (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, (Number(item.stock) || 0) + delta);
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: newStock } : i));
    
    // Update Ledger
    const newEntry = { 
      id: Date.now(), 
      action: delta > 0 ? "Inventory Purchase" : "Asset Liquidation", 
      entity: item.name, 
      status: "Verified", 
      value: delta * item.price, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setLedger(prev => [newEntry, ...prev.slice(0, 5)]);

    try { await axios.put(`${API_BASE_URL}/api/products/${id}`, { stock: newStock, userId }); } catch (err) { console.error(err); }
  };

  // CALCULATIONS
  const totalValuation = items.reduce((acc, i) => acc + (Number(i.price || 0) * Number(i.stock || 0)), 0);
  const totalInvestment = items.reduce((acc, i) => acc + (Number(i.cost_price || 0) * Number(i.stock || 0)), 0);
  const totalStocks = items.reduce((acc, i) => acc + (Number(i.stock || 0)), 0);
  const estimatedTax = totalValuation * 0.18;
  const realizableProfit = totalValuation - totalInvestment - estimatedTax;

  if (isLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-black animate-pulse">SYNCHRONIZING TERMINAL...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[#0e0e0e] text-white fixed inset-0 overflow-hidden font-['Inter']">
      
      {/* SIDEBAR */}
      <aside className="w-72 border-r border-white/5 bg-[#0e0e0e] flex flex-col p-10 shrink-0">
        <div className="mb-20 font-black text-2xl font-['Manrope'] tracking-tighter">Vault Terminal</div>
        <nav className="flex-1 space-y-4">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-6 px-8 py-5 rounded-2xl text-sm font-black transition-all capitalize ${activeTab === tab ? 'bg-[#1c1b1b] text-white' : 'text-gray-500 hover:text-white'}`}>
               <span className="material-symbols-outlined">{tab === 'dashboard' ? 'dashboard' : tab === 'inventory' ? 'inventory_2' : 'description'}</span> {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto bg-red-500/5 text-red-900/40 py-4 rounded-xl text-[10px] font-black tracking-[0.4em] uppercase hover:bg-red-500/10 hover:text-red-500">Exit Terminal</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#0e0e0e]">
        {/* HEADER */}
        <header className="min-h-24 border-b border-white/5 flex justify-between items-center px-12">
          <div className="flex items-center gap-6">
            <h2 className="text-3xl font-black capitalize font-['Manrope'] tracking-tighter">{activeTab}</h2>
            {activeTab === "inventory" && (
              <button onClick={() => setIsAddModalOpen(true)} className="bg-[#4182ff] text-white w-8 h-8 rounded-full flex items-center justify-center material-symbols-outlined">add</button>
            )}
          </div>
          <input className="bg-[#1c1b1b] border border-white/5 rounded-xl px-6 py-2 text-xs w-72 outline-none" placeholder="Search Terminal..." onChange={e => setSearchTerm(e.target.value)} />
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          {activeTab === "dashboard" && (
            <div className="space-y-12 animate-in fade-in duration-700">
              {/* 4-COLUMN STATS GRID */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#1c1b1b] p-8 rounded-[2.5rem] border-l-4 border-[#adc7ff]">
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-2">Valuation</span>
                  <h3 className="text-3xl font-black">${totalValuation.toLocaleString()}</h3>
                </div>
                <div className="bg-[#1c1b1b] p-8 rounded-[2.5rem] border-l-4 border-[#66dd8b]">
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-2">Net Profit</span>
                  <h3 className="text-3xl font-black text-[#66dd8b]">${Math.floor(realizableProfit).toLocaleString()}</h3>
                </div>
                <div className="bg-[#1c1b1b] p-8 rounded-[2.5rem] border-l-4 border-[#fbbc00]">
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-2">Tax Reserve</span>
                  <h3 className="text-3xl font-black">-${Math.floor(estimatedTax).toLocaleString()}</h3>
                </div>
                <div className="bg-[#1c1b1b] p-8 rounded-[2.5rem] border-l-4 border-gray-600">
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-2">Total Units</span>
                  <h3 className="text-3xl font-black">{totalStocks.toLocaleString()}</h3>
                </div>
              </div>

              {/* REVENUE AT RISK GRAPHIC */}
              <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 relative overflow-hidden">
                <span className="text-[11px] text-gray-500 uppercase font-black tracking-[0.3em] block mb-4">Realizable Net at Risk</span>
                <h3 className="text-[100px] font-black tracking-tighter leading-none">${Math.floor(realizableProfit).toLocaleString()}</h3>
                <div className="absolute bottom-0 left-0 h-2 bg-[#4182ff] transition-all duration-1000" style={{ width: '75%' }}></div>
              </div>

              {/* RECENT INTERACTIONS LEDGER */}
              <div className="bg-[#131313] rounded-[3rem] border border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                  <h4 className="font-black uppercase text-xs tracking-widest">Recent Ledger Interactions</h4>
                  <span className="text-[10px] text-gray-600">LIVE FEED</span>
                </div>
                <div className="p-4 space-y-2">
                  {ledger.map(entry => (
                    <div key={entry.id} className="flex justify-between items-center p-4 hover:bg-white/[0.02] rounded-2xl transition-all">
                      <div className="flex gap-10 items-center">
                        <span className="text-[10px] font-black text-[#4182ff] w-24">{entry.time}</span>
                        <span className="text-sm font-bold text-gray-300">{entry.action}</span>
                        <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-gray-500 uppercase font-black">{entry.entity}</span>
                      </div>
                      <span className={`font-black ${entry.value >= 0 ? 'text-[#66dd8b]' : 'text-red-500'}`}>
                        {entry.value !== 0 && (entry.value > 0 ? `+${entry.value.toLocaleString()}` : entry.value.toLocaleString())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && <InventoryContainer items={items} searchTerm={searchTerm} onUpdateStock={updateStock} />}
          {activeTab === "reports" && <div className="text-center text-gray-600 mt-20">Full Audit Logic standing by...</div>}
        </div>
      </main>

      {/* AI ADVISOR */}
      <aside className="w-96 border-l border-white/5 bg-[#0e0e0e] p-10 flex flex-col h-full shadow-2xl">
        <div className="uppercase font-black text-[11px] tracking-[0.4em] text-gray-600 mb-10 border-b border-white/5 pb-6">AI Fiscal Advisor</div>
        <div className="flex-1 overflow-y-auto space-y-6 mb-6">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-6 rounded-[2rem] text-xs leading-relaxed ${msg.role === 'assistant' ? 'bg-[#1c1b1b] border-l-4 border-[#adc7ff] text-gray-400' : 'bg-[#adc7ff]/10 text-[#adc7ff] ml-10'}`}>{msg.text}</div>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); /* Chat Logic */ }} className="relative mt-auto">
          <input className="w-full bg-[#1c1b1b] border border-white/5 rounded-2xl px-6 py-5 text-xs text-white outline-none" placeholder="Query ledger data..." />
          <button className="absolute right-4 top-4 text-[#adc7ff] material-symbols-outlined">send</button>
        </form>
      </aside>

      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddItem} newItem={newItem} setNewItem={setNewItem} />
    </div>
  );
};

export default Vault;
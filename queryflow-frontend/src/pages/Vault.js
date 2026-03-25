import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import InventoryContainer from "../components/InventoryContainer";
import AddAssetModal from "../components/AddAssetModal";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]); // Initialize as empty array
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", cost_price: "", market_price: "", stock: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', text: "Terminal Secure. CFO AI standing by." }]);
  const [userQuery, setUserQuery] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => { 
    if (userId) {
      fetchItems(); 
    } else {
      setIsLoading(false); // Stop loading if no user
    }
  }, [userId]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { 
      console.error("Fetch Error:", err);
      setItems([]); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/products`, { ...newItem, userId });
      setItems([...items, res.data]);
      setIsAddModalOpen(false);
      setNewItem({ name: "", cost_price: "", market_price: "", stock: "" });
    } catch (err) { alert("Vaulting failed. Check server connection."); }
  };

  const updateStock = async (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, (Number(item.stock) || 0) + delta);
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: newStock } : i));
    try { await axios.put(`${API_BASE_URL}/api/products/${id}`, { stock: newStock, userId }); } catch (err) { console.error(err); }
  };

  // Safe Math
  const totalValuation = items.reduce((acc, i) => acc + (Number(i.price || 0) * Number(i.stock || 0)), 0);
  const totalInvestment = items.reduce((acc, i) => acc + (Number(i.cost_price || 0) * Number(i.stock || 0)), 0);
  const realizableProfit = totalValuation - totalInvestment - (totalValuation * 0.18);

  const handleChat = (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    const newHist = [...chatHistory, { role: 'user', text: userQuery }];
    setChatHistory(newHist);
    setUserQuery("");
    setTimeout(() => {
      setChatHistory([...newHist, { role: 'assistant', text: `Audit Complete: System Valuation is $${totalValuation.toLocaleString()}.` }]);
    }, 1000);
  };

  // LOADING STATE UI
  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#0e0e0e] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#adc7ff]/20 border-t-[#adc7ff] rounded-full animate-spin mb-4"></div>
        <p className="text-[#adc7ff] font-black tracking-widest uppercase text-xs">Synchronizing Vault...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[#0e0e0e] text-white fixed inset-0 overflow-hidden">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-64 border-r border-white/5 bg-[#131313] flex-col p-6 shrink-0 shadow-2xl">
        <div className="mb-10 font-black text-xl font-['Manrope'] tracking-tighter text-[#adc7ff]">Vault Terminal</div>
        <nav className="flex-1 space-y-2">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black transition-all capitalize ${activeTab === tab ? 'bg-[#adc7ff]/10 text-[#adc7ff]' : 'text-gray-500 hover:text-white'}`}>
               <span className="material-symbols-outlined">{tab === 'dashboard' ? 'dashboard' : tab === 'inventory' ? 'inventory_2' : 'description'}</span> {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto bg-red-500/10 text-red-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Exit Terminal</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="min-h-16 border-b border-white/5 flex justify-between items-center px-6 md:px-10 bg-[#131313]/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black capitalize font-['Manrope']">{activeTab}</h2>
            {activeTab === "inventory" && (
              <button onClick={() => setIsAddModalOpen(true)} className="bg-[#4182ff] text-white p-2 rounded-lg material-symbols-outlined text-sm">add</button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <input 
              className="hidden md:block bg-[#1c1b1b] border-none rounded-xl px-4 py-2 text-xs w-64 outline-none" 
              placeholder="Search assets..." 
              onChange={e => setSearchTerm(e.target.value)} 
            />
            <button onClick={() => setIsAdvisorOpen(!isAdvisorOpen)} className="md:hidden p-2 bg-[#adc7ff]/10 rounded-lg text-[#adc7ff] material-symbols-outlined">smart_toy</button>
          </div>
        </header>

        {/* MOBILE TABS */}
        <div className="flex md:hidden bg-[#131313] border-b border-white/5">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'text-[#adc7ff] border-b-2 border-[#adc7ff]' : 'text-gray-500'}`}>{tab}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
              <div className="bg-[#1c1b1b] p-8 rounded-3xl border-l-4 border-[#adc7ff] shadow-xl">
                <span className="text-[10px] text-gray-500 uppercase block mb-1">Total Valuation</span>
                <h3 className="text-3xl font-black">${totalValuation.toLocaleString()}</h3>
              </div>
              <div className="bg-[#1c1b1b] p-8 rounded-3xl border-l-4 border-[#66dd8b] shadow-xl">
                <span className="text-[10px] text-gray-500 uppercase block mb-1">Projected Profit</span>
                <h3 className="text-3xl font-black text-[#66dd8b]">${Math.floor(realizableProfit).toLocaleString()}</h3>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
             <InventoryContainer items={items} searchTerm={searchTerm} onUpdateStock={updateStock} />
          )}

          {activeTab === "reports" && (
            <div className="bg-[#1c1b1b] p-10 md:p-16 rounded-[4rem] border border-white/5 shadow-2xl max-w-3xl mx-auto text-center">
               <h3 className="text-3xl font-black mb-4">Fiscal Audit</h3>
               <p className="text-gray-500 mb-10 uppercase text-[10px] tracking-widest">Year-to-Date Performance</p>
               <div className="space-y-6 text-left border-t border-white/5 pt-10">
                  <div className="flex justify-between items-center"><span className="text-gray-400">Gross Asset Value</span><span className="font-black text-xl">${totalValuation.toLocaleString()}</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-400">Capital Expenditure</span><span className="font-black text-xl text-red-400">-${totalInvestment.toLocaleString()}</span></div>
                  <div className="bg-[#66dd8b]/10 p-8 rounded-3xl mt-8 border border-[#66dd8b]/20 flex justify-between items-center">
                    <span className="text-[#66dd8b] font-black text-xs uppercase">Net Realizable</span>
                    <span className="font-black text-4xl text-[#66dd8b]">${Math.floor(realizableProfit).toLocaleString()}</span>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* AI ADVISOR */}
      <aside className={`${isAdvisorOpen ? 'fixed inset-0 z-[80]' : 'hidden'} md:relative md:flex md:w-80 bg-[#1c1b1b] border-l border-white/5 p-6 flex-col h-full shrink-0 shadow-2xl`}>
        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
          <span className="uppercase font-black text-[10px] tracking-widest text-gray-500">AI Fiscal Advisor</span>
          <button onClick={() => setIsAdvisorOpen(false)} className="md:hidden text-gray-500 material-symbols-outlined">close</button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar mb-4">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-4 rounded-2xl text-[11px] leading-relaxed ${msg.role === 'assistant' ? 'bg-black/30 border-l-2 border-[#adc7ff] text-gray-400' : 'bg-[#adc7ff]/10 text-[#adc7ff] ml-8'}`}>{msg.text}</div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleChat} className="relative">
          <input type="text" value={userQuery} onChange={e => setUserQuery(e.target.value)} placeholder="Query ledger..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-white outline-none" />
          <button type="submit" className="absolute right-3 top-2.5 text-[#adc7ff] material-symbols-outlined">send</button>
        </form>
      </aside>

      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddItem} newItem={newItem} setNewItem={setNewItem} />
    </div>
  );
};

export default Vault;
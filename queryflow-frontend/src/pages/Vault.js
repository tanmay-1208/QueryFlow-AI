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
      setNewItem({ name: "", cost_price: "", market_price: "", stock: "" });
    } catch (err) { alert("Vaulting failed."); }
  };

  const updateStock = async (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, (Number(item.stock) || 0) + delta);
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: newStock } : i));
    try { await axios.put(`${API_BASE_URL}/api/products/${id}`, { stock: newStock, userId }); } catch (err) { console.error(err); }
  };

  const totalValuation = items.reduce((acc, i) => acc + (Number(i.price || 0) * Number(i.stock || 0)), 0);
  const totalInvestment = items.reduce((acc, i) => acc + (Number(i.cost_price || 0) * Number(i.stock || 0)), 0);
  const realizableProfit = totalValuation - totalInvestment - (totalValuation * 0.18);

  const handleChat = (e) => {
    e.preventDefault();
    const newHist = [...chatHistory, { role: 'user', text: userQuery }];
    setChatHistory(newHist);
    setUserQuery("");
    setTimeout(() => {
      setChatHistory([...newHist, { role: 'assistant', text: `Audit Complete: System Valuation is $${totalValuation.toLocaleString()}.` }]);
    }, 1000);
  };

  if (isLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-black animate-pulse">BOOTING...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[#0e0e0e] text-white fixed inset-0 overflow-hidden font-['Inter']">
      
      <aside className="hidden md:flex md:w-80 border-r border-white/5 bg-[#0e0e0e] flex-col p-10 shrink-0">
        <div className="mb-20 font-black text-2xl font-['Manrope'] tracking-tighter">Vault Terminal</div>
        <nav className="flex-1 space-y-4">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-6 px-8 py-5 rounded-[2rem] text-sm font-black transition-all capitalize ${activeTab === tab ? 'bg-[#1c1b1b] text-white border border-white/5 shadow-2xl' : 'text-gray-500 hover:text-white'}`}>
               <span className="material-symbols-outlined">{tab === 'dashboard' ? 'dashboard' : tab === 'inventory' ? 'inventory_2' : 'description'}</span> {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto bg-red-500/5 text-red-900/40 py-4 rounded-2xl text-[10px] font-black tracking-[0.4em] uppercase hover:bg-red-500/10 hover:text-red-500 transition-all">Exit Terminal</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#0e0e0e]">
        <header className="min-h-32 border-b border-white/5 flex justify-between items-center px-16">
          <div className="flex items-center gap-6">
            <h2 className="text-4xl font-black capitalize font-['Manrope'] tracking-tighter">{activeTab}</h2>
            {activeTab === "inventory" && (
              <button onClick={() => setIsAddModalOpen(true)} className="bg-[#4182ff] text-white w-10 h-10 rounded-full flex items-center justify-center material-symbols-outlined text-xl hover:scale-110 transition-all">add</button>
            )}
          </div>
          <input className="bg-[#1c1b1b] border border-white/5 rounded-2xl px-6 py-3 text-xs w-80 outline-none focus:border-white/20 transition-all" placeholder="Search assets..." onChange={e => setSearchTerm(e.target.value)} />
        </header>

        <div className="flex-1 overflow-y-auto p-16 custom-scrollbar">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-700">
              <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border-l-[6px] border-[#adc7ff] shadow-2xl">
                <span className="text-[11px] text-gray-600 uppercase font-black tracking-[0.3em] block mb-4">Total Valuation</span>
                <h3 className="text-[80px] font-black tracking-tighter leading-none">${totalValuation.toLocaleString()}</h3>
              </div>
              <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border-l-[6px] border-[#66dd8b] shadow-2xl">
                <span className="text-[11px] text-gray-600 uppercase font-black tracking-[0.3em] block mb-4">Projected Profit</span>
                <h3 className="text-[80px] font-black tracking-tighter leading-none text-[#66dd8b]">${Math.floor(realizableProfit).toLocaleString()}</h3>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
             <InventoryContainer items={items} searchTerm={searchTerm} onUpdateStock={updateStock} />
          )}

          {activeTab === "reports" && (
            <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom duration-700">
               <div className="bg-[#1c1b1b] p-20 rounded-[5rem] border border-white/5 shadow-2xl text-center">
                  <h3 className="text-5xl font-black mb-4 font-['Manrope'] tracking-tighter">Fiscal Audit</h3>
                  <p className="text-gray-600 uppercase font-black text-[10px] tracking-[0.5em] mb-16">Year-to-Date Terminal Performance</p>
                  <div className="space-y-8 text-left border-t border-white/5 pt-16">
                     <div className="flex justify-between items-center"><span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Gross Asset Value</span><span className="font-black text-4xl tracking-tighter">${totalValuation.toLocaleString()}</span></div>
                     <div className="flex justify-between items-center"><span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Capital Expenditure</span><span className="font-black text-4xl tracking-tighter text-red-500">-${totalInvestment.toLocaleString()}</span></div>
                     <div className="bg-[#66dd8b]/5 p-12 rounded-[3.5rem] mt-12 border border-[#66dd8b]/10 flex justify-between items-center">
                       <span className="text-[#66dd8b] font-black text-sm uppercase tracking-[0.2em]">Net Realizable</span>
                       <span className="font-black text-6xl tracking-tighter text-[#66dd8b]">${Math.floor(realizableProfit).toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* AI ADVISOR */}
      <aside className="w-96 border-l border-white/5 bg-[#0e0e0e] p-10 flex flex-col h-full shadow-2xl">
        <div className="uppercase font-black text-[11px] tracking-[0.4em] text-gray-600 mb-10 border-b border-white/5 pb-6">AI Fiscal Advisor</div>
        <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar mb-6">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-6 rounded-[2rem] text-xs leading-relaxed ${msg.role === 'assistant' ? 'bg-[#1c1b1b] border-l-4 border-[#adc7ff] text-gray-400' : 'bg-[#adc7ff]/10 text-[#adc7ff] ml-10'}`}>{msg.text}</div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleChat} className="relative mt-auto">
          <input type="text" value={userQuery} onChange={e => setUserQuery(e.target.value)} placeholder="Query terminal data..." className="w-full bg-[#1c1b1b] border border-white/5 rounded-2xl px-6 py-5 text-xs text-white outline-none focus:border-white/20 transition-all" />
          <button type="submit" className="absolute right-4 top-4 text-[#adc7ff] material-symbols-outlined">send</button>
        </form>
      </aside>

      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddItem} newItem={newItem} setNewItem={setNewItem} />
    </div>
  );
};

export default Vault;
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import InventoryContainer from "../components/InventoryContainer";
import AddAssetModal from "../components/AddAssetModal";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Terminal States
  const [userQuery, setUserQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', text: "Terminal Secure. AI standing by." }]);
  const [ledger, setLedger] = useState([
    { id: 1, type: 'SYS', action: 'Terminal Sync', entity: 'NODE-04', val: 'Success', time: '08:25' }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => { if (userId) fetchItems(); }, [userId]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { 
      console.error("Fetch Failure:", err);
      setItems([]); 
    } finally { 
      setIsLoading(false); 
    }
  };

  // --- ACTIONS ---
  const handleOnAdd = () => {
    fetchItems(); // Reload data
    setIsAddModalOpen(false); // Close modal
    setLedger(prev => [{ id: Date.now(), type: 'SYS', action: 'Asset Created', entity: 'VAULT', val: 'NEW', time: 'Now' }, ...prev.slice(0, 4)]);
  };

  const updateStock = async (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, (item.stock || 0) + delta);
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: newStock } : i));
    try { await axios.put(`${API_BASE_URL}/api/products/${id}`, { stock: newStock, userId }); } catch (err) { console.error(err); }
  };

  const deleteAsset = async (id) => {
    if (!window.confirm("Confirm Liquidation?")) return;
    setItems(prev => prev.filter(i => i.id !== id));
    try { await axios.delete(`${API_BASE_URL}/api/products/${id}?userId=${userId}`); } catch (err) { console.error(err); }
  };

  // --- MATH ---
  const safeVal = (v) => isNaN(parseFloat(v)) ? 0 : parseFloat(v);
  const totalValuation = items.reduce((acc, i) => acc + (safeVal(i.price) * safeVal(i.stock)), 0);
  const totalInvestment = items.reduce((acc, i) => acc + (safeVal(i.cost_price) * safeVal(i.stock)), 0);
  const tax = totalValuation * 0.18;
  const net = totalValuation - totalInvestment - tax;

  if (isLoading) return <div className="h-screen bg-[#0e0e0e] flex items-center justify-center text-[#4182ff] font-black animate-pulse uppercase text-xs">Syncing Terminal...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white fixed inset-0 overflow-hidden font-['Inter']">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#0e0e0e] flex flex-col p-8 shrink-0">
        <div className="mb-12 font-black text-xl italic text-[#4182ff]">Vault</div>
        <nav className="flex-1 space-y-2">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#1c1b1b] text-white' : 'text-gray-600 hover:text-white'}`}>
               <span className="material-symbols-outlined text-sm">{tab === 'dashboard' ? 'grid_view' : tab === 'inventory' ? 'payments' : 'analytics'}</span> {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto text-red-900/40 text-[9px] font-black uppercase hover:text-red-500">Terminate</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
        <header className="min-h-20 border-b border-white/5 flex justify-between items-center px-10">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-black uppercase tracking-tighter">{activeTab}</h2>
            {activeTab === "inventory" && (
              <button 
                onClick={() => setIsAddModalOpen(true)} 
                className="bg-[#4182ff] w-8 h-8 rounded-full flex items-center justify-center material-symbols-outlined text-sm hover:scale-110 cursor-pointer"
              >
                add
              </button>
            )}
          </div>
          <input className="bg-[#131313] border border-white/5 rounded-xl px-4 py-2 text-[10px] w-64 outline-none uppercase font-black text-gray-500" placeholder="Search..." onChange={e => setSearchTerm(e.target.value)} />
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-8">
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in space-y-8">
              {/* STATS */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { l: "Valuation", v: `$${totalValuation.toLocaleString()}`, c: "text-white" },
                  { l: "Net Profit", v: `$${Math.floor(net).toLocaleString()}`, c: "text-[#66dd8b]" },
                  { l: "Tax (18%)", v: `-$${Math.floor(tax).toLocaleString()}`, c: "text-red-900/40" },
                  { l: "Assets", v: items.length, c: "text-white" }
                ].map((s, i) => (
                  <div key={i} className="bg-[#131313] p-6 rounded-3xl border border-white/5">
                    <span className="text-[9px] text-gray-600 uppercase font-black block mb-2 tracking-widest">{s.l}</span>
                    <h3 className={`text-xl font-black truncate ${s.c}`}>{s.v}</h3>
                  </div>
                ))}
              </div>

              {/* REVENUE */}
              <div className="bg-[#1c1b1b] p-10 rounded-[4rem] border border-white/5 relative overflow-hidden flex flex-col justify-between h-80 shadow-2xl">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Realizable Portfolio Net</span>
                <h3 className="text-7xl font-black tracking-tighter leading-none text-white">${(totalValuation - tax).toLocaleString()}</h3>
                <div className="absolute bottom-0 left-0 h-1.5 w-[80%] bg-[#4182ff] shadow-[0_0_20px_#4182ff]"></div>
              </div>
            </div>
          )}
          {activeTab === "inventory" && <InventoryContainer items={items} searchTerm={searchTerm} onUpdateStock={updateStock} onDeleteAsset={deleteAsset} />}
        </div>
      </main>

      {/* AI SIDEBAR */}
      <aside className="w-80 border-l border-white/5 bg-[#0e0e0e] flex flex-col p-8 shrink-0">
        <div className="text-[10px] font-black uppercase text-gray-700 mb-8 border-b border-white/5 pb-4">CFO AI Analysis</div>
        <div className="flex-1 overflow-y-auto space-y-4">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-5 rounded-2xl text-[10px] leading-relaxed ${msg.role === 'assistant' ? 'bg-[#131313] text-gray-400' : 'bg-[#4182ff]/10 text-[#4182ff]'}`}>{msg.text}</div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </aside>

      {/* THE MODAL CALL - MUST MATCH PROPS EXACTLY */}
      {isAddModalOpen && (
        <AddAssetModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleOnAdd} 
          userId={userId} 
        />
      )}
    </div>
  );
};

export default Vault;
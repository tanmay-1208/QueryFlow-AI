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
  
  // AI & Ledger States
  const [userQuery, setUserQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', text: "Terminal Secure. CFO AI standing by." }]);
  const [ledger, setLedger] = useState([
    { id: 1, type: 'SYS', action: 'Terminal Sync', entity: 'NODE-04', val: 'Success', time: '08:40' }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => { 
    if (userId) fetchItems(); 
  }, [userId]);

  useEffect(() => { 
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [chatHistory]);

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

  // --- REFRESH HANDLER (The Fix for Execute) ---
  const handleOnAdd = (newlyCreatedAsset) => {
    // 1. Update items state immediately with the new object from backend
    setItems(prev => [newlyCreatedAsset, ...prev]);
    
    // 2. Log to Ledger
    setLedger(prev => [{ 
      id: Date.now(), 
      type: 'IN', 
      action: 'Asset Vaulted', 
      entity: newlyCreatedAsset.name.toUpperCase(), 
      val: `+${newlyCreatedAsset.stock}`, 
      time: 'Now' 
    }, ...prev.slice(0, 4)]);

    // 3. Close the modal
    setIsAddModalOpen(false);
  };

  // --- ACTIONS ---
  const updateStock = async (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, (item.stock || 0) + delta);
    
    // Optimistic UI update
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: newStock } : i));
    
    try { 
      await axios.put(`${API_BASE_URL}/api/products/${id}`, { stock: newStock, userId }); 
    } catch (err) { 
      console.error("Update failed:", err);
      fetchItems(); // Rollback on error
    }
  };

  const deleteAsset = async (id) => {
    if (!window.confirm("Confirm Permanent Liquidation?")) return;
    const itemToDelete = items.find(i => i.id === id);
    
    // UI update
    setItems(prev => prev.filter(i => i.id !== id));
    
    setLedger(prev => [{ 
      id: Date.now(), type: 'OUT', action: 'Asset Deleted', entity: itemToDelete?.name || '---', val: 'DEL', time: 'Now' 
    }, ...prev.slice(0, 4)]);

    try { 
      await axios.delete(`${API_BASE_URL}/api/products/${id}?userId=${userId}`); 
    } catch (err) { 
      console.error("Delete failed:", err);
      fetchItems(); 
    }
  };

  // --- CALCULATIONS ---
  const safeVal = (v) => isNaN(parseFloat(v)) ? 0 : parseFloat(v);
  const totalValuation = items.reduce((acc, i) => acc + (safeVal(i.price) * safeVal(i.stock)), 0);
  const totalInvestment = items.reduce((acc, i) => acc + (safeVal(i.cost_price) * safeVal(i.stock)), 0);
  const tax = totalValuation * 0.18;
  const net = totalValuation - totalInvestment - tax;

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
      setChatHistory([...newHist, { role: 'assistant', text: `Audit Complete. Asset Valuation: $${totalValuation.toLocaleString()}. System status Bullish.` }]);
    }, 800);
  };

  if (isLoading) return (
    <div className="h-screen bg-[#0e0e0e] flex flex-col items-center justify-center text-[#4182ff] font-black animate-pulse uppercase text-xs tracking-[0.5em]">
      Decrypting Vault Terminal
    </div>
  );

  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white fixed inset-0 overflow-hidden font-['Inter']">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#0e0e0e] flex flex-col p-8 shrink-0">
        <div className="mb-12 font-black text-xl italic text-[#4182ff]">Vault</div>
        <nav className="flex-1 space-y-2">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#1c1b1b] text-white shadow-xl' : 'text-gray-600 hover:text-white'}`}>
               <span className="material-symbols-outlined text-sm">{tab === 'dashboard' ? 'grid_view' : tab === 'inventory' ? 'payments' : 'analytics'}</span> {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto text-red-900/40 text-[9px] font-black uppercase hover:text-red-500 transition-colors">Terminate</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
        <header className="min-h-20 border-b border-white/5 flex justify-between items-center px-10">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-black uppercase tracking-tighter">{activeTab}</h2>
            {activeTab === "inventory" && (
              <button onClick={() => setIsAddModalOpen(true)} className="bg-[#4182ff] w-8 h-8 rounded-full flex items-center justify-center material-symbols-outlined text-sm cursor-pointer hover:scale-110 transition-transform">add</button>
            )}
          </div>
          <input className="bg-[#131313] border border-white/5 rounded-xl px-4 py-2 text-[10px] w-64 outline-none uppercase font-black text-gray-500" placeholder="Search Terminal..." onChange={e => setSearchTerm(e.target.value)} />
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in space-y-10">
              {/* TOP STATS */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Valuation", val: `$${totalValuation.toLocaleString()}`, color: "text-white" },
                  { label: "Net Profit", val: `$${Math.floor(net).toLocaleString()}`, color: "text-[#66dd8b]" },
                  { label: "Tax Provision", val: `-$${Math.floor(tax).toLocaleString()}`, color: "text-red-900/40" },
                  { label: "Asset Count", val: items.length, color: "text-white" }
                ].map((s, i) => (
                  <div key={i} className="bg-[#131313] p-6 rounded-3xl border border-white/5 shadow-2xl">
                    <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest block mb-2">{s.label}</span>
                    <h3 className={`text-xl font-black truncate tracking-tighter ${s.color}`}>{s.val}</h3>
                  </div>
                ))}
              </div>

              {/* REVENUE & TOP 5 */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col justify-between h-80 shadow-2xl">
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Realizable Institutional Net</span>
                  <h3 className="text-6xl font-black tracking-tighter leading-none text-white truncate max-w-full">${(totalValuation - tax).toLocaleString()}</h3>
                  <div className="absolute bottom-0 left-0 h-1.5 w-[80%] bg-[#4182ff] shadow-[0_0_20px_#4182ff]"></div>
                </div>

                <div className="bg-[#131313] p-8 rounded-[3rem] border border-white/5 shadow-xl">
                   <h4 className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-6 border-b border-white/5 pb-2">High-Yield Index</h4>
                   <div className="space-y-4">
                     {topAssets.map((asset, i) => (
                       <div key={i} className="flex justify-between items-center text-[10px] font-bold">
                         <span className="text-gray-400 truncate w-24">{asset.name}</span>
                         <span className="text-[#66dd8b]">↑ ${(safeVal(asset.price)-safeVal(asset.cost_price)).toLocaleString()}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              {/* RECENT LEDGER */}
              <div className="bg-[#131313] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">Terminal Ledger Interactions</span>
                  <span className="text-[8px] text-[#66dd8b] uppercase font-black tracking-widest animate-pulse italic">Live Node Active</span>
                </div>
                <div className="p-2 space-y-1">
                  {ledger.map(entry => (
                    <div key={entry.id} className="grid grid-cols-4 items-center p-4 hover:bg-white/[0.01] rounded-xl transition-all text-[11px] font-black">
                      <span className="text-gray-700">{entry.time}</span>
                      <span className="text-[9px] w-fit bg-white/5 px-2 py-0.5 rounded text-gray-600 uppercase tracking-widest">{entry.type}</span>
                      <span className="uppercase truncate">{entry.action} <span className="text-[#4182ff] ml-1">[{entry.entity}]</span></span>
                      <span className="text-right text-gray-500">{entry.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <InventoryContainer 
              items={items} 
              searchTerm={searchTerm} 
              onUpdateStock={updateStock} 
              onDeleteAsset={deleteAsset} 
            />
          )}
          
          {activeTab === "reports" && (
            <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4">
               <div className="bg-[#131313] p-16 rounded-[4rem] border border-white/5 shadow-2xl text-center">
                  <h3 className="text-4xl font-black mb-12 uppercase tracking-tighter">Fiscal Audit</h3>
                  <div className="space-y-6 border-t border-white/5 pt-12 text-left">
                     <div className="flex justify-between items-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                       <span>Gross Asset Value</span>
                       <span className="text-white text-2xl tracking-tighter">${totalValuation.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                       <span>Tax Liability (18%)</span>
                       <span className="text-red-900/40 text-2xl tracking-tighter">-${Math.floor(tax).toLocaleString()}</span>
                     </div>
                     <div className="bg-[#66dd8b]/5 p-10 rounded-[3rem] mt-10 border border-[#66dd8b]/10 flex justify-between items-center">
                       <span className="text-[#66dd8b] font-black text-[10px] uppercase tracking-[0.3em]">Net Realizable Yield</span>
                       <span className="font-black text-5xl tracking-tighter text-[#66dd8b]">${Math.floor(net).toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* AI SIDEBAR */}
      <aside className="w-80 border-l border-white/5 bg-[#0e0e0e] flex flex-col p-8 shrink-0 shadow-2xl">
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-8 border-b border-white/5 pb-4">CFO AI Analysis</div>
        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar mb-4">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-5 rounded-2xl text-[10px] leading-relaxed ${msg.role === 'assistant' ? 'bg-[#131313] border border-white/5 text-gray-400' : 'bg-[#4182ff]/10 text-[#adc7ff]'}`}>{msg.text}</div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleChat} className="relative mt-auto">
          <input 
            className="w-full bg-[#131313] border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white outline-none focus:border-[#4182ff]/30" 
            placeholder="Query terminal..." 
            value={userQuery} 
            onChange={(e) => setUserQuery(e.target.value)} 
          />
          <button type="submit" className="absolute right-3 top-2.5 text-[#4182ff] material-symbols-outlined text-base">send</button>
        </form>
      </aside>

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
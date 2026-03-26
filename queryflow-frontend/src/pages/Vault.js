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
  const [serverStatus, setServerStatus] = useState("checking");
  
  const [chatHistory] = useState([{ role: 'assistant', text: "Terminal Secure. CFO AI standing by." }]);
  const [ledger, setLedger] = useState([
    { id: 1, type: 'SYS', action: 'Terminal Sync', entity: 'NODE-04', val: 'Success', time: '13:10' }
  ]);

  useEffect(() => { if (userId) fetchItems(); }, [userId]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
      setServerStatus("online");
    } catch (err) { 
      setServerStatus("offline");
      setItems([]); 
    } finally { setIsLoading(false); }
  };

  // --- CRITICAL FIX: handleOnAdd with Validation ---
  const handleOnAdd = (newAsset) => {
    if (!newAsset || !newAsset.name) {
      setIsAddModalOpen(false);
      return;
    }

    // Ensure all incoming data are actual numbers to prevent math crashes
    const sanitizedAsset = {
      ...newAsset,
      price: parseFloat(newAsset.price) || 0,
      cost_price: parseFloat(newAsset.cost_price) || 0,
      stock: parseInt(newAsset.stock) || 0
    };

    setItems(prev => [sanitizedAsset, ...prev]);
    setIsAddModalOpen(false);
    
    setLedger(prev => [{ 
      id: Date.now(), 
      type: 'IN', 
      action: 'Vault Entry', 
      entity: sanitizedAsset.name.substring(0, 8).toUpperCase(), 
      val: 'NEW', 
      time: 'Now' 
    }, ...prev.slice(0, 4)]);
  };

  const updateStock = async (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, (item.stock || 0) + delta);
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: newStock } : i));
    try { await axios.put(`${API_BASE_URL}/api/products/${id}`, { stock: newStock, userId }); } catch (err) { setServerStatus("offline"); }
  };

  const deleteAsset = async (id) => {
    if (!window.confirm("Confirm Permanent Liquidation?")) return;
    setItems(prev => prev.filter(i => i.id !== id));
    try { await axios.delete(`${API_BASE_URL}/api/products/${id}?userId=${userId}`); } catch (err) { setServerStatus("offline"); }
  };

  // --- MATH SAFETY HELPERS ---
  const safeVal = (v) => {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  };

  // Use optional chaining and safety helpers to prevent "Black Screen" crash
  const grossVal = items?.reduce((acc, i) => acc + (safeVal(i.price) * safeVal(i.stock)), 0) || 0;
  const costVal = items?.reduce((acc, i) => acc + (safeVal(i.cost_price) * safeVal(i.stock)), 0) || 0;
  const tax = grossVal * 0.18;
  const net = grossVal - costVal - tax;

  if (isLoading) return <div className="h-screen bg-[#0e0e0e] flex items-center justify-center text-[#4182ff] font-black animate-pulse uppercase text-xs">Syncing Terminal...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white fixed inset-0 overflow-hidden font-['Inter']">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#0e0e0e] flex flex-col p-8 shrink-0">
        <div className="mb-8 font-black text-xl italic text-[#4182ff]">Vault</div>

        <div className={`mb-10 flex items-center gap-2 px-4 py-2 rounded-full border w-fit ${serverStatus === 'online' ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${serverStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className={`text-[8px] font-black uppercase tracking-widest ${serverStatus === 'online' ? 'text-green-500' : 'text-red-500'}`}>
            Node: {serverStatus}
          </span>
        </div>

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
              <button onClick={() => setIsAddModalOpen(true)} className="bg-[#4182ff] w-8 h-8 rounded-full flex items-center justify-center material-symbols-outlined text-sm cursor-pointer hover:scale-110 active:scale-95 transition-all">add</button>
            )}
          </div>
          <input className="bg-[#131313] border border-white/5 rounded-xl px-4 py-2 text-[10px] w-64 outline-none uppercase font-black text-gray-500" placeholder="Search..." onChange={e => setSearchTerm(e.target.value)} />
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in space-y-10">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Valuation", val: `$${grossVal.toLocaleString()}`, col: "text-white" },
                  { label: "Net Profit", val: `$${Math.floor(net).toLocaleString()}`, col: "text-[#66dd8b]" },
                  { label: "Tax Provision", val: `-$${Math.floor(tax).toLocaleString()}`, col: "text-red-900/40" },
                  { label: "Asset Count", val: items?.length || 0, col: "text-white" }
                ].map((s, i) => (
                  <div key={i} className="bg-[#131313] p-6 rounded-3xl border border-white/5">
                    <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest block mb-2">{s.label}</span>
                    <h3 className={`text-xl font-black truncate tracking-tighter ${s.col}`}>{s.val}</h3>
                  </div>
                ))}
              </div>

              <div className="bg-[#1c1b1b] p-12 rounded-[4.5rem] border border-white/5 relative overflow-hidden flex flex-col justify-between h-80 shadow-2xl">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Realizable Institutional Net</span>
                <h3 className="text-7xl font-black tracking-tighter leading-none text-white truncate max-w-full">${(grossVal - tax).toLocaleString()}</h3>
                <div className={`absolute bottom-0 left-0 h-1.5 w-[80%] ${serverStatus === 'online' ? 'bg-[#4182ff]' : 'bg-red-500'}`}></div>
              </div>

              <div className="bg-[#131313] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="px-8 py-5 border-b border-white/5 text-[9px] font-black uppercase text-gray-600">Terminal Ledger</div>
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
              items={items || []} 
              searchTerm={searchTerm} 
              onUpdateStock={updateStock} 
              onDeleteAsset={deleteAsset} 
            />
          )}
        </div>
      </main>

      <aside className="w-80 border-l border-white/5 bg-[#0e0e0e] flex flex-col p-8 shrink-0 shadow-2xl">
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-8 border-b border-white/5 pb-4">CFO AI Analysis</div>
        <div className="flex-1 space-y-4">
            {chatHistory.map((m, i) => <div key={i} className="bg-[#131313] p-5 rounded-2xl text-[10px] text-gray-500 italic leading-relaxed">{m.text}</div>)}
        </div>
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
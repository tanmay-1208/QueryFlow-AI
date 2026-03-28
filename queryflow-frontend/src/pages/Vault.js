import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import InventoryContainer from "../components/InventoryContainer";
import AddAssetModal from "../components/AddAssetModal";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [chatLog, setChatLog] = useState([
    { role: "agent", text: "[SYSTEM]: Neural link stable. QueryFlow Agent v5.0 initialized. Ready for audit." }
  ]);

  // --- DATA SYNC ---
  const fetchItems = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Vault Retrieval Error:", err);
    }
  }, [userId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // --- HANDLERS ---
  const handleOnAdd = (newAsset) => {
    setItems((prev) => [newAsset, ...prev]);
  };

  const handleDeleteAsset = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const handleUpdateStock = async (id, change) => {
    try {
      const item = items.find(i => i.id === id);
      if (!item) return;
      const newStock = (item.stock || 0) + change;
      if (newStock < 0) return;
      const updated = { ...item, stock: newStock };
      await axios.put(`${API_BASE_URL}/api/products/${id}`, updated);
      setItems(prev => prev.map(i => i.id === id ? updated : i));
    } catch (err) {
      console.error("Stock Update Error:", err);
    }
  };

  const handleEditAsset = (updatedItem) => {
  // Normalize costPrice -> cost_price for display consistency
  const normalized = {
    ...updatedItem,
    cost_price: updatedItem.costPrice || updatedItem.cost_price || 0
  };
  setItems(prev => prev.map(i => i.id === normalized.id ? normalized : i));
};
  };

  // --- AI LOGIC ---
  const handleAiSubmit = async (e) => {
    if (e.key === "Enter" && aiQuery.trim() !== "") {
      const userMessage = aiQuery.trim();
      setAiQuery("");
      setChatLog(prev => [...prev, { role: "user", text: userMessage }]);
      try {
        const res = await axios.post(`${API_BASE_URL}/api/chat`, {
          message: userMessage,
          items: items
        });
        setChatLog(prev => [...prev, { role: "agent", text: res.data }]);
      } catch (err) {
        console.error("AI Sync Error:", err);
        setChatLog(prev => [...prev, { role: "agent", text: "[ERR]: Connection to Groq Core timed out. Verify API Key." }]);
      }
    }
  };

  // --- CALCULATIONS ---
  const safeVal = (v) => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));
  const grossVal = items.reduce((acc, i) => acc + safeVal(i.price) * safeVal(i.stock), 0);
  const costVal = items.reduce((acc, i) => acc + safeVal(i.costPrice || i.cost_price) * safeVal(i.stock), 0);
  const totalStock = items.reduce((acc, i) => acc + safeVal(i.stock), 0);
  const tax = grossVal * 0.18;
  const net = grossVal - costVal - tax;
  const topFive = [...items].sort((a, b) => (b.price * b.stock) - (a.price * a.stock)).slice(0, 5);

  return (
    <div className="flex h-screen bg-[#050505] font-['JetBrains_Mono'] overflow-hidden text-white">

      {/* 1. SIDEBAR */}
      <aside className="w-64 border-r border-white/5 p-8 flex flex-col justify-between bg-black/40 backdrop-blur-xl shrink-0 z-20">
        <div>
          <div className="mb-12 flex items-center gap-3">
            <div className="w-2 h-2 bg-[#4182ff] rounded-full shadow-[0_0_10px_#4182ff]" />
            <span className="font-black text-sm italic tracking-widest uppercase text-[#4182ff]">Vault.v5</span>
          </div>

          <nav className="space-y-3">
            {["dashboard", "inventory"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left p-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${
                  activeTab === tab ? "bg-white/5 text-white border border-white/10" : "text-white/20 hover:text-white/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setIsAiOpen(true)}
            className="mt-10 w-full flex items-center gap-3 p-4 rounded-xl border border-[#4182ff]/20 bg-[#4182ff]/5 text-[#4182ff] text-[9px] font-black uppercase tracking-widest hover:bg-[#4182ff]/10 transition-all"
          >
            <span className={`${isAiOpen ? 'text-[#00ff88]' : 'animate-pulse text-[#4182ff]'}`}>●</span> Agent_Interface
          </button>
        </div>

        <button onClick={onLogout} className="text-red-900/40 text-[9px] font-bold uppercase hover:text-red-500 transition-colors tracking-widest">
          [ Terminate ]
        </button>
      </aside>

      {/* 2. MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#050505] relative transition-all duration-500 ease-in-out">
        <header className="h-24 border-b border-white/5 flex justify-between items-center px-12 shrink-0">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 italic">Terminal / {activeTab}</h2>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[8px] text-white/20 uppercase font-bold">Node_Status</p>
              <p className="text-[10px] text-[#00ff88] font-mono">0x{userId?.slice(0, 8)}</p>
            </div>
            {activeTab === "inventory" && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#4182ff] w-12 h-12 rounded-full shadow-[0_0_20px_#4182ff66] hover:scale-105 active:scale-95 transition-all text-xl font-bold"
              >
                +
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
          {activeTab === "dashboard" ? (
            <div className="space-y-10">
              <div className="grid grid-cols-4 gap-6">
                <GlassCard label="Gross Valuation" value={`$${grossVal.toLocaleString()}`} accent="#4182ff" />
                <GlassCard label="Net Efficiency" value={`$${net.toLocaleString()}`} accent="#00ff88" />
                <GlassCard label="Tax Provision" value={`-$${tax.toLocaleString()}`} accent="#ff3366" />
                <GlassCard label="Units Held" value={totalStock.toLocaleString()} accent="#ffffff" />
              </div>

              <div className="glass-panel p-10 h-[400px] flex flex-col justify-between">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Performance_Report_Live</p>
                <div className="flex items-end gap-3 h-56 px-4 opacity-30">
                  {[40, 70, 45, 90, 65, 80, 100, 50, 85, 60].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-[#4182ff]/5 to-[#4182ff]/60 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pb-10">
                <div className="glass-panel p-10">
                  <p className="text-[10px] font-bold text-white/30 uppercase mb-8 tracking-widest">Top_Holdings</p>
                  <div className="space-y-6">
                    {topFive.map((item, i) => (
                      <div key={i} className="flex justify-between items-center group">
                        <span className="text-[11px] font-bold uppercase text-white/70 group-hover:text-white transition-colors">{item.name}</span>
                        <div className="flex-1 mx-4 border-b border-white/5 border-dashed" />
                        <span className="text-[11px] font-bold text-[#4182ff]">${(item.price * item.stock).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-panel p-10 font-mono text-[9px] text-white/20 space-y-2">
                  <p className="text-white/40 mb-6 font-bold uppercase tracking-widest">[ System_Logs ]</p>
                  <p className="text-[#00ff88]">{">"} Handshake: Session_Active</p>
                  <p>{">"} DB Sync: {items.length} assets integrated</p>
                  <p className="text-[#ff3366] animate-pulse">{">"} Real-time Valuation Engine: Active</p>
                </div>
              </div>
            </div>
          ) : (
            <InventoryContainer
              items={items}
              onDeleteAsset={handleDeleteAsset}
              onUpdateStock={handleUpdateStock}
              onEditAsset={handleEditAsset}
            />
          )}
        </div>
      </main>

      {/* 3. AI AGENT DRAWER */}
      <div
        className={`h-full bg-[#080808] border-l border-white/10 transition-all duration-500 ease-in-out overflow-hidden shrink-0 z-30 ${
          isAiOpen ? 'w-[450px] opacity-100' : 'w-0 opacity-0 border-none'
        }`}
      >
        <div className="w-[450px] p-10 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-[#4182ff] font-black text-xs uppercase tracking-[0.2em] italic">QueryFlow_Agent</h3>
              <p className="text-[8px] text-white/20 uppercase font-bold mt-1 tracking-widest">Autonomous_CA_Unit_v5.0</p>
            </div>
            <button onClick={() => setIsAiOpen(false)} className="text-white/20 hover:text-white text-[10px] font-bold border border-white/10 px-3 py-1 rounded-md transition-all uppercase">Close</button>
          </div>

          <div className="flex-1 font-mono text-[10px] leading-relaxed bg-black/60 p-6 rounded-3xl border border-white/5 overflow-y-auto custom-scrollbar shadow-inner space-y-4">
            {chatLog.map((msg, i) => (
              <div key={i} className={`${msg.role === 'user' ? 'text-right' : 'text-left'} animate-in fade-in duration-500`}>
                <span className={`font-black uppercase tracking-tighter ${msg.role === 'user' ? 'text-[#4182ff]' : 'text-[#00ff88]'}`}>
                  {msg.role === 'user' ? '[OPERATOR]: ' : '[AGENT]: '}
                </span>
                <p className="whitespace-pre-wrap mt-1 text-white/70 inline-block">{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 relative">
            <input
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-[11px] text-white outline-none focus:border-[#4182ff] transition-all pr-12 font-bold"
              placeholder="Execute command (e.g., Audit Portfolio)..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={handleAiSubmit}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#4182ff] font-bold text-lg opacity-50">↵</div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleOnAdd}
        userId={userId}
      />
    </div>
  );


const GlassCard = ({ label, value, accent }) => (
  <div className="glass-panel p-8 group hover:bg-white/[0.05] transition-all relative overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-full transition-all group-hover:w-2" style={{ backgroundColor: accent }} />
    <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.3em] mb-3">{label}</p>
    <p className="text-xl font-black tracking-tighter truncate" style={{ color: value.includes('-') ? '#ff3366' : 'white' }}>{value}</p>
  </div>
);

export default Vault;
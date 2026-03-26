import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import InventoryContainer from "../components/InventoryContainer";
import AddAssetModal from "../components/AddAssetModal";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState("Awaiting command...");

  const fetchItems = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
  }, [userId]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const safeVal = (v) => isNaN(parseFloat(v)) ? 0 : parseFloat(v);
  const grossVal = items.reduce((acc, i) => acc + (safeVal(i.price) * safeVal(i.stock)), 0);
  const costVal = items.reduce((acc, i) => acc + (safeVal(i.cost_price) * safeVal(i.stock)), 0);
  const tax = grossVal * 0.18;
  const net = grossVal - costVal - tax;
  const topFive = [...items].sort((a, b) => (b.price * b.stock) - (a.price * a.stock)).slice(0, 5);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* GLITCH SIDEBAR */}
      <aside className="w-20 lg:w-64 border-r border-white/5 flex flex-col items-center py-10 bg-black/40 backdrop-blur-xl">
        <div className="mb-16">
          <div className="h-10 w-10 bg-[#4182ff] rounded-lg shadow-[0_0_20px_#4182ff] flex items-center justify-center font-black text-xl italic">V</div>
        </div>
        <nav className="flex-1 space-y-8">
          {["dashboard", "inventory"].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`flex items-center gap-4 w-full px-8 group transition-all`}
            >
              <div className={`h-2 w-2 rounded-full ${activeTab === tab ? 'bg-[#4182ff] shadow-[0_0_10px_#4182ff]' : 'bg-white/10'}`} />
              <span className={`hidden lg:block text-[10px] font-bold uppercase tracking-[0.3em] ${activeTab === tab ? 'text-white' : 'text-white/20 group-hover:text-white/50'}`}>
                {tab}
              </span>
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="text-[8px] font-bold text-white/20 hover:text-red-500 uppercase tracking-widest rotate-180 lg:rotate-0">
          [ Terminate ]
        </button>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-24 px-12 flex justify-between items-center border-b border-white/5">
          <div>
            <p className="text-[9px] text-[#4182ff] font-bold tracking-[0.5em] mb-1">SYSTEM_ACCESS_GRANTED</p>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Terminal / {activeTab}</h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block">
                <p className="text-[8px] text-white/30 uppercase font-bold">Node_Active</p>
                <p className="text-[10px] text-[#00ff88] font-mono">0x{userId?.slice(0,8)}...f3</p>
             </div>
             {activeTab === "inventory" && (
                <button onClick={() => setIsAddModalOpen(true)} className="bg-[#4182ff] h-12 w-12 rounded-full hover:shadow-[0_0_30px_#4182ff] transition-all text-2xl font-bold">+</button>
             )}
          </div>
        </header>

        <div className="p-12 overflow-y-auto space-y-10 custom-scrollbar">
          {activeTab === "dashboard" ? (
            <>
              {/* METRIC CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassCard label="Gross Valuation" value={`$${grossVal.toLocaleString()}`} accent="#4182ff" />
                <GlassCard label="Net Efficiency" value={`$${net.toLocaleString()}`} accent="#00ff88" />
                <GlassCard label="Tax Provision" value={`-$${tax.toLocaleString()}`} accent="#ff3366" />
                <GlassCard label="Units Held" value={items.reduce((a,b) => a + safeVal(b.stock), 0)} accent="#ffffff" />
              </div>

              {/* CENTER ANALYTICS */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-[2rem] p-8 min-h-[400px] flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Performance_Metric_Live</p>
                      <span className="text-[10px] text-[#00ff88] animate-pulse">● LIVE_STREAM</span>
                   </div>
                   <div className="flex items-end gap-3 h-48 px-4">
                      {/* Dynamic Bar Graph */}
                      {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-[#4182ff]/10 to-[#4182ff]/40 rounded-t-lg transition-all hover:to-[#00ff88]" style={{height: `${h}%`}} />
                      ))}
                   </div>
                   <div className="flex justify-between text-[9px] text-white/20 font-bold uppercase pt-6 border-t border-white/5">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                   </div>
                </div>

                {/* AI INTERFACE */}
                <div className="bg-[#4182ff]/5 border border-[#4182ff]/20 rounded-[2rem] p-8 flex flex-col shadow-[inset_0_0_50px_rgba(65,130,255,0.05)]">
                  <p className="text-[10px] font-bold text-[#4182ff] uppercase tracking-widest mb-6 underline decoration-dotted">AI_Asst_QueryFlow</p>
                  <div className="flex-1 font-mono text-[11px] text-white/60 leading-relaxed bg-black/40 p-5 rounded-2xl border border-white/5 mb-6">
                     {">"} {net > 0 ? "Portfolio health: CRITICAL_SUCCESS. Profit margins exceeding projections." : "Caution: Cost basis elevated. Advise immediate price adjustment."}
                  </div>
                  <div className="relative">
                    <input className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-[10px] outline-none focus:border-[#4182ff] transition-all pr-12" placeholder="Send prompt..." />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4182ff] font-bold">↵</div>
                  </div>
                </div>
              </div>

              {/* BOTTOM FEEDS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                 <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">Top_Holdings</p>
                    <div className="space-y-4">
                      {topFive.map((item, i) => (
                        <div key={i} className="flex justify-between items-center group cursor-crosshair">
                           <span className="text-[11px] font-bold text-white/70 group-hover:text-white transition-colors uppercase">{item.name}</span>
                           <div className="flex-1 mx-4 border-b border-white/5 border-dashed" />
                           <span className="text-[11px] font-mono text-[#4182ff]">${(item.price * item.stock).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                 </div>
                 <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 overflow-hidden relative">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">Terminal_Output</p>
                    <div className="space-y-2 font-mono text-[10px] text-white/30">
                       <p className="text-[#00ff88]">[OK] DB_SYNC_SUCCESS_STABLE</p>
                       <p>[INF] CACHE_CLEARED_V2</p>
                       <p>[INF] HANDSHAKE_ESTABLISHED_RAILWAY</p>
                       <p className="text-[#ff3366]">[WRN] HIGH_COST_BASIS_ALERT</p>
                       <div className="h-2 w-full bg-white/5 rounded animate-pulse mt-4" />
                    </div>
                 </div>
              </div>
            </>
          ) : (
            <InventoryContainer items={items} />
          )}
        </div>
      </main>

      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={(n) => setItems([n, ...items])} userId={userId} />
    </div>
  );
};

const GlassCard = ({ label, value, accent }) => (
  <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.07] transition-all cursor-default relative overflow-hidden group">
    <div className="absolute top-0 left-0 w-1 h-full transition-all group-hover:w-2" style={{ backgroundColor: accent }} />
    <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">{label}</p>
    <p className="text-2xl font-black tracking-tighter" style={{ color: value.includes('-') ? '#ff3366' : 'white' }}>{value}</p>
  </div>
);

export default Vault;
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";

// --- 1. LANDING PAGE (ALWAYS ACCESSIBLE) ---
const LandingPage = () => (
  <div className="bg-[#131313] min-h-screen text-white font-['Inter'] flex items-center justify-center text-center p-8">
    <div className="max-w-4xl animate-in fade-in zoom-in duration-700">
      <h1 className="text-7xl md:text-8xl font-black font-['Manrope'] tracking-tighter leading-tight mb-8">
        The Modern CFO's<br/><span className="text-[#adc7ff] italic">Digital Vault</span>
      </h1>
      <Link to="/login" className="bg-[#adc7ff] text-[#002e68] px-12 py-5 rounded-2xl font-black text-xl inline-block shadow-2xl hover:scale-105 transition-all">
        Enter Terminal
      </Link>
    </div>
  </div>
);

// --- 2. AUTH HELPERS ---
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleManualLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) { 
      onLogin(true, data.user.email); 
      navigate("/vault"); 
    } else { 
      alert(error.message); 
    }
  };
  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center px-4 font-['Inter']">
      <div className="max-w-md w-full bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#adc7ff] to-[#66dd8b]"></div>
        <h2 className="text-5xl font-black font-['Manrope'] text-white mb-10 tracking-tighter">Access Terminal</h2>
        <form onSubmit={handleManualLogin} className="space-y-4">
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]" type="email" placeholder="Business Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-5 rounded-[1.5rem] font-black text-xl hover:scale-[1.02] transition-all">SIGN IN</button>
        </form>
      </div>
    </div>
  );
};

// --- 3. THE VAULT TERMINAL ---
const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const [ledger, setLedger] = useState([
    { id: 1, action: "System Initialization", entity: "Node 04", status: "Verified", value: 0, time: "Start" }
  ]);

  const [userQuery, setUserQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', text: "Terminal Secure. CFO AI standing by." }]);
  const chatEndRef = useRef(null);

  useEffect(() => { if (userId) fetchItems(); }, [userId]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setItems([]); } finally { setIsLoading(false); }
  };

  const updateStock = async (id, delta) => {
    const item = (items || []).find(i => i.id === id);
    if (!item) return;

    const newStock = Math.max(0, (Number(item.stock) || 0) + delta);
    const transactionValue = -(delta * (Number(item.price) || 0));

    setItems(prevItems => prevItems.map(i => i.id === id ? { ...i, stock: newStock } : i));

    setLedger(prev => [{
      id: Date.now(),
      action: delta > 0 ? "Inventory Purchase" : "Asset Liquidation",
      entity: item.name || "Unknown Asset",
      value: transactionValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }, ...prev.slice(0, 4)]);

    try {
      await axios.put(`${API_BASE_URL}/api/products/${id}`, { stock: newStock, userId: userId });
    } catch (err) { console.error("Cloud Sync Failed:", err); }
  };

  const safeItems = items || [];
  const totalValuation = Math.floor(safeItems.reduce((acc, i) => acc + ((Number(i?.price) || 0) * (Number(i?.stock) || 0)), 0));
  const totalInvestment = Math.floor(safeItems.reduce((acc, i) => acc + (((Number(i?.price) || 0) * 0.7) * (Number(i?.stock) || 0)), 0)); 
  const estimatedTax = Math.floor(totalValuation * 0.18);
  const realizableProfit = Math.floor(totalValuation - totalInvestment - estimatedTax);

  const getStatus = () => {
    if (realizableProfit > 1000000) return { bg: "bg-[#66dd8b]", text: "text-[#003115]", label: "Institutional Profit", icon: "trending_up", desc: "Yield optimized." };
    if (realizableProfit < 0) return { bg: "bg-[#ffb4ab]", text: "text-[#680003]", label: "Liquidity Deficit", icon: "warning", desc: "High investment detected." };
    return { bg: "bg-[#adc7ff]", text: "text-[#002e68]", label: "Neutral Position", icon: "sync", desc: "System synchronized." };
  };
  const status = getStatus();

  // FIX: Explicitly navigating to home after clearing state
  const handleExit = () => {
    onLogout();
    navigate("/"); 
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    const newHistory = [...chatHistory, { role: 'user', text: userQuery }];
    setChatHistory(newHistory);
    setUserQuery("");
    setIsAnalyzing(true);
    setTimeout(() => {
      let reply = "Audit complete. Risk levels are within normal parameters.";
      const query = userQuery.toLowerCase();
      if (query.includes("profit")) reply = `Realizable profit is projected at $${realizableProfit.toLocaleString()}.`;
      setChatHistory([...newHistory, { role: 'assistant', text: reply }]);
      setIsAnalyzing(false);
    }, 800);
  };

  if (isLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-bold animate-pulse">BOOTING TERMINAL...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white font-['Inter'] overflow-hidden fixed inset-0">
      <aside className="w-64 border-r border-white/5 bg-[#131313] flex flex-col p-6 shrink-0">
        <div className="mb-10 font-['Manrope']"><span className="text-xl font-black">QueryFlow Vault</span></div>
        <nav className="flex-1 space-y-2">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black transition-all capitalize ${activeTab === tab ? 'bg-[#adc7ff]/10 text-[#adc7ff]' : 'text-gray-500 hover:text-white'}`}>
               <span className="material-symbols-outlined">{tab === 'dashboard' ? 'dashboard' : tab === 'inventory' ? 'inventory_2' : 'description'}</span> {tab}
            </button>
          ))}
        </nav>
        <button onClick={handleExit} className="mt-auto bg-red-500/10 text-red-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">Exit Terminal</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-white/5 flex justify-between items-center px-10 bg-[#131313]/50 backdrop-blur-md">
          <h2 className="text-xl font-black font-['Manrope'] capitalize">{activeTab} Overview</h2>
          <input className="bg-[#1c1b1b] border-none rounded-xl px-12 py-2 text-sm w-80 outline-none text-white font-['Inter']" placeholder="Search ledger..." onChange={(e) => setSearchTerm(e.target.value)} />
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#1c1b1b] p-7 rounded-3xl border-l-4 border-[#adc7ff] shadow-xl overflow-hidden">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">Valuation</span>
                  <h3 className="text-2xl font-black font-['Manrope'] truncate">${totalValuation.toLocaleString()}</h3>
                </div>
                <div className="bg-[#1c1b1b] p-7 rounded-3xl border-l-4 border-[#fbbc00] shadow-xl overflow-hidden">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">Tax Provision</span>
                  <h3 className="text-2xl font-black truncate">-${estimatedTax.toLocaleString()}</h3>
                </div>
                <div className="bg-[#1c1b1b] p-7 rounded-3xl border-l-4 border-[#66dd8b] shadow-xl overflow-hidden">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">Net Profit</span>
                  <h3 className="text-2xl font-black text-[#66dd8b] truncate">${realizableProfit.toLocaleString()}</h3>
                </div>
                <div className="bg-[#1c1b1b] p-7 rounded-3xl border-l-4 border-gray-700">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">SKU Alerts</span>
                  <h3 className="text-2xl font-black text-red-500">{safeItems.filter(i => i.stock <= 5).length}</h3>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-[#1c1b1b] p-8 rounded-[2.5rem] border border-white/5 shadow-lg">
                  <h4 className="font-black font-['Manrope'] uppercase tracking-widest text-[10px] text-gray-400 mb-8">Capital Concentration</h4>
                  <div className="space-y-6">
                    {safeItems.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="group">
                        <div className="flex justify-between text-[11px] mb-2 font-bold">
                          <span>{item.name}</span>
                          <span>${Math.floor(item.price * item.stock).toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#adc7ff]" style={{ width: `${Math.min(100, (item.price * item.stock / (totalValuation || 1)) * 100)}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`${status.bg} ${status.text} p-8 rounded-[2.5rem] flex flex-col justify-between shadow-2xl transition-all duration-500`}>
                  <span className="material-symbols-outlined text-4xl">{status.icon}</span>
                  <div>
                    <h4 className="text-2xl font-black font-['Manrope'] leading-tight">{status.label}</h4>
                    <p className="text-[10px] font-bold uppercase mt-4 tracking-widest opacity-60">{status.desc}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1c1b1b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <h4 className="font-black uppercase text-[10px] text-gray-400 mb-6 tracking-widest">Recent Ledger Activity</h4>
                <div className="space-y-2">
                  {ledger.map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 animate-in slide-in-from-top duration-300">
                      <div><p className="font-bold text-sm font-['Inter']">{entry.action}</p><p className="text-[9px] text-gray-500">{entry.entity} | {entry.time}</p></div>
                      <span className={`font-black text-sm font-['Manrope'] ${entry.value >= 0 ? 'text-[#66dd8b]' : 'text-red-500'}`}>{entry.value >= 0 ? '+' : '-'}${Math.floor(Math.abs(entry.value)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
             <div className="grid grid-cols-2 gap-5 animate-in fade-in duration-500">
               {safeItems.filter(i => (i.name||"").toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                 <div key={item.id} className={`bg-[#1c1b1b] p-7 rounded-[2.5rem] border ${item.stock <= 5 ? 'border-red-500/30' : 'border-white/5'} shadow-xl transition-all`}>
                   <h4 className="font-black text-xl mb-6 font-['Manrope'] truncate">{item.name}</h4>
                   <div className="bg-black/30 p-5 rounded-2xl mb-6 flex justify-between font-['Inter']">
                     <div><span className="text-[9px] text-gray-600 block uppercase font-bold tracking-widest">Price Point</span><span className="text-xl font-black">${Math.floor(item.price || 0).toLocaleString()}</span></div>
                     <div className="text-right"><span className="text-[9px] text-gray-600 block uppercase font-bold tracking-widest">Vaulted</span><span className={`text-xl font-black ${item.stock <= 5 ? 'text-red-500' : 'text-white'}`}>{item.stock}</span></div>
                   </div>
                   <div className="flex gap-3">
                     <button onClick={() => updateStock(item.id, 1)} className="flex-1 bg-white/5 hover:bg-red-500/20 text-white hover:text-red-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Restock (-Cash)</button>
                     <button onClick={() => updateStock(item.id, -1)} className="flex-1 bg-white/5 hover:bg-[#66dd8b]/20 text-white hover:text-[#66dd8b] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Mark Sold (+Cash)</button>
                   </div>
                 </div>
               ))}
             </div>
          )}

          {activeTab === "reports" && (
             <div className="max-w-3xl mx-auto bg-[#1c1b1b] p-12 rounded-[3rem] border border-white/5 shadow-2xl animate-in slide-in-from-bottom duration-500">
                <h3 className="text-2xl font-black font-['Manrope'] mb-12 border-b border-white/5 pb-6">Ledger Performance Summary</h3>
                <div className="space-y-6 font-['Inter']">
                  <div className="flex justify-between items-center pb-4 border-b border-white/5"><span className="text-gray-400 font-medium">Total Asset Value</span><span className="font-black text-xl">${totalValuation.toLocaleString()}</span></div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/5"><span className="text-gray-400 font-medium">Capital Invested (Cost)</span><span className="font-black text-xl text-red-400">-${totalInvestment.toLocaleString()}</span></div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/5"><span className="text-gray-400 font-medium">Tax Provision (18%)</span><span className="font-black text-xl text-[#fbbc00]">-${estimatedTax.toLocaleString()}</span></div>
                  <div className="flex justify-between bg-[#66dd8b]/10 p-8 rounded-3xl mt-12 border border-[#66dd8b]/20">
                    <span className="text-[#66dd8b] font-black uppercase tracking-widest text-xs">Projected Realizable Profit</span>
                    <span className="font-black font-['Manrope'] text-4xl text-[#66dd8b]">${realizableProfit.toLocaleString()}</span>
                  </div>
                </div>
             </div>
          )}
        </div>
      </main>

      <aside className="w-80 bg-[#1c1b1b] border-l border-white/5 p-6 flex flex-col h-full shrink-0 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4"><span className="text-[11px] font-black font-['Manrope'] uppercase tracking-widest">AI Advisor</span></div>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 custom-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-4 rounded-2xl text-[11px] leading-relaxed font-['Inter'] ${msg.role === 'assistant' ? 'bg-black/30 border-l-2 border-[#adc7ff] text-gray-400' : 'bg-[#adc7ff]/10 text-[#adc7ff] text-right'}`}>{msg.text}</div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleChat} className="relative mt-auto">
          <input type="text" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} placeholder="Query fiscal data..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-white outline-none focus:border-[#adc7ff]/50 transition-all font-['Inter']" />
          <button type="submit" className="absolute right-3 top-2.5 text-[#adc7ff] material-symbols-outlined text-lg">send</button>
        </form>
      </aside>
    </div>
  );
};

// --- 4. MAIN APP COMPONENT (STRETCHED ROUTES) ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const handleLogin = (status, id) => { setIsAuthenticated(status); setUserId(id); localStorage.setItem("isLoggedIn", status); localStorage.setItem("userId", id); };
  const handleLogout = () => { setIsAuthenticated(false); setUserId(""); localStorage.clear(); };
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Login onLogin={handleLogin} />} />
        
        {/* PROTECTED VAULT ROUTE ONLY */}
        <Route 
          path="/vault" 
          element={isAuthenticated ? <Vault userId={userId} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}
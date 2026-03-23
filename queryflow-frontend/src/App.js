import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";
const GOOGLE_CLIENT_ID = "355056127518-9jjnnp9q7mkeum589k53dseuvdsrdpnf.apps.googleusercontent.com";

// --- 1. AUTH & LANDING (UNCHANGED) ---
const LandingPage = () => (
  <div className="bg-[#131313] min-h-screen text-white flex items-center justify-center p-8">
    <div className="text-center">
      <h1 className="text-8xl font-black font-['Manrope'] tracking-tighter mb-8 italic">QueryFlow <span className="text-[#adc7ff] not-italic">Vault</span></h1>
      <Link to="/login" className="bg-[#adc7ff] text-[#002e68] px-12 py-4 rounded-2xl font-black text-xl hover:scale-105 transition-all inline-block">Enter Terminal</Link>
    </div>
  </div>
);

// --- 2. THE VAULT (WITH FUNCTIONAL AI ADVISOR) ---
const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // AI States
  const [aiInsight, setAiInsight] = useState("System Active. Monitoring assets in current vault.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => { if (userId) fetchItems(); }, [userId]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setItems([]); } finally { setIsLoading(false); }
  };

  // FINANCIAL LOGIC
  const totalValuation = items.reduce((acc, item) => acc + ((Number(item.price) || 0) * (Number(item.stock) || 0)), 0);
  const estimatedTax = totalValuation * 0.18;
  const netProfit = totalValuation - estimatedTax;

  // AI AUDIT ENGINE (MOCK BRAIN)
  const runPerformanceAudit = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const highValue = items.find(i => Number(i.price) > 1000000);
      const lowStock = items.find(i => Number(i.stock) < 3);
      
      let insight = "Analysis Complete: Portfolio is stable. All entity margins are within institutional tolerance.";
      
      if (highValue) insight = `High-Value Alert: ${highValue.name} represents a significant concentration of capital. Recommend tax-loss harvesting simulation.`;
      if (lowStock) insight = `Inventory Risk: ${lowStock.name} is below critical threshold (Qty: ${lowStock.stock}). Supply chain variance may impact Q4 profit.`;
      if (totalValuation > 30000000) insight = `Scale Warning: Total valuation has exceeded $30M. Recommend transitioning to Consolidated Ledger v4.2 for multi-currency sync.`;

      setAiInsight(insight);
      setIsAnalyzing(false);
    }, 1500); // 1.5s delay to simulate "Thinking"
  };

  if (isLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-bold tracking-[0.5em] animate-pulse">BOOTING TERMINAL...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white font-['Inter'] overflow-hidden fixed inset-0">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#131313] flex flex-col p-6 shrink-0">
        <div className="mb-10 font-['Manrope']">
          <span className="text-xl font-black tracking-tighter">QueryFlow Vault</span>
          <p className="text-[10px] text-gray-600 font-['Space_Grotesk'] uppercase mt-1">Enterprise Finance</p>
        </div>
        <nav className="flex-1 space-y-2">
          <div className="w-full flex items-center gap-3 px-4 py-3 bg-[#adc7ff]/10 text-[#adc7ff] rounded-xl text-sm font-black"><span className="material-symbols-outlined text-lg">dashboard</span> Dashboard</div>
          <div className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white rounded-xl text-sm font-semibold cursor-pointer transition-all"><span className="material-symbols-outlined text-lg opacity-30">inventory_2</span> Inventory</div>
          <div className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white rounded-xl text-sm font-semibold cursor-pointer transition-all"><span className="material-symbols-outlined text-lg opacity-30">description</span> Reports</div>
        </nav>
        <button onClick={onLogout} className="mt-auto bg-red-500/10 text-red-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">Exit Terminal</button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0e0e0e]">
        <header className="h-16 border-b border-white/5 flex justify-between items-center px-10 bg-[#131313]/50 backdrop-blur-md shrink-0">
          <h2 className="text-xl font-black font-['Manrope']">CFO Overview</h2>
          <div className="relative">
             <span className="absolute left-4 top-2.5 text-gray-600 material-symbols-outlined text-sm">search</span>
             <input className="bg-[#1c1b1b] border-none rounded-xl px-12 py-2 text-sm w-80 outline-none focus:ring-1 ring-[#adc7ff]/40 text-white" placeholder="Search assets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-[#1c1b1b] p-6 rounded-3xl border-l-4 border-[#adc7ff] shadow-2xl">
              <span className="text-[10px] text-gray-500 uppercase font-['Space_Grotesk']">Valuation</span>
              <h3 className="text-3xl font-black font-['Manrope'] mt-1 tracking-tighter">${totalValuation.toLocaleString()}</h3>
            </div>
            <div className="bg-[#1c1b1b] p-6 rounded-3xl border-l-4 border-[#fbbc00] shadow-2xl">
              <span className="text-[10px] text-gray-500 uppercase font-['Space_Grotesk']">Tax (18%)</span>
              <h3 className="text-3xl font-black font-['Manrope'] mt-1 tracking-tighter">-${estimatedTax.toLocaleString()}</h3>
            </div>
            <div className="bg-[#1c1b1b] p-6 rounded-3xl border-l-4 border-[#66dd8b] shadow-2xl">
              <span className="text-[10px] text-gray-500 uppercase font-['Space_Grotesk']">Net Profit</span>
              <h3 className="text-3xl font-black font-['Manrope'] mt-1 text-[#66dd8b] tracking-tighter">${netProfit.toLocaleString()}</h3>
            </div>
            <div className="bg-[#1c1b1b] p-6 rounded-3xl border-l-4 border-gray-700 shadow-2xl">
              <span className="text-[10px] text-gray-500 uppercase font-['Space_Grotesk']">Assets</span>
              <h3 className="text-3xl font-black font-['Manrope'] mt-1 tracking-tighter">{items.length}</h3>
            </div>
          </div>

          <div className="flex gap-8 items-start">
            {/* ASSET GRID */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                <div key={item.id} className="bg-[#1c1b1b] p-6 rounded-[2.5rem] border border-white/5 flex gap-6 hover:border-[#adc7ff]/40 transition-all">
                  <div className="w-16 h-16 bg-black/40 rounded-2xl flex items-center justify-center text-3xl">⌚</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{item.name}</h4>
                    <p className="text-[9px] text-gray-600 font-['Space_Grotesk'] mb-4 uppercase tracking-widest">ID: {String(item.id).substring(0,8)}</p>
                    <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                       <span className="text-xs font-black font-['Manrope']">${(Number(item.price) || 0).toLocaleString()}</span>
                       <span className="text-[10px] text-[#66dd8b] font-bold">22.5% Margin</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* THE AI ADVISOR PANE */}
            <aside className="w-80 bg-[#1c1b1b] rounded-[2.5rem] border border-white/5 p-8 sticky top-0 shrink-0 shadow-2xl">
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                <span className={`material-symbols-outlined text-[#adc7ff] text-xl ${isAnalyzing ? 'animate-spin' : 'animate-pulse'}`}>
                  {isAnalyzing ? 'sync' : 'auto_awesome'}
                </span>
                <span className="text-sm font-black font-['Manrope'] uppercase tracking-widest">AI Advisor</span>
                <span className="ml-auto w-2 h-2 bg-[#66dd8b] rounded-full shadow-[0_0_8px_#66dd8b]"></span>
              </div>
              <div className="space-y-6">
                <div className="bg-black/30 p-5 rounded-2xl border-l-2 border-[#adc7ff]">
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                    {aiInsight}
                  </p>
                </div>
                <button 
                  onClick={runPerformanceAudit}
                  disabled={isAnalyzing}
                  className="w-full py-4 bg-[#adc7ff]/10 text-[#adc7ff] border border-[#adc7ff]/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#adc7ff] hover:text-[#002e68] transition-all"
                >
                  {isAnalyzing ? "Processing..." : "Run Performance Audit"}
                </button>
              </div>
            </aside>
          </div>
        </div>

        <footer className="h-10 bg-[#131313] border-t border-white/5 flex items-center px-10 shrink-0">
          <span className="text-[9px] font-['Space_Grotesk'] text-gray-600 tracking-[0.4em] uppercase">System Status: <span className="text-[#66dd8b] font-bold">Network Active</span></span>
        </footer>
      </main>
    </div>
  );
};

// --- 3. AUTH & BOILERPLATE ---
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const handleLogin = (status, id) => { setIsAuthenticated(status); setUserId(id); localStorage.setItem("isLoggedIn", status); localStorage.setItem("userId", id); };
  const handleLogout = () => { setIsAuthenticated(false); setUserId(""); localStorage.clear(); };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Login onLogin={handleLogin} />} />
        <Route path="/vault" element={isAuthenticated ? <Vault userId={userId} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleManualLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) { onLogin(true, data.user.email); navigate("/vault"); }
    else { alert(error.message); }
  };
  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 text-center shadow-2xl relative">
        <h2 className="text-5xl font-black font-['Manrope'] text-white mb-10 tracking-tighter">Access Terminal</h2>
        <form onSubmit={handleManualLogin} className="space-y-4">
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-5 rounded-[1.5rem] font-black text-xl hover:scale-[1.02] transition-all">SIGN IN</button>
        </form>
        <div className="mt-8"><GoogleBtn onLogin={onLogin} /></div>
      </div>
    </div>
  );
};

export default App;
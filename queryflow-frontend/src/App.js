import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";
const GOOGLE_CLIENT_ID = "355056127518-9jjnnp9q7mkeum589k53dseuvdsrdpnf.apps.googleusercontent.com";

// --- 1. AUTH HELPERS ---
const GoogleBtn = ({ onLogin }) => {
  const navigate = useNavigate();
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
          });
          if (!error && data.user) {
            onLogin(true, data.user.email); 
            navigate("/vault");
          }
        }
      });
      google.accounts.id.renderButton(document.getElementById("googleBtn"), { 
        theme: "outline", size: "large", width: "320" 
      });
    }
  }, [onLogin, navigate]);
  return <div id="googleBtn" className="flex justify-center mt-6"></div>;
};

// --- 2. LANDING PAGE (HERO + FEATURES + LEDGER) ---
const LandingPage = () => (
  <div className="bg-[#131313] min-h-screen text-white font-['Inter'] selection:bg-[#adc7ff] selection:text-[#002e68]">
    <header className="fixed top-0 w-full h-16 flex justify-between items-center px-8 z-50 bg-[#131313]/60 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-8 font-['Manrope']">
        <span className="text-lg font-black tracking-tighter">QueryFlow Vault</span>
      </div>
      <div className="flex gap-4">
        <Link to="/login" className="text-sm font-medium text-gray-400">Login</Link>
        <Link to="/signup" className="bg-[#adc7ff] text-[#002e68] px-4 py-2 rounded-lg text-sm font-bold">Request Demo</Link>
      </div>
    </header>

    <main className="pt-32">
      <section className="px-8 py-20 text-center max-w-5xl mx-auto">
        <h1 className="text-7xl md:text-8xl font-black font-['Manrope'] tracking-tighter leading-tight mb-8">
          The Modern CFO's<br/><span className="text-[#adc7ff] italic">Digital Vault</span>
        </h1>
        <p className="max-w-xl mx-auto text-gray-400 mb-10 text-lg">Unify ledger integrity with algorithmic foresight. Transform raw fiscal data into institutional intelligence.</p>
        <Link to="/signup" className="bg-[#adc7ff] text-[#002e68] px-12 py-5 rounded-2xl font-black text-xl inline-block shadow-2xl shadow-[#adc7ff]/20">Start for Free</Link>
      </section>
    </main>
  </div>
);

// --- 3. THE VAULT (INTERACTIVE TERMINAL) ---
const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // AI Chat States
  const [userQuery, setUserQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: "System Active. I am your CFO Advisor. How can I help you optimize the ledger today?" }
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

  const totalValuation = items.reduce((acc, item) => acc + ((Number(item.price) || 0) * (Number(item.stock) || 0)), 0);
  const estimatedTax = totalValuation * 0.18;
  const netProfit = totalValuation - estimatedTax;

  const handleChat = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const newHistory = [...chatHistory, { role: 'user', text: userQuery }];
    setChatHistory(newHistory);
    setUserQuery("");
    setIsAnalyzing(true);

    // Simulated Intelligent Logic
    setTimeout(() => {
      let reply = "I've reviewed your current $31M portfolio. Market velocity remains high, but reorder triggers are active for some assets.";
      const query = userQuery.toLowerCase();
      
      if (query.includes("tax")) reply = `Based on a $${totalValuation.toLocaleString()} valuation, your provision is $${estimatedTax.toLocaleString()}. We can optimize this using EMEA North logistics write-offs.`;
      if (query.includes("rolex")) reply = "Your Rolex inventory is currently maintaining a 22.5% margin. However, Patek assets show higher yield in current APAC markets.";
      if (query.includes("profit")) reply = `Current net profit is projected at $${netProfit.toLocaleString()}. Increasing turnover on low-stock items could boost this by 4.1%.`;

      setChatHistory([...newHistory, { role: 'assistant', text: reply }]);
      setIsAnalyzing(false);
    }, 1000);
  };

  if (isLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-bold tracking-[0.4em] animate-pulse">BOOTING TERMINAL...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white font-['Inter'] overflow-hidden fixed inset-0">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#131313] flex flex-col p-6 shrink-0">
        <div className="mb-10 font-['Manrope']">
          <span className="text-xl font-black tracking-tighter">QueryFlow Vault</span>
          <p className="text-[10px] text-gray-600 font-['Space_Grotesk'] uppercase mt-1 tracking-widest">Enterprise Finance</p>
        </div>
        <nav className="flex-1 space-y-2">
          <div className="w-full flex items-center gap-3 px-4 py-3 bg-[#adc7ff]/10 text-[#adc7ff] rounded-xl text-sm font-black cursor-pointer">
            <span className="material-symbols-outlined text-lg">dashboard</span> Dashboard
          </div>
          {['Inventory', 'Reports', 'Settings'].map(item => (
            <div key={item} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white rounded-xl text-sm font-semibold transition-all cursor-pointer">
              <span className="material-symbols-outlined text-lg opacity-30">circle</span> {item}
            </div>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto bg-red-500/10 text-red-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">Exit Terminal</button>
      </aside>

      {/* CENTER CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0e0e0e] relative">
        <header className="h-16 border-b border-white/5 flex justify-between items-center px-10 bg-[#131313]/50 backdrop-blur-md shrink-0">
          <h2 className="text-xl font-black font-['Manrope']">CFO Overview</h2>
          <div className="relative group">
             <span className="absolute left-4 top-2.5 text-gray-600 material-symbols-outlined text-sm">search</span>
             <input className="bg-[#1c1b1b] border-none rounded-xl px-12 py-2 text-sm w-80 outline-none focus:ring-1 ring-[#adc7ff]/40 text-white" placeholder="Search assets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-[#1c1b1b] p-6 rounded-3xl border-l-4 border-[#adc7ff] shadow-xl">
              <span className="text-[10px] text-gray-500 uppercase font-['Space_Grotesk'] tracking-widest">Valuation</span>
              <h3 className="text-2xl font-black font-['Manrope'] mt-1">${totalValuation.toLocaleString()}</h3>
            </div>
            <div className="bg-[#1c1b1b] p-6 rounded-3xl border-l-4 border-[#fbbc00] shadow-xl">
              <span className="text-[10px] text-gray-500 uppercase font-['Space_Grotesk'] tracking-widest">Tax (18%)</span>
              <h3 className="text-2xl font-black font-['Manrope'] mt-1">-${estimatedTax.toLocaleString()}</h3>
            </div>
            <div className="bg-[#1c1b1b] p-6 rounded-3xl border-l-4 border-[#66dd8b] shadow-xl">
              <span className="text-[10px] text-gray-500 uppercase font-['Space_Grotesk'] tracking-widest">Net Profit</span>
              <h3 className="text-2xl font-black font-['Manrope'] mt-1 text-[#66dd8b]">${netProfit.toLocaleString()}</h3>
            </div>
            <div className="bg-[#1c1b1b] p-6 rounded-3xl border-l-4 border-gray-700 shadow-xl">
              <span className="text-[10px] text-gray-500 uppercase font-['Space_Grotesk'] tracking-widest">Assets</span>
              <h3 className="text-2xl font-black font-['Manrope'] mt-1">{items.length}</h3>
            </div>
          </div>

          {/* ASSET GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
              <div key={item.id} className="bg-[#1c1b1b] p-6 rounded-[2.5rem] border border-white/5 flex gap-6 hover:border-[#adc7ff]/40 transition-all shadow-lg">
                <div className="w-16 h-16 bg-black/40 rounded-2xl flex items-center justify-center text-3xl">⌚</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm truncate">{item.name}</h4>
                    {item.stock <= 5 && <span className="text-[8px] font-black text-[#fbbc00] border border-[#fbbc00]/40 px-2 py-0.5 rounded-full uppercase">Reorder</span>}
                  </div>
                  <p className="text-[9px] text-gray-600 font-['Space_Grotesk'] mb-4">ID: {String(item.id).substring(0,8)}</p>
                  <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                     <span className="text-xs font-black font-['Manrope']">${(Number(item.price) || 0).toLocaleString()}</span>
                     <span className="text-[10px] text-[#66dd8b] font-bold">22.5% Margin</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="h-10 bg-[#131313] border-t border-white/5 flex items-center px-10 shrink-0">
          <span className="text-[9px] font-['Space_Grotesk'] text-gray-600 tracking-[0.4em] uppercase">Status: <span className="text-[#66dd8b]">Network Active</span></span>
        </footer>
      </main>

      {/* AI INTERACTIVE PANEL (RIGHT) */}
      <aside className="w-80 bg-[#1c1b1b] border-l border-white/5 p-6 flex flex-col h-full shrink-0 shadow-[-20px_0_50px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
          <span className={`material-symbols-outlined text-[#adc7ff] text-xl ${isAnalyzing ? 'animate-spin' : 'animate-pulse'}`}>
            auto_awesome
          </span>
          <span className="text-sm font-black font-['Manrope'] uppercase tracking-widest">AI Advisor</span>
          <span className="ml-auto w-2 h-2 bg-[#66dd8b] rounded-full"></span>
        </div>

        {/* CHAT LOG */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 custom-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-4 rounded-2xl text-[11px] leading-relaxed ${
              msg.role === 'assistant' 
              ? 'bg-black/30 border-l-2 border-[#adc7ff] text-gray-400' 
              : 'bg-[#adc7ff]/10 border-r-2 border-[#adc7ff] text-[#adc7ff] text-right'
            }`}>
              {msg.text}
            </div>
          ))}
          {isAnalyzing && <div className="text-[10px] text-gray-600 animate-pulse font-['Space_Grotesk'] uppercase">Auditing Ledger...</div>}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT BOX */}
        <form onSubmit={handleChat} className="relative mt-auto">
          <input 
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Query fiscal data..."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-white outline-none focus:border-[#adc7ff]/50 transition-all font-['Inter']"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-[#adc7ff] material-symbols-outlined text-lg">
            send
          </button>
        </form>
      </aside>
    </div>
  );
};

// --- 4. AUTH & NAVIGATION ---
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
      <div className="max-w-md w-full bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 text-center shadow-2xl relative overflow-hidden">
        <h2 className="text-5xl font-black font-['Manrope'] text-white mb-10 tracking-tighter">Access Terminal</h2>
        <form onSubmit={handleManualLogin} className="space-y-4">
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-2xl px-8 py-5 outline-none" type="email" placeholder="Business Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-2xl px-8 py-5 outline-none" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all">SIGN IN</button>
        </form>
        <div className="mt-8"><GoogleBtn onLogin={onLogin} /></div>
      </div>
    </div>
  );
};

export default App;
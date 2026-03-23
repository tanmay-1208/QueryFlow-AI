import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";
const GOOGLE_CLIENT_ID = "355056127518-9jjnnp9q7mkeum589k53dseuvdsrdpnf.apps.googleusercontent.com";

// --- AUTH HANDLERS ---
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

// --- 1. LANDING PAGE (STITCH DESIGN) ---
const LandingPage = () => (
  <div className="bg-[#131313] min-h-screen text-white font-['Inter'] selection:bg-[#adc7ff] selection:text-[#002e68]">
    <header className="fixed top-0 w-full h-16 flex justify-between items-center px-8 z-50 bg-[#131313]/60 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-8 font-['Manrope']">
        <span className="text-lg font-black tracking-tighter">QueryFlow Vault</span>
        <nav className="hidden md:flex gap-6 text-sm text-gray-400">
          <a href="#features">Features</a><a href="#solutions">Solutions</a><a href="#pricing">Pricing</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm font-medium text-gray-400">Login</Link>
        <Link to="/signup" className="bg-[#adc7ff] text-[#002e68] px-4 py-2 rounded-lg text-sm font-bold">Request Demo</Link>
      </div>
    </header>
    <main className="pt-40 px-8 text-center">
      <h1 className="text-7xl md:text-8xl font-black font-['Manrope'] tracking-tighter leading-tight mb-8">
        The Modern CFO's<br/><span className="text-[#adc7ff] italic">Digital Vault</span>
      </h1>
      <Link to="/signup" className="bg-[#adc7ff] text-[#002e68] px-12 py-5 rounded-2xl font-black text-xl inline-block shadow-2xl">Start for Free</Link>
    </main>
  </div>
);

// --- 2. THE VAULT (TERMINAL MASTER EDITION) ---
const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    if (userId) fetchItems(); 
  }, [userId]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { 
      setItems([]); 
    } finally {
      setIsLoading(false);
    }
  };

  // SAFE CALCULATIONS TO PREVENT CRASHING
  const totalValuation = items.reduce((acc, item) => acc + ((Number(item?.price) || 0) * (Number(item?.stock) || 0)), 0);
  const estimatedTax = totalValuation * 0.18;
  const netProfit = totalValuation - (items.reduce((acc, item) => acc + ((Number(item?.cost) || 0) * (Number(item?.stock) || 0)), 0)) - estimatedTax;

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#0e0e0e] flex items-center justify-center">
        <div className="text-[#adc7ff] font-black uppercase tracking-[0.4em] animate-pulse">Initializing Terminal...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#0e0e0e] text-white font-['Inter'] overflow-hidden fixed inset-0">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-white/5 bg-[#131313] flex flex-col p-6 flex-shrink-0">
        <div className="mb-10 font-['Manrope']">
          <span className="text-xl font-black tracking-tighter">QueryFlow Vault</span>
          <p className="text-[10px] text-gray-600 font-['Space_Grotesk'] uppercase tracking-widest mt-1">Enterprise Finance</p>
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#adc7ff]/10 text-[#adc7ff] rounded-xl text-sm font-black">
            <span className="material-symbols-outlined text-lg">dashboard</span> Dashboard
          </button>
          {['Inventory', 'Reports', 'AI Advisor', 'Settings'].map(item => (
            <button key={item} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white rounded-xl text-sm font-semibold">
              <span className="material-symbols-outlined text-lg opacity-30">circle</span> {item}
            </button>
          ))}
        </nav>
        <div className="mt-auto border border-[#66dd8b]/20 bg-[#66dd8b]/5 text-[#66dd8b] py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-3">
          <span className="w-2 h-2 bg-[#66dd8b] rounded-full animate-pulse"></span> AI Active State
        </div>
      </aside>

      {/* DASHBOARD AREA */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 border-b border-white/5 flex justify-between items-center px-10 bg-[#131313]/50 backdrop-blur-xl">
          <h2 className="text-2xl font-black font-['Manrope'] tracking-tight">CFO Overview</h2>
          <div className="flex items-center gap-6">
            <input 
              className="bg-[#1c1b1b] border-none rounded-xl px-10 py-2 text-sm w-80 outline-none focus:ring-1 ring-[#adc7ff]/40 text-white" 
              placeholder="Search ledger..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <button onClick={onLogout} className="text-gray-500 hover:text-white material-symbols-outlined text-xl">logout</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          
          {/* TOP KPI ROW (EXACT COLORS FROM SCREENSHOT) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-12">
            <div className="bg-[#1c1b1b] p-7 rounded-3xl border border-white/5 border-l-4 border-[#adc7ff] shadow-2xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-widest">Inventory Valuation</span>
              <h3 className="text-3xl font-black font-['Manrope'] mt-2 tracking-tight">${totalValuation.toLocaleString()}</h3>
              <p className="text-[10px] text-[#66dd8b] font-bold mt-3">↗ +4.2% vs last month</p>
            </div>
            <div className="bg-[#1c1b1b] p-7 rounded-3xl border border-white/5 border-l-4 border-[#fbbc00] shadow-2xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-widest">Estimated Tax (18%)</span>
              <h3 className="text-3xl font-black font-['Manrope'] mt-2 tracking-tight">${estimatedTax.toLocaleString()}</h3>
              <p className="text-[10px] text-gray-500 font-bold mt-3 uppercase">Provisioned</p>
            </div>
            <div className="bg-[#1c1b1b] p-7 rounded-3xl border border-white/5 border-l-4 border-[#66dd8b] shadow-2xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-widest">Net Profit</span>
              <h3 className="text-3xl font-black font-['Manrope'] mt-2 text-[#66dd8b] tracking-tight">${netProfit.toLocaleString()}</h3>
              <p className="text-[10px] text-gray-500 font-bold mt-3 uppercase">Optimized</p>
            </div>
            <div className="bg-[#1c1b1b] p-7 rounded-3xl border border-white/5 border-l-4 border-gray-700 shadow-2xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-widest">Active SKUs</span>
              <h3 className="text-3xl font-black font-['Manrope'] mt-2 tracking-tight">{items.length}</h3>
              <p className="text-[10px] text-gray-500 font-bold mt-3 uppercase">98% In-Stock</p>
            </div>
          </div>

          <div className="flex gap-10 items-start">
            {/* ASSET LIST (MATCHES SCREENSHOT) */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-8 px-2">
                <h3 className="font-black font-['Manrope'] uppercase tracking-widest text-xs text-gray-500">Critical Inventory Assets</h3>
                <button className="bg-[#adc7ff] text-[#002e68] px-5 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-[#adc7ff]/10">Export CSV</button>
              </div>
              <div className="grid grid-cols-2 gap-5">
                {items.filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                  <div key={item.id} className="bg-[#1c1b1b] p-7 rounded-[2.5rem] border border-white/5 flex gap-6 hover:border-[#adc7ff]/30 transition-all shadow-xl">
                    <div className="w-20 h-20 bg-black/40 rounded-3xl flex items-center justify-center text-3xl">⌚</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg font-['Manrope'] leading-none">{item.name}</h4>
                        {item.stock <= 5 && <span className="text-[8px] font-black text-[#fbbc00] border border-[#fbbc00]/40 px-2 py-0.5 rounded-full uppercase">Reorder</span>}
                      </div>
                      <p className="text-[10px] text-gray-600 font-['Space_Grotesk'] mb-5 uppercase tracking-tighter">ID: {item.id.substring(0,10)}</p>
                      <div className="flex justify-between items-center bg-black/30 p-4 rounded-2xl">
                         <div><span className="text-[9px] text-gray-500 block uppercase font-bold tracking-widest">Price</span><span className="text-sm font-black font-['Manrope']">${(item.price || 0).toLocaleString()}</span></div>
                         <div><span className="text-[9px] text-gray-500 block uppercase font-bold tracking-widest">Margin</span><span className="text-[#66dd8b] text-sm font-black font-['Manrope']">22.5%</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI ADVISOR PANEL (MATCHES SCREENSHOT) */}
            <aside className="w-80 bg-[#1c1b1b] rounded-[2.5rem] border border-white/5 p-10 flex flex-col h-fit sticky top-0 shadow-2xl">
              <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
                <span className="material-symbols-outlined text-[#adc7ff] text-2xl animate-pulse">auto_awesome</span>
                <span className="text-lg font-black font-['Manrope'] uppercase tracking-tight">AI Advisor</span>
                <span className="ml-auto w-3 h-3 bg-[#66dd8b] rounded-full shadow-[0_0_10px_#66dd8b]"></span>
              </div>
              <div className="space-y-8">
                <div className="bg-black/30 p-6 rounded-3xl border-l-4 border-[#adc7ff]">
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed font-['Inter']">
                    Net margin for <span className="text-white font-black italic">Recent Ledger Assets</span> is stable. Logistical variance is low.
                  </p>
                  <button className="text-[11px] font-black text-[#adc7ff] mt-8 uppercase tracking-widest block">Run tax simulation →</button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* STATUS FOOTER */}
        <footer className="h-10 bg-[#131313] border-t border-white/5 flex items-center px-10 justify-between z-30 flex-shrink-0">
          <span className="text-[9px] font-['Space_Grotesk'] text-gray-600 tracking-[0.4em] uppercase">
            System Status: <span className="text-[#66dd8b] font-bold">Network Active</span> | Latency: 4ms
          </span>
          <span className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">Connection Status</span>
        </footer>
      </main>
    </div>
  );
};

// --- AUTH SCREENS ---
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
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center px-4 font-['Inter']">
      <div className="max-w-md w-full bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#adc7ff] to-[#66dd8b]"></div>
        <h2 className="text-5xl font-black font-['Manrope'] text-white mb-12 tracking-tighter">Access Terminal</h2>
        <form onSubmit={handleManualLogin} className="space-y-4">
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-5 rounded-[1.5rem] font-black text-xl hover:scale-[1.02] transition-all font-['Manrope']">SIGN IN</button>
        </form>
        <div className="mt-8"><GoogleBtn onLogin={onLogin} /></div>
      </div>
    </div>
  );
};

// --- MAIN APP ENGINE ---
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

export default App;
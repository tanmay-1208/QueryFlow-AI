import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
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

// --- 1. FULL STITCH LANDING PAGE ---
const LandingPage = () => (
  <div className="bg-[#131313] min-h-screen text-white font-['Inter'] selection:bg-[#adc7ff] selection:text-[#002e68]">
    <header className="fixed top-0 w-full h-16 flex justify-between items-center px-8 z-50 bg-[#131313]/60 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-8 font-['Manrope']">
        <span className="text-lg font-black tracking-tighter">QueryFlow Vault</span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm font-medium text-gray-400">Login</Link>
        <Link to="/signup" className="bg-[#adc7ff] text-[#002e68] px-4 py-2 rounded-lg text-sm font-bold hover:scale-105 transition-all">Request Demo</Link>
      </div>
    </header>

    <main className="pt-20">
      <section className="px-8 py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#66dd8b]"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-['Space_Grotesk']">v4.0 Live Ledger</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-black font-['Manrope'] tracking-tighter leading-[0.9]">
            The Modern CFO's<br/><span className="text-[#adc7ff] italic">Digital Vault</span>
          </h1>
          <p className="max-w-xl text-lg text-gray-400 leading-relaxed">
            Unify ledger integrity with algorithmic foresight. Transform raw fiscal data into a fortress of institutional intelligence.
          </p>
          <div className="flex gap-4 pt-4">
            <Link to="/signup" className="bg-[#adc7ff] text-[#002e68] px-8 py-4 rounded-xl font-black text-lg hover:-translate-y-1 transition-all">Start for Free</Link>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-6 grid-rows-6 gap-3 h-[500px]">
          <div className="col-span-4 row-span-3 bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between backdrop-blur-md">
            <span className="text-[10px] font-['Space_Grotesk'] text-gray-500 uppercase tracking-widest">Net Revenue at Risk</span>
            <div className="space-y-2">
              <span className="text-4xl font-black text-[#adc7ff] font-['Manrope']">$4.2M</span>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[#adc7ff] w-2/3"></div></div>
            </div>
          </div>
          <div className="col-span-2 row-span-4 bg-[#1c1b1b] rounded-2xl p-6 border border-white/10 flex flex-col justify-between items-center text-center">
             <div className="w-12 h-12 bg-[#66dd8b]/10 rounded-full flex items-center justify-center text-[#66dd8b] text-2xl font-bold">↗</div>
             <div><span className="block text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-widest">YTD GROWTH</span><span className="text-2xl font-bold text-[#66dd8b]">+12.4%</span></div>
          </div>
        </div>
      </section>
    </main>
  </div>
);

// --- 2. THE VAULT (TERMINAL MASTER EDITION - FULLY CORRECTED) ---
const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { if (userId) fetchItems(); }, [userId]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setItems([]); }
  };

  const totalValuation = items.reduce((acc, item) => acc + (item.price * item.stock), 0);
  const estimatedTax = totalValuation * 0.18;
  const netProfit = (totalValuation - items.reduce((acc, item) => acc + (item.cost * item.stock), 0)) - estimatedTax;

  return (
    <div className="flex h-screen w-full bg-[#0e0e0e] text-white font-['Inter'] overflow-hidden fixed inset-0">
      {/* PERSISTENT SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#131313] flex flex-col p-6 flex-shrink-0">
        <div className="mb-10 font-['Manrope']">
          <span className="text-xl font-black tracking-tighter">QueryFlow Vault</span>
          <p className="text-[10px] text-gray-600 font-['Space_Grotesk'] uppercase tracking-[0.3em] mt-1">Enterprise Finance</p>
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#adc7ff]/10 text-[#adc7ff] rounded-2xl text-sm font-black">
            <span className="material-symbols-outlined text-xl">dashboard</span> Dashboard
          </button>
          {['Inventory', 'Reports', 'AI Advisor'].map(item => (
            <button key={item} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white rounded-2xl text-sm font-semibold transition-all">
              <span className="material-symbols-outlined text-xl opacity-30">circle</span> {item}
            </button>
          ))}
        </nav>
        <div className="mt-auto border border-[#66dd8b]/20 bg-[#66dd8b]/5 text-[#66dd8b] py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3">
          <span className="w-2.5 h-2.5 bg-[#66dd8b] rounded-full animate-pulse shadow-[0_0_8px_#66dd8b]"></span> AI Active State
        </div>
      </aside>

      {/* DASHBOARD TERMINAL */}
      <main className="flex-1 flex flex-col overflow-hidden relative min-w-0 bg-[#0e0e0e]">
        <header className="h-16 border-b border-white/5 flex justify-between items-center px-10 bg-[#131313]/50 backdrop-blur-xl z-20 flex-shrink-0">
          <h2 className="text-2xl font-black font-['Manrope'] tracking-tight">CFO Overview</h2>
          <div className="flex items-center gap-8">
            <div className="relative group">
               <span className="absolute left-4 top-2.5 text-gray-600 material-symbols-outlined text-sm">search</span>
               <input className="bg-[#1c1b1b] border-none rounded-xl px-12 py-2.5 text-sm w-80 outline-none focus:ring-1 ring-[#adc7ff]/40 text-white" placeholder="Search ledger assets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={onLogout} className="text-gray-600 hover:text-white material-symbols-outlined text-xl transition-colors">logout</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-12">
            <div className="bg-[#1c1b1b] p-7 rounded-3xl border border-white/5 border-l-4 border-[#adc7ff] shadow-2xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-[0.2em]">Inventory Valuation</span>
              <h3 className="text-3xl font-black font-['Manrope'] mt-2 tracking-tight">${totalValuation.toLocaleString()}</h3>
              <p className="text-[10px] text-[#66dd8b] font-bold mt-3 uppercase tracking-widest">↗ +4.2% vs last month</p>
            </div>
            <div className="bg-[#1c1b1b] p-7 rounded-3xl border border-white/5 border-l-4 border-[#fbbc00] shadow-2xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-[0.2em]">Estimated Tax (18%)</span>
              <h3 className="text-3xl font-black font-['Manrope'] mt-2 tracking-tight">${estimatedTax.toLocaleString()}</h3>
              <p className="text-[10px] text-gray-500 font-bold mt-3 uppercase tracking-widest">Provisioned</p>
            </div>
            <div className="bg-[#1c1b1b] p-7 rounded-3xl border border-white/5 border-l-4 border-[#66dd8b] shadow-2xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-[0.2em]">Net Profit</span>
              <h3 className="text-3xl font-black font-['Manrope'] mt-2 text-[#66dd8b] tracking-tight">${netProfit.toLocaleString()}</h3>
              <p className="text-[10px] text-gray-500 font-bold mt-3 uppercase tracking-widest">Optimized</p>
            </div>
            <div className="bg-[#1c1b1b] p-7 rounded-3xl border border-white/5 border-l-4 border-gray-700 shadow-2xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-[0.2em]">Active SKUs</span>
              <h3 className="text-4xl font-black font-['Manrope'] mt-2 tracking-tight">{items.length}</h3>
              <p className="text-[10px] text-gray-500 font-bold mt-3 uppercase tracking-widest">98% in-stock</p>
            </div>
          </div>

          <div className="flex gap-10 items-start">
            {/* PRODUCT GRID */}
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-5">
              {items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                <div key={item.id} className="bg-[#1c1b1b] p-7 rounded-[2.5rem] border border-white/5 flex gap-6 group hover:border-[#adc7ff]/40 transition-all shadow-xl">
                  <div className="w-20 h-20 bg-black/40 rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📦</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-lg font-['Manrope'] tracking-tight truncate leading-none">{item.name}</h4>
                      {item.stock <= 5 && <span className="text-[9px] font-black text-[#fbbc00] border border-[#fbbc00]/40 px-3 py-1 rounded-full uppercase">Reorder</span>}
                    </div>
                    <p className="text-[10px] text-gray-600 font-['Space_Grotesk'] tracking-[0.1em] mb-5 uppercase">ID: {item.id.substring(0,10)}</p>
                    <div className="flex justify-between items-center bg-black/30 p-4 rounded-2xl border border-white/5">
                       <div><span className="text-[9px] text-gray-600 block uppercase font-bold tracking-widest">Price</span><span className="text-sm font-black font-['Manrope'] tracking-tight">${item.price.toLocaleString()}</span></div>
                       <div><span className="text-[9px] text-gray-600 block uppercase font-bold tracking-widest">Qty</span><span className="text-sm font-black font-['Manrope'] tracking-tight">{item.stock}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI ADVISOR PANE */}
            <aside className="w-80 bg-[#1c1b1b] rounded-[2.5rem] border border-white/5 p-10 flex flex-col h-fit sticky top-0 shadow-2xl flex-shrink-0">
              <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
                <span className="material-symbols-outlined text-[#adc7ff] text-2xl animate-pulse">auto_awesome</span>
                <span className="text-lg font-black font-['Manrope'] uppercase tracking-tight">AI Advisor</span>
                <span className="ml-auto w-3 h-3 bg-[#66dd8b] rounded-full shadow-[0_0_10px_#66dd8b]"></span>
              </div>
              <div className="space-y-8">
                <div className="bg-black/30 p-6 rounded-3xl border-l-4 border-[#adc7ff] shadow-inner">
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed font-['Inter']">
                    Net margin for <span className="text-white font-black italic">Inventory Assets</span> is healthy. Logistics costs are stable.
                  </p>
                  <button className="text-[11px] font-black text-[#adc7ff] mt-8 uppercase tracking-[0.2em] hover:text-white transition-colors block">Run tax simulation →</button>
                </div>
                <div className="bg-black/30 p-6 rounded-3xl border-l-4 border-[#66dd8b] shadow-inner">
                  <p className="text-xs text-gray-500 italic leading-relaxed font-['Inter']">
                    "Simulating... Fiscal liability is provisioned at <span className="text-[#66dd8b] font-black tracking-tight">${estimatedTax.toLocaleString()}</span>."
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* STATUS FOOTER */}
        <footer className="h-10 bg-[#131313] border-t border-white/5 flex items-center px-10 justify-between z-30 flex-shrink-0">
          <span className="text-[9px] font-['Space_Grotesk'] text-gray-600 tracking-[0.4em] uppercase">
            System Status: <span className="text-[#66dd8b] font-bold">Network Active</span> | Latency: 4ms | Last Sync: 2m ago
          </span>
          <div className="flex gap-6">
             <span className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] cursor-pointer hover:text-white transition-colors">Data Refresh</span>
             <span className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] cursor-pointer hover:text-white transition-colors">Connection Status</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

// --- 3. AUTH LAYOUT (TERMINAL LOGIN) ---
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
        <div className="text-[10px] font-['Space_Grotesk'] text-[#adc7ff] tracking-[0.5em] mb-4 uppercase">Secure Node: 042</div>
        <h2 className="text-5xl font-black font-['Manrope'] text-white mb-12 tracking-tighter leading-none">Access Terminal</h2>
        <form onSubmit={handleManualLogin} className="space-y-4">
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]/50" type="email" placeholder="Business Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]/50" type="password" placeholder="Terminal Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-5 rounded-[1.5rem] font-black text-xl hover:scale-[1.02] transition-all shadow-xl shadow-[#adc7ff]/10 font-['Manrope'] uppercase">Verify Identity</button>
        </form>
        <div className="my-10 flex items-center gap-6 text-gray-700 text-[10px] font-bold uppercase tracking-[0.3em] font-['Space_Grotesk']">
          <div className="h-px flex-1 bg-white/5"></div>Secure Gateway<div className="h-px flex-1 bg-white/5"></div>
        </div>
        <GoogleBtn onLogin={onLogin} />
      </div>
    </div>
  );
};

// --- 4. MAIN NAVIGATION ENGINE ---
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
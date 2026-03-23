import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";
const GOOGLE_CLIENT_ID = "355056127518-9jjnnp9q7mkeum589k53dseuvdsrdpnf.apps.googleusercontent.com";

// --- AUTH HELPERS ---
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

// --- LANDING PAGE ---
const LandingPage = () => (
  <div className="bg-[#131313] min-h-screen text-white font-['Inter'] selection:bg-[#adc7ff] selection:text-[#002e68]">
    <header className="fixed top-0 w-full h-16 flex justify-between items-center px-8 z-50 bg-[#131313]/60 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-8 font-['Manrope']">
        <span className="text-lg font-black tracking-tighter">QueryFlow Vault</span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white">Login</Link>
        <Link to="/signup" className="bg-[#adc7ff] text-[#002e68] px-4 py-2 rounded-lg text-sm font-bold hover:scale-105 transition-all">Request Demo</Link>
      </div>
    </header>

    <main className="pt-40 px-8 text-center">
      <h1 className="text-7xl md:text-9xl font-black font-['Manrope'] tracking-tighter leading-none mb-8">
        The Modern CFO's<br/><span className="text-[#adc7ff] italic">Digital Vault</span>
      </h1>
      <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-12 font-['Inter']">Unify ledger integrity with algorithmic foresight. Transform raw data into a fortress of institutional intelligence.</p>
      <Link to="/signup" className="bg-[#adc7ff] text-[#002e68] px-12 py-5 rounded-2xl font-black text-xl hover:translate-y-[-4px] transition-all inline-block shadow-2xl shadow-[#adc7ff]/20 font-['Manrope']">Start for Free</Link>
    </main>
  </div>
);

// --- THE VAULT (INSTITUTIONAL TERMINAL) ---
const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { fetchItems(); }, [userId]);
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
    <div className="flex h-screen bg-[#0e0e0e] text-white font-['Inter'] overflow-hidden">
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-white/5 bg-[#131313] flex flex-col p-6">
        <div className="mb-10 font-['Manrope']">
          <span className="text-lg font-black tracking-tighter">QueryFlow Vault</span>
          <p className="text-[10px] text-gray-600 font-['Space_Grotesk'] uppercase tracking-[0.2em] mt-1">Enterprise Finance</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#adc7ff]/10 text-[#adc7ff] rounded-xl text-sm font-bold">
            <span className="material-symbols-outlined text-lg">dashboard</span> Dashboard
          </button>
          {['Inventory', 'Reports', 'AI Advisor', 'Settings'].map(item => (
            <button key={item} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white rounded-xl text-sm font-medium transition-colors">
              <span className="material-symbols-outlined text-lg opacity-40">circle</span> {item}
            </button>
          ))}
        </nav>

        <div className="mt-auto border border-[#66dd8b]/20 bg-[#66dd8b]/5 text-[#66dd8b] py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-[#66dd8b] rounded-full animate-pulse"></span> AI Active State
        </div>
      </aside>

      {/* 2. MAIN TERMINAL CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/5 flex justify-between items-center px-8 bg-[#131313]/50 backdrop-blur-md">
          <h2 className="text-xl font-black font-['Manrope']">CFO Overview</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
               <span className="absolute left-3 top-2.5 text-gray-600 material-symbols-outlined text-sm">search</span>
               <input className="bg-[#1c1b1b] border-none rounded-lg px-10 py-2 text-sm w-64 outline-none focus:ring-1 ring-[#adc7ff]/30 font-['Inter']" placeholder="Search ledger..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={onLogout} className="text-gray-600 hover:text-white transition-colors material-symbols-outlined text-lg">logout</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* TOP KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 font-['Manrope']">
            <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-white/5 border-l-4 border-[#adc7ff] shadow-xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-widest">Inventory Valuation</span>
              <h3 className="text-2xl font-black mt-2">${totalValuation.toLocaleString()}</h3>
              <p className="text-[10px] text-[#66dd8b] font-bold mt-2">↗ +4.2% vs last month</p>
            </div>
            <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-white/5 border-l-4 border-[#fbbc00] shadow-xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-widest">Estimated Tax (18%)</span>
              <h3 className="text-2xl font-black mt-2">${estimatedTax.toLocaleString()}</h3>
              <p className="text-[10px] text-gray-500 font-bold mt-2">Provisioned</p>
            </div>
            <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-white/5 border-l-4 border-[#66dd8b] shadow-xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-widest">Net Profit</span>
              <h3 className="text-2xl font-black mt-2 text-[#66dd8b]">${netProfit.toLocaleString()}</h3>
              <p className="text-[10px] text-gray-500 font-bold mt-2">Optimized</p>
            </div>
            <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-white/5 border-l-4 border-gray-700 shadow-xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-widest">Active SKUs</span>
              <h3 className="text-2xl font-black mt-2">{items.length}</h3>
              <p className="text-[10px] text-gray-500 font-bold mt-2">98% in-stock</p>
            </div>
          </div>

          <div className="flex gap-8 items-start">
            {/* INVENTORY ASSETS LIST */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="font-black font-['Manrope'] uppercase tracking-widest text-xs text-gray-500">Critical Inventory Assets</h3>
                <div className="flex gap-2">
                    <button className="bg-[#1c1b1b] text-white px-4 py-2 rounded-lg font-bold text-[10px] border border-white/5 hover:bg-white/10 transition-all uppercase">Filter</button>
                    <button className="bg-[#adc7ff] text-[#002e68] px-4 py-2 rounded-lg font-black text-[10px] hover:bg-white transition-all uppercase">Export CSV</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                  <div key={item.id} className="bg-[#1c1b1b] p-6 rounded-3xl border border-white/5 flex gap-5 group hover:border-[#adc7ff]/40 transition-all shadow-lg">
                    <div className="w-20 h-20 bg-black/40 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">💎</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-base font-['Manrope'] tracking-tight">{item.name}</h4>
                        {item.stock <= 5 && <span className="text-[8px] font-black text-[#fbbc00] border border-[#fbbc00]/40 px-2 py-0.5 rounded-full uppercase">Reorder</span>}
                      </div>
                      <p className="text-[9px] text-gray-600 font-['Space_Grotesk'] tracking-tighter mb-4 uppercase">ID: {item.id.substring(0,12)}</p>
                      <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                         <div><span className="text-[8px] text-gray-600 block uppercase font-bold">Market Price</span><span className="text-xs font-black font-['Manrope']">${item.price.toLocaleString()}</span></div>
                         <div><span className="text-[8px] text-gray-600 block uppercase font-bold">Unit Cost</span><span className="text-xs font-black font-['Manrope']">${item.cost.toLocaleString()}</span></div>
                         <div><span className="text-[8px] text-gray-600 block uppercase font-bold">Margin</span><span className="text-[#66dd8b] text-xs font-black font-['Manrope']">22.5%</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. AI ADVISOR RIGHT SIDEBAR */}
            <aside className="w-80 bg-[#1c1b1b] rounded-[2rem] border border-white/5 p-8 flex flex-col h-fit sticky top-0 shadow-2xl">
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                <span className="material-symbols-outlined text-[#adc7ff] text-xl animate-pulse">auto_awesome</span>
                <span className="text-md font-black font-['Manrope'] uppercase tracking-tight">AI Advisor</span>
                <span className="ml-auto w-2 h-2 bg-[#66dd8b] rounded-full"></span>
              </div>
              <div className="space-y-6">
                <div className="bg-black/30 p-5 rounded-2xl border-l-2 border-[#adc7ff]">
                  <p className="text-xs text-gray-400 font-medium leading-relaxed font-['Inter']">
                    Net margin for <span className="text-white font-black italic">Rolex SKU</span> has dropped 2.1% due to logistical variance. Adjusting price by +1.5% recommended.
                  </p>
                  <button className="text-[10px] font-black text-[#adc7ff] mt-6 uppercase tracking-widest hover:text-white font-['Space_Grotesk']">Run tax simulation →</button>
                </div>
                <div className="bg-black/30 p-5 rounded-2xl border-l-2 border-[#66dd8b]">
                  <p className="text-xs text-gray-500 italic leading-relaxed font-['Inter']">
                    "Simulating... Tax liability is provisioned at <span className="text-[#66dd8b] font-bold">$82,450</span>. Deductions available on reorder stock: $12,200."
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* FOOTER STATUS BAR */}
        <footer className="h-10 bg-[#131313] border-t border-white/5 flex items-center px-8 justify-between">
          <span className="text-[9px] font-['Space_Grotesk'] text-gray-600 tracking-[0.3em] uppercase">
            System Status: <span className="text-[#66dd8b] font-bold">Network Active</span> | Last Sync: 2m ago
          </span>
          <div className="flex gap-4">
             <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Data Refresh</span>
             <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Connection Status</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

// --- AUTH COMPONENTS ---
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
      <div className="max-w-md w-full bg-[#1c1b1b] p-12 rounded-[3.5rem] border border-white/5 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#adc7ff] to-[#66dd8b]"></div>
        <div className="text-[10px] font-['Space_Grotesk'] text-[#adc7ff] tracking-[0.4em] mb-4 uppercase">Secure Node: 042</div>
        <h2 className="text-4xl font-black font-['Manrope'] text-white mb-10 tracking-tighter">Access Terminal</h2>
        <form onSubmit={handleManualLogin} className="space-y-4">
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-2xl px-6 py-4" type="email" placeholder="Business Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-2xl px-6 py-4" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-4 rounded-2xl font-black text-lg hover:scale-[1.02] transition-all shadow-xl shadow-[#adc7ff]/10 font-['Manrope']">VERIFY IDENTITY</button>
        </form>
        <div className="my-10 flex items-center gap-4 text-gray-700 text-[10px] font-bold uppercase tracking-widest font-['Space_Grotesk']"><div className="h-px flex-1 bg-white/5"></div>Secure Gateway<div className="h-px flex-1 bg-white/5"></div></div>
        <GoogleBtn onLogin={onLogin} />
      </div>
    </div>
  );
};

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
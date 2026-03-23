import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";

// --- 1. FULL SCROLLABLE LANDING PAGE (EXACT STRUCTURE) ---
const LandingPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen text-white font-['Inter'] selection:bg-[#4182ff]">
    {/* Navigation */}
    <nav className="flex justify-between items-center px-10 py-8 max-w-7xl mx-auto border-b border-white/5">
      <div className="flex items-center gap-12">
        <span className="text-xl font-black tracking-tighter font-['Manrope']">QueryFlow Vault</span>
        <div className="hidden lg:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <Link to="/login" className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-[#adc7ff]">Login</Link>
        <Link to="/login" className="bg-[#4182ff] text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl">Request Demo</Link>
      </div>
    </nav>

    {/* SECTION 1: HERO */}
    <section className="max-w-7xl mx-auto px-10 pt-24 pb-40 grid lg:grid-cols-2 gap-20 items-center">
      <div className="animate-in fade-in slide-in-from-left duration-1000">
        <div className="inline-flex items-center gap-2 bg-[#66dd8b]/10 border border-[#66dd8b]/20 px-4 py-2 rounded-full mb-10">
          <span className="w-2 h-2 bg-[#66dd8b] rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#66dd8b]">V4.0 Live Tracking</span>
        </div>
        <h1 className="text-[85px] md:text-[105px] font-black font-['Manrope'] tracking-tighter leading-[0.85] mb-12">
          The Modern <br/>CFO's <br/><span className="text-[#adc7ff] italic">Digital Vault</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-lg leading-relaxed mb-14 font-medium">
          Unify ledger integrity with algorithmic foresight. QueryFlow Vault transforms raw fiscal data into a fortress of institutional intelligence.
        </p>
        <div className="flex flex-wrap gap-5">
          <Link to="/login" className="bg-[#4182ff] text-white px-12 py-6 rounded-2xl font-black text-lg shadow-2xl hover:bg-white hover:text-black transition-all">Start for Free</Link>
          <button className="bg-[#1c1b1b] border border-white/10 text-white px-12 py-6 rounded-2xl font-black text-lg hover:bg-white/5 transition-all">Request Demo</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 animate-in fade-in slide-in-from-right duration-1000">
        <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 col-span-2 relative overflow-hidden h-80 flex flex-col justify-between">
           <span className="text-[11px] text-gray-400 uppercase font-black tracking-[0.2em]">Net Revenue at Risk</span>
           <div className="text-7xl font-black tracking-tighter">$4.2M</div>
           <div className="absolute bottom-0 left-0 w-[85%] h-1.5 bg-[#4182ff]"></div>
        </div>
        <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 h-64 flex flex-col justify-between">
           <span className="material-symbols-outlined text-[#66dd8b] text-5xl">trending_up</span>
           <div>
             <div className="text-[11px] text-gray-500 uppercase font-black tracking-[0.2em] mb-2">YTD Growth</div>
             <div className="text-4xl font-black text-[#66dd8b] tracking-tighter">+12.4%</div>
           </div>
        </div>
        <div className="bg-[#66dd8b] p-10 rounded-[3rem] flex items-center justify-center h-64 shadow-[0_20px_50px_rgba(102,221,139,0.2)]">
           <span className="material-symbols-outlined text-[#003115] text-8xl">verified_user</span>
        </div>
      </div>
    </section>

    {/* SECTION 2: PRECISION ARCHITECTURE (Features) */}
    <section id="features" className="bg-[#0b0b0b] py-40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-10">
        <h2 className="text-7xl font-black font-['Manrope'] tracking-tighter mb-6">Precision Architecture</h2>
        <p className="text-gray-500 mb-24 text-2xl font-medium max-w-3xl leading-relaxed">Enterprise-grade tools engineered for speed, transparency, and regulatory compliance.</p>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 lg:col-span-2 flex flex-col md:flex-row gap-12 items-center overflow-hidden">
             <div className="flex-1">
               <div className="bg-[#adc7ff]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                 <span className="material-symbols-outlined text-[#adc7ff] text-3xl">inventory_2</span>
               </div>
               <h3 className="text-3xl font-black mb-6 tracking-tight">Real-time Inventory Valuation</h3>
               <p className="text-gray-400 text-lg leading-relaxed mb-10">Connect global logistics hubs to your balance sheet instantly. Automated FIFO/LIFO adjustment triggers ensure zero lag in COGS reporting.</p>
               <div className="flex gap-4">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 px-5 py-2.5 rounded-xl border border-white/5">SKU Latency: 4ms</span>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 px-5 py-2.5 rounded-xl border border-white/5 text-[#66dd8b]">Global Sync: ON</span>
               </div>
             </div>
             <div className="w-full md:w-80 h-80 bg-gradient-to-br from-[#222] to-black rounded-[3rem] border border-white/5 flex items-center justify-center opacity-40 shadow-inner overflow-hidden">
                <div className="grid grid-cols-3 gap-3 p-8 w-full">
                  {[...Array(9)].map((_, i) => <div key={i} className="h-10 bg-white/5 rounded-lg border border-white/5"></div>)}
                </div>
             </div>
          </div>

          <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="bg-[#66dd8b]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-[#66dd8b] text-3xl">psychology</span>
              </div>
              <h3 className="text-3xl font-black mb-6 tracking-tight">AI-Driven Tax Forecasting</h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-12">Predict jurisdictional liability before the quarter ends. Our engine scans 40+ global tax codes daily.</p>
            </div>
            <div className="space-y-5">
               <div className="flex justify-between text-xs font-black uppercase tracking-[0.3em] text-[#66dd8b]">
                 <span>Prediction Accuracy</span>
                 <span>99.4%</span>
               </div>
               <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-[#66dd8b] w-[99.4%] shadow-[0_0_15px_#66dd8b]"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* SECTION 3: FISCAL FUTURE CTA */}
    <section className="py-60 text-center max-w-6xl mx-auto px-10">
      <h2 className="text-[85px] md:text-[105px] font-black font-['Manrope'] tracking-tighter mb-12 leading-[0.9]">Ready to secure <br/>your fiscal future?</h2>
      <p className="text-2xl text-gray-500 mb-20 max-w-2xl mx-auto font-medium leading-relaxed">Join 400+ enterprise CFOs who have achieved total visibility with QueryFlow Vault.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-8">
        <Link to="/login" className="bg-white text-black px-16 py-7 rounded-[2.5rem] font-black text-xl hover:bg-[#adc7ff] hover:scale-105 transition-all shadow-2xl">Request Demo Access</Link>
        <button className="border border-white/20 text-white px-16 py-7 rounded-[2.5rem] font-black text-xl hover:bg-white/5 transition-all">View Security Architecture</button>
      </div>
    </section>

    <footer className="py-24 border-t border-white/5 text-center">
      <p className="text-gray-600 text-[11px] font-black uppercase tracking-[0.6em]">© 2026 QueryFlow Vault • Built for Institutional Liquidity</p>
    </footer>
  </div>
);

// --- 2. AUTH & TERMINAL (RETAINED FIXES) ---
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
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + "/vault" } });
  };
  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 text-center shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#adc7ff] to-[#66dd8b]"></div>
        <h2 className="text-5xl font-black font-['Manrope'] text-white mb-10 tracking-tighter">Access Terminal</h2>
        <form onSubmit={handleManualLogin} className="space-y-4 mb-6">
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]" type="email" placeholder="Business Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-5 rounded-[1.5rem] font-black text-xl hover:scale-[1.02] transition-all">SIGN IN</button>
        </form>
        <button onClick={handleGoogleLogin} className="w-full bg-white/5 text-white border border-white/10 py-5 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [ledger, setLedger] = useState([{ id: 1, action: "Cloud Sync Established", entity: "Terminal", value: 0, time: "Start" }]);

  useEffect(() => { if (userId) fetchItems(); }, [userId]);
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setItems([]); } finally { setIsLoading(false); }
  };
  const updateStock = async (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, (item.stock || 0) + delta);
    setItems(items.map(i => i.id === id ? { ...i, stock: newStock } : i));
    setLedger(prev => [{ id: Date.now(), action: delta > 0 ? "Inventory Purchase" : "Asset Liquidation", entity: item.name, value: -(delta * item.price), time: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
    await axios.put(`${API_BASE_URL}/api/products/${id}`, { stock: newStock, userId });
  };

  const safeItems = items || [];
  const valuation = safeItems.reduce((acc, i) => acc + (i.price * i.stock), 0);
  const profit = valuation - (valuation * 0.7) - (valuation * 0.18);

  if (isLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-black animate-pulse">BOOTING TERMINAL...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white fixed inset-0 overflow-hidden font-['Inter']">
      <aside className="w-64 border-r border-white/5 bg-[#131313] flex flex-col p-6 shrink-0">
        <div className="mb-10 font-['Manrope']"><span className="text-xl font-black">QueryFlow Vault</span></div>
        <nav className="flex-1 space-y-2">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black transition-all capitalize ${activeTab === tab ? 'bg-[#adc7ff]/10 text-[#adc7ff]' : 'text-gray-500 hover:text-white'}`}>
               <span className="material-symbols-outlined">{tab}</span> {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto bg-red-500/10 text-red-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">Exit Terminal</button>
      </aside>
      <main className="flex-1 overflow-y-auto p-10 bg-[#0e0e0e]">
        <header className="mb-10"><h2 className="text-4xl font-black font-['Manrope'] capitalize tracking-tighter">{activeTab} Overview</h2></header>
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#1c1b1b] p-8 rounded-3xl border-l-4 border-[#adc7ff]"><span className="text-[10px] uppercase text-gray-500 font-bold">Valuation</span><h3 className="text-2xl font-black">${Math.floor(valuation).toLocaleString()}</h3></div>
              <div className="bg-[#1c1b1b] p-8 rounded-3xl border-l-4 border-[#66dd8b]"><span className="text-[10px] uppercase text-gray-500 font-bold">Net Profit</span><h3 className="text-2xl font-black text-[#66dd8b]">${Math.floor(profit).toLocaleString()}</h3></div>
            </div>
            <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5">
              <h4 className="font-black uppercase text-[11px] tracking-widest text-gray-500 mb-8">Recent Activity</h4>
              <div className="space-y-4">
                {ledger.map(e => (
                  <div key={e.id} className="flex justify-between py-4 border-b border-white/5 last:border-0">
                    <div><p className="font-bold text-sm">{e.action}</p><p className="text-[10px] text-gray-500 uppercase">{e.entity} | {e.time}</p></div>
                    <span className={`font-black ${e.value >= 0 ? 'text-[#66dd8b]' : 'text-red-500'}`}>{e.value >= 0 ? '+' : '-'}${Math.floor(Math.abs(e.value)).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-2 gap-5">
            {safeItems.map(item => (
              <div key={item.id} className="bg-[#1c1b1b] p-8 rounded-[3rem] border border-white/5">
                <h4 className="text-xl font-black mb-6">{item.name}</h4>
                <div className="flex gap-3">
                  <button onClick={() => updateStock(item.id, 1)} className="flex-1 bg-white/5 py-4 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Restock</button>
                  <button onClick={() => updateStock(item.id, -1)} className="flex-1 bg-white/5 py-4 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Mark Sold</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// --- 3. MASTER APP COMPONENT (UNTOUCHED LOGIC) ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) { handleLogin(true, session.user.email); }
      setIsInitialLoading(false);
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) handleLogin(true, session.user.email);
      else { setIsAuthenticated(false); setUserId(""); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (status, id) => { 
    setIsAuthenticated(status); setUserId(id); 
    localStorage.setItem("isLoggedIn", "true"); localStorage.setItem("userId", id); 
  };

  const handleLogout = () => { 
    supabase.auth.signOut(); localStorage.clear(); setIsAuthenticated(false); setUserId(""); window.location.replace("/"); 
  };

  if (isInitialLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-black animate-pulse">SYNCHRONIZING TERMINAL...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route 
          path="/vault" 
          element={isAuthenticated ? <Vault userId={userId} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
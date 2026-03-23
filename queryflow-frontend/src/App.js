import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";

// --- 1. FULL SCROLLABLE LANDING PAGE (STITCH REPLICA) ---
const LandingPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen text-white font-['Inter'] selection:bg-[#4182ff] selection:text-white">
    {/* Navigation Bar */}
    <nav className="flex justify-between items-center px-8 md:px-16 py-8 max-w-[1400px] mx-auto border-b border-white/5">
      <div className="flex items-center gap-12">
        <span className="text-xl font-black tracking-tighter font-['Manrope']">QueryFlow Vault</span>
        <div className="hidden lg:flex gap-8 text-[13px] font-bold text-gray-500 uppercase tracking-widest">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <Link to="/login" className="text-[13px] font-black uppercase tracking-widest hover:text-[#adc7ff] transition-colors">Login</Link>
        <Link to="/login" className="bg-[#4182ff] text-white px-8 py-3.5 rounded-xl font-black text-[13px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Request Demo</Link>
      </div>
    </nav>

    {/* HERO SECTION */}
    <section className="max-w-[1400px] mx-auto px-8 md:px-16 pt-24 pb-40 grid lg:grid-cols-2 gap-20 items-center">
      <div className="animate-in fade-in slide-in-from-left duration-1000">
        <div className="inline-flex items-center gap-2 bg-[#66dd8b]/10 border border-[#66dd8b]/20 px-4 py-2 rounded-full mb-10">
          <span className="w-2 h-2 bg-[#66dd8b] rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#66dd8b]">V4.0 Live Tracking</span>
        </div>
        <h1 className="text-[90px] md:text-[110px] font-black font-['Manrope'] tracking-tighter leading-[0.85] mb-12">
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

      {/* Hero Bento Cards */}
      <div className="grid grid-cols-2 gap-5 animate-in fade-in slide-in-from-right duration-1000">
        <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 col-span-2 relative overflow-hidden h-80 flex flex-col justify-between">
           <span className="text-[11px] text-gray-500 uppercase font-black tracking-[0.2em]">Net Revenue at Risk</span>
           <div className="text-7xl font-black tracking-tighter">$4.2M</div>
           <div className="absolute bottom-0 left-0 w-[80%] h-1.5 bg-[#4182ff]"></div>
        </div>
        <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 h-64 flex flex-col justify-between">
           <span className="material-symbols-outlined text-[#66dd8b] text-5xl">trending_up</span>
           <div>
             <div className="text-[11px] text-gray-500 uppercase font-black tracking-[0.2em] mb-2">YTD Growth</div>
             <div className="text-4xl font-black text-[#66dd8b] tracking-tighter">+12.4%</div>
           </div>
        </div>
        <div className="bg-[#66dd8b] p-10 rounded-[3rem] flex items-center justify-center h-64">
           <span className="material-symbols-outlined text-[#003115] text-8xl">verified_user</span>
        </div>
      </div>
    </section>

    {/* PRECISION ARCHITECTURE (The Scroll-Down section) */}
    <section id="features" className="bg-[#0b0b0b] py-32 border-y border-white/5">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">
        <h2 className="text-7xl font-black font-['Manrope'] tracking-tighter mb-6">Precision Architecture</h2>
        <p className="text-gray-500 mb-24 text-2xl font-medium max-w-3xl">Enterprise-grade tools engineered for speed, transparency, and regulatory compliance.</p>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Big Feature Card */}
          <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 lg:col-span-2 flex flex-col md:flex-row gap-12 items-center overflow-hidden">
             <div className="flex-1">
               <div className="bg-[#adc7ff]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                 <span className="material-symbols-outlined text-[#adc7ff] text-3xl">inventory_2</span>
               </div>
               <h3 className="text-3xl font-black mb-6 tracking-tight">Real-time Inventory Valuation</h3>
               <p className="text-gray-500 text-lg leading-relaxed mb-10">Connect global logistics hubs to your balance sheet instantly. Automated FIFO/LIFO adjustment triggers ensure zero lag in COGS reporting.</p>
               <div className="flex gap-4">
                 <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-5 py-2.5 rounded-xl border border-white/5">SKU Latency: 4ms</span>
                 <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-5 py-2.5 rounded-xl border border-white/5 text-[#66dd8b]">Global Sync: ON</span>
               </div>
             </div>
             <div className="w-full md:w-80 h-80 bg-gradient-to-br from-[#252525] to-black rounded-[2.5rem] border border-white/10 flex items-center justify-center shrink-0">
                <div className="grid grid-cols-3 gap-3 p-8 w-full opacity-30">
                  {[...Array(9)].map((_, i) => <div key={i} className="h-12 bg-white/10 rounded-lg"></div>)}
                </div>
             </div>
          </div>

          {/* AI Feature Card */}
          <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="bg-[#66dd8b]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-[#66dd8b] text-3xl">psychology</span>
              </div>
              <h3 className="text-3xl font-black mb-6 tracking-tight">AI-Driven Tax Forecasting</h3>
              <p className="text-gray-500 text-lg leading-relaxed mb-12">Predict jurisdictional liability before the quarter ends. Our engine scans 40+ global tax codes daily.</p>
            </div>
            <div className="space-y-5">
               <div className="flex justify-between text-xs font-black uppercase tracking-[0.2em] text-[#66dd8b]">
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

    {/* FINAL CTA SECTION (Bottom of Scroll) */}
    <section className="py-52 text-center max-w-6xl mx-auto px-8">
      <h2 className="text-[80px] md:text-[100px] font-black font-['Manrope'] tracking-tighter mb-12 leading-[0.9]">Ready to secure <br/>your fiscal future?</h2>
      <p className="text-2xl text-gray-500 mb-20 max-w-2xl mx-auto font-medium leading-relaxed">Join 400+ enterprise CFOs who have achieved total visibility with QueryFlow Vault.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-8">
        <Link to="/login" className="bg-white text-black px-16 py-7 rounded-[2rem] font-black text-xl hover:bg-[#adc7ff] hover:scale-105 transition-all shadow-2xl">Request Demo Access</Link>
        <button className="border border-white/20 text-white px-16 py-7 rounded-[2rem] font-black text-xl hover:bg-white/5 transition-all">View Security Architecture</button>
      </div>
    </section>

    {/* Footer Mini */}
    <footer className="py-20 border-t border-white/5 text-center">
      <p className="text-gray-600 text-xs font-black uppercase tracking-[0.5em]">© 2026 QueryFlow Vault • Enterprise Edition</p>
    </footer>
  </div>
);

// --- 2. AUTH HELPERS (LOGIN COMPONENT) ---
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: { redirectTo: window.location.origin + "/vault" }
    });
    if (error) alert(error.message);
  };

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
        <form onSubmit={handleManualLogin} className="space-y-4 mb-6">
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]" type="email" placeholder="Business Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-5 rounded-[1.5rem] font-black text-xl hover:scale-[1.02] transition-all shadow-lg">SIGN IN</button>
        </form>
        <div className="relative flex items-center gap-4 mb-6">
          <div className="flex-1 h-[1px] bg-white/5"></div>
          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest font-['Inter']">OR</span>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>
        <button onClick={handleGoogleLogin} className="w-full bg-white/5 text-white border border-white/10 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          Sign in with Google
        </button>
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
  const [ledger, setLedger] = useState([{ id: 1, action: "Cloud Sync Established", entity: "System", value: 0, time: "Start" }]);
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
    const newEntry = { id: Date.now(), action: delta > 0 ? "Inventory Purchase" : "Asset Liquidation", entity: item.name || "Asset", value: transactionValue, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setLedger(prev => [newEntry, ...prev.slice(0, 4)]);
    try { await axios.put(`${API_BASE_URL}/api/products/${id}`, { stock: newStock, userId: userId }); } 
    catch (err) { console.error("Cloud Sync Failed:", err); }
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
        <button onClick={onLogout} className="mt-auto bg-red-500/10 text-red-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">Exit Terminal</button>
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
                <div className="bg-[#1c1b1b] p-7 rounded-3xl border-l-4 border-[#adc7ff] shadow-xl overflow-hidden"><span className="text-[10px] text-gray-500 uppercase block mb-1">Valuation</span><h3 className="text-2xl font-black font-['Manrope'] truncate">${totalValuation.toLocaleString()}</h3></div>
                <div className="bg-[#1c1b1b] p-7 rounded-3xl border-l-4 border-[#fbbc00] shadow-xl overflow-hidden"><span className="text-[10px] text-gray-500 uppercase block mb-1">Tax Provision</span><h3 className="text-2xl font-black truncate">-${estimatedTax.toLocaleString()}</h3></div>
                <div className="bg-[#1c1b1b] p-7 rounded-3xl border-l-4 border-[#66dd8b] shadow-xl overflow-hidden"><span className="text-[10px] text-gray-500 uppercase block mb-1">Net Profit</span><h3 className="text-2xl font-black text-[#66dd8b] truncate">${realizableProfit.toLocaleString()}</h3></div>
                <div className="bg-[#1c1b1b] p-7 rounded-3xl border-l-4 border-gray-700 shadow-xl overflow-hidden"><span className="text-[10px] text-gray-500 uppercase block mb-1">SKU Alerts</span><h3 className="text-2xl font-black text-red-500">{safeItems.filter(i => i.stock <= 5).length}</h3></div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-[#1c1b1b] p-8 rounded-[2.5rem] border border-white/5 shadow-lg">
                  <h4 className="font-black font-['Manrope'] uppercase tracking-widest text-[10px] text-gray-400 mb-8">Capital Concentration</h4>
                  <div className="space-y-6">
                    {safeItems.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="group">
                        <div className="flex justify-between text-[11px] mb-2 font-bold font-['Inter']"><span>{item.name}</span><span>${Math.floor(item.price * item.stock).toLocaleString()}</span></div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-[#adc7ff]" style={{ width: `${Math.min(100, (item.price * item.stock / (totalValuation || 1)) * 100)}%` }}></div></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`${status.bg} ${status.text} p-8 rounded-[2.5rem] flex flex-col justify-between shadow-2xl transition-all duration-500`}><span className="material-symbols-outlined text-4xl">{status.icon}</span><div><h4 className="text-2xl font-black font-['Manrope'] leading-tight">{status.label}</h4><p className="text-[10px] font-bold uppercase mt-4 tracking-widest opacity-60">{status.desc}</p></div></div>
              </div>
              <div className="bg-[#1c1b1b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <h4 className="font-black uppercase text-[10px] text-gray-400 mb-6 tracking-widest">Recent Ledger Activity</h4>
                <div className="space-y-2">
                  {ledger.map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 animate-in slide-in-from-top duration-300">
                      <div><p className="font-bold text-sm font-['Inter']">{entry.action}</p><p className="text-[9px] text-gray-500 uppercase tracking-widest">{entry.entity} | {entry.time}</p></div>
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
                     <button onClick={() => updateStock(item.id, 1)} className="flex-1 bg-white/5 hover:bg-red-500/20 py-3 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest">Restock (-Cash)</button>
                     <button onClick={() => updateStock(item.id, -1)} className="flex-1 bg-white/5 hover:bg-[#66dd8b]/20 py-3 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest">Mark Sold (+Cash)</button>
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
                  <div className="flex justify-between bg-[#66dd8b]/10 p-8 rounded-3xl mt-12 border border-[#66dd8b]/20"><span className="text-[#66dd8b] font-black uppercase tracking-widest text-xs">Projected Realizable Profit</span><span className="font-black font-['Manrope'] text-4xl text-[#66dd8b]">${realizableProfit.toLocaleString()}</span></div>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- 4. MAIN APP WRAPPER (THE NAVIGATION ENGINE) ---
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
      if (session) { handleLogin(true, session.user.email); }
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

  if (isInitialLoading) return (
    <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-black animate-pulse uppercase tracking-[0.5em]">
      SYNCHRONIZING TERMINAL...
    </div>
  );

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
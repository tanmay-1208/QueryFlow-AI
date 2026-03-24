import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";

const LandingPage = () => (
  <div className="bg-[#131313] min-h-screen text-white font-['Inter'] selection:bg-[#adc7ff] selection:text-[#002e68]">
    <header className="fixed top-0 w-full h-16 flex justify-between items-center px-8 z-50 bg-[#131313]/60 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-8 font-['Manrope']">
        <span className="text-lg font-black tracking-tighter">QueryFlow Vault</span>
        <nav className="hidden md:flex gap-6 text-sm text-gray-400 font-medium tracking-tight">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm font-medium text-gray-400">Login</Link>
        <Link to="/signup" className="bg-[#adc7ff] text-[#002e68] px-4 py-2 rounded-lg text-sm font-bold hover:scale-105 transition-all">Request Demo</Link>
      </div>
    </header>

    <main className="pt-20">
      {/* SECTION: HERO */}
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
            <button className="bg-[#1c1b1b] border border-white/10 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">Request Demo</button>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-6 grid-rows-6 gap-3 h-[500px]">
          <div className="col-span-4 row-span-3 bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between backdrop-blur-md">
            <span className="text-[10px] font-['Space_Grotesk'] text-gray-500 uppercase tracking-widest">Net Revenue at Risk</span>
            <div className="space-y-2">
              <span className="text-4xl font-black text-[#adc7ff] font-['Manrope']">$4.2M</span>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#adc7ff] w-2/3"></div>
              </div>
            </div>
          </div>
          <div className="col-span-2 row-span-4 bg-[#1c1b1b] rounded-2xl p-6 border border-white/10 flex flex-col justify-between items-center text-center">
             <div className="w-12 h-12 bg-[#66dd8b]/10 rounded-full flex items-center justify-center text-[#66dd8b] text-2xl font-bold">↗</div>
             <div><span className="block text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-widest">YTD GROWTH</span><span className="text-2xl font-bold text-[#66dd8b] font-['Inter']">+12.4%</span></div>
          </div>
          <div className="col-span-4 row-span-3 bg-[#66dd8b] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#66dd8b]/20">
            <div className="w-16 h-16 bg-[#003115] rounded-full flex items-center justify-center text-[#66dd8b] text-4xl font-black">✓</div>
          </div>
        </div>
      </section>

      {/* SECTION: PRECISION ARCHITECTURE */}
      <section id="features" className="py-24 px-8 bg-[#0e0e0e] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-['Manrope'] font-black text-white mb-4 tracking-tight">Precision Architecture</h2>
            <p className="text-gray-500 max-w-2xl">Enterprise-grade tools engineered for institutional speed and compliance.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-[#1c1b1b] rounded-3xl p-10 border border-white/5 flex flex-col md:flex-row justify-between group hover:border-[#adc7ff]/30 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#adc7ff]/10 flex items-center justify-center text-[#adc7ff]">
                   <span className="material-symbols-outlined">inventory_2</span>
                </div>
                <h3 className="text-2xl font-black font-['Manrope'] tracking-tight">Real-time Inventory Valuation</h3>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">Connect global logistics hubs to your balance sheet instantly. Automated triggers ensure zero lag in reporting.</p>
                <div className="flex gap-4 pt-4">
                  <div className="text-[10px] font-['Space_Grotesk'] text-gray-500 px-3 py-1 bg-white/5 rounded border border-white/5 uppercase tracking-widest">SKU Latency: 4ms</div>
                  <div className="text-[10px] font-['Space_Grotesk'] text-gray-500 px-3 py-1 bg-white/5 rounded border border-white/5 uppercase tracking-widest">Global Sync: On</div>
                </div>
              </div>
              <div className="mt-8 md:mt-0 md:w-1/3 bg-gradient-to-br from-[#adc7ff]/10 to-transparent rounded-2xl opacity-20"></div>
            </div>

            <div className="md:col-span-4 bg-[#1c1b1b] rounded-3xl p-10 border border-white/5 flex flex-col justify-between hover:border-[#66dd8b]/30 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#66dd8b]/10 flex items-center justify-center text-[#66dd8b]">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <h3 className="text-2xl font-black font-['Manrope'] tracking-tight">AI-Driven Tax Forecasting</h3>
                <p className="text-sm text-gray-500">Predict jurisdictional liability before the quarter ends. Scanning 40+ global codes daily.</p>
              </div>
              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="flex justify-between text-xs font-['Space_Grotesk'] text-[#66dd8b] mb-2 font-bold uppercase tracking-widest">
                  <span>Accuracy</span><span>99.4%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#66dd8b] w-[99.4%] shadow-[0_0_12px_#66dd8b]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: LEDGER */}
      <section className="py-24 px-8 bg-[#0e0e0e]">
        <div className="max-w-7xl mx-auto bg-[#1c1b1b] rounded-3xl border border-[#adc7ff]/20 overflow-hidden relative">
          <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/5">
             <span className="text-[10px] font-['Space_Grotesk'] uppercase tracking-[0.3em] text-[#adc7ff]">Consolidated Ledger v4.2</span>
             <div className="w-2.5 h-2.5 rounded-full bg-[#adc7ff] animate-pulse"></div>
          </div>
          <div className="p-10 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] font-['Space_Grotesk'] text-gray-500 uppercase tracking-widest">
                <tr><th className="pb-6">Entity</th><th className="pb-6">Currency</th><th className="pb-6">Balance</th><th className="pb-6">Status</th><th className="pb-6 text-right">Trend</th></tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                <tr className="hover:bg-white/5 transition-colors"><td className="py-5 font-bold text-white">EMEA North</td><td className="py-5 text-gray-500">EUR</td><td className="py-5 text-white font-black font-['Manrope']">1,492,000.00</td><td className="py-5"><span className="px-2 py-1 rounded-lg bg-[#66dd8b]/10 text-[#66dd8b] text-[10px] font-black tracking-widest">VERIFIED</span></td><td className="py-5 text-right text-[#66dd8b] font-black">+4.2%</td></tr>
                <tr className="hover:bg-white/5 transition-colors"><td className="py-5 font-bold text-white">APAC West</td><td className="py-5 text-gray-500">SGD</td><td className="py-5 text-white font-black font-['Manrope']">840,230.15</td><td className="py-5"><span className="px-2 py-1 rounded-lg bg-[#66dd8b]/10 text-[#66dd8b] text-[10px] font-black tracking-widest">VERIFIED</span></td><td className="py-5 text-right text-[#66dd8b] font-black">+1.8%</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION: FINAL CTA */}
      <section className="py-40 px-8 text-center relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-primary/5 blur-[150px]"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-12">
          <h2 className="text-6xl font-black font-['Manrope'] text-white tracking-tighter leading-tight">Ready to secure your fiscal future?</h2>
          <p className="text-gray-400 text-xl max-w-xl mx-auto">Join 400+ enterprise CFOs who have achieved total visibility with QueryFlow Vault.</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 pt-6">
            <Link to="/signup" className="w-full md:w-auto px-16 py-6 bg-white text-black font-black rounded-2xl hover:bg-[#adc7ff] transition-all text-xl">Request Demo Access</Link>
            <button className="w-full md:w-auto px-16 py-6 bg-transparent border border-white/20 text-white font-black rounded-2xl hover:bg-white/5 transition-all text-xl">View Security Architecture</button>
          </div>
        </div>
      </section>
    </main>

    <footer className="py-12 px-8 border-t border-white/5 bg-[#131313] flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-['Space_Grotesk'] uppercase tracking-[0.3em] text-gray-600">© 2026 QueryFlow Vault. System Status: <span className="text-[#66dd8b] font-bold">Operational.</span></span>
      </div>
      <div className="flex gap-8 text-[10px] font-['Space_Grotesk'] uppercase tracking-widest text-gray-600">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a><a href="#" className="hover:text-white transition-colors">Terms of Service</a><a href="#" className="hover:text-white transition-colors">Security</a>
      </div>
    </footer>
  </div>
);

// --- 2. REST OF YOUR CODE (STAYS UNCHANGED) ---
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
    if (!error) { onLogin(true, data.user.email); navigate("/vault"); }
    else { alert(error.message); }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center px-4 font-['Inter']">
      <div className="max-w-md w-full bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#adc7ff] to-[#66dd8b]"></div>
        <h2 className="text-5xl font-black font-['Manrope'] text-white mb-10 tracking-tighter">Access Terminal</h2>
        <form onSubmit={handleManualLogin} className="space-y-4 mb-6">
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]" type="email" placeholder="Business Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-5 rounded-[1.5rem] font-black text-xl hover:scale-[1.02] transition-all">SIGN IN</button>
        </form>
        <div className="relative flex items-center gap-4 mb-6">
          <div className="flex-1 h-[1px] bg-white/5"></div>
          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">OR</span>
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

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [ledger, setLedger] = useState([{ id: 1, action: "System Initialization", entity: "Node 04", status: "Verified", value: 0, time: "Start" }]);
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

  // --- AI LOGIC FIX ---
  const handleChat = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const newHistory = [...chatHistory, { role: 'user', text: userQuery }];
    setChatHistory(newHistory);
    setUserQuery("");
    setIsAnalyzing(true);

    setTimeout(() => {
      let reply = "I have analyzed the fiscal ledger. Risk levels are within normal parameters.";
      const q = userQuery.toLowerCase();

      // CA Level Logic branching
      if (q.includes("tax") && q.includes("credit")) {
        const potentialSavings = 250000;
        reply = `Applying a $250k R&D tax credit would reduce your provision to $${(estimatedTax - potentialSavings).toLocaleString()}. This shifts net realizable profit to $${(realizableProfit + potentialSavings).toLocaleString()}, improving effective tax rate by approx 7.4%.`;
      } 
      else if (q.includes("profit") || q.includes("make") || q.includes("improve")) {
        reply = `Your current realizable profit is $${realizableProfit.toLocaleString()}. To improve this, I suggest liquidating low-turnover SKUs and reallocating capital to high-margin assets like the Vintage Rolex collection.`;
      } 
      else if (q.includes("liquidity") || q.includes("liquidate")) {
        reply = `A 50% liquidation of current vaulted stock would generate $${Math.floor(totalValuation * 0.5).toLocaleString()} in immediate cash flow. This would drastically improve your quick ratio from 1.1 to 1.9.`;
      } 
      else if (q.includes("valuation") || q.includes("worth")) {
        reply = `The total portfolio valuation is currently $${totalValuation.toLocaleString()}. Capital is heavily concentrated in luxury timepieces, representing ${(valuation / 1000000).toFixed(1)}M in net equity.`;
      }

      setChatHistory([...newHistory, { role: 'assistant', text: reply }]);
      setIsAnalyzing(false);
    }, 1000);
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

      <aside className="w-80 bg-[#1c1b1b] border-l border-white/5 p-6 flex flex-col h-full shrink-0 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4"><span className="text-[11px] font-black font-['Manrope'] uppercase tracking-widest">AI Advisor</span></div>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 custom-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-4 rounded-2xl text-[11px] leading-relaxed font-['Inter'] ${msg.role === 'assistant' ? 'bg-black/30 border-l-2 border-[#adc7ff] text-gray-400' : 'bg-[#adc7ff]/10 text-[#adc7ff] text-right'}`}>{msg.text}</div>
          ))}
          {isAnalyzing && <div className="p-3 text-[10px] text-[#adc7ff] animate-pulse">CFO AI is auditing ledger...</div>}
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

// --- 4. MAIN APP COMPONENT (MASTER SESSION FIX) ---
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
    <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-bold animate-pulse">
      SYNCHRONIZING TERMINAL...
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/vault" element={isAuthenticated ? <Vault userId={userId} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
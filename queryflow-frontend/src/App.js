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

// --- 2. THE VAULT (TERMINAL MASTER EDITION) ---
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
      {/* PERSISTENT SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#131313] flex flex-col p-6">
        <div className="mb-10 font-['Manrope']">
          <span className="text-xl font-black tracking-tighter">QueryFlow Vault</span>
          <p className="text-[10px] text-gray-600 font-['Space_Grotesk'] uppercase tracking-[0.3em] mt-1">Enterprise Finance</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#adc7ff]/10 text-[#adc7ff] rounded-2xl text-sm font-black">
            <span className="material-symbols-outlined text-xl">dashboard</span> Dashboard
          </button>
          {['Inventory', 'Reports', 'AI Advisor', 'Settings'].map((item, idx) => (
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
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-white/5 flex justify-between items-center px-10 bg-[#131313]/50 backdrop-blur-xl z-20">
          <h2 className="text-2xl font-black font-['Manrope'] tracking-tight">CFO Overview</h2>
          <div className="flex items-center gap-8">
            <div className="relative group">
               <span className="absolute left-4 top-2.5 text-gray-600 material-symbols-outlined text-sm group-hover:text-[#adc7ff] transition-colors">search</span>
               <input className="bg-[#1c1b1b] border-none rounded-xl px-12 py-2.5 text-sm w-80 outline-none focus:ring-1 ring-[#adc7ff]/40 transition-all font-['Inter']" placeholder="Search ledger assets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={onLogout} className="text-gray-600 hover:text-white transition-colors material-symbols-outlined text-xl">logout</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          {/* KPI CARDS: TRIPLE COLOR BORDERS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-12">
            <div className="bg-[#1c1b1b] p-7 rounded-3xl border border-white/5 border-l-4 border-[#adc7ff] shadow-2xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-[0.2em]">Inventory Valuation</span>
              <h3 className="text-4xl font-black font-['Manrope'] mt-2 tracking-tight">${totalValuation.toLocaleString()}</h3>
              <p className="text-[10px] text-[#66dd8b] font-bold mt-3 uppercase tracking-widest">↗ +4.2% vs last month</p>
            </div>
            <div className="bg-[#1c1b1b] p-7 rounded-3xl border border-white/5 border-l-4 border-[#fbbc00] shadow-2xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-[0.2em]">Estimated Tax (18%)</span>
              <h3 className="text-4xl font-black font-['Manrope'] mt-2 tracking-tight">${estimatedTax.toLocaleString()}</h3>
              <p className="text-[10px] text-gray-500 font-bold mt-3 uppercase tracking-widest">Provisioned</p>
            </div>
            <div className="bg-[#1c1b1b] p-7 rounded-3xl border border-white/5 border-l-4 border-[#66dd8b] shadow-2xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-[0.2em]">Net Profit</span>
              <h3 className="text-4xl font-black font-['Manrope'] mt-2 text-[#66dd8b] tracking-tight">${netProfit.toLocaleString()}</h3>
              <p className="text-[10px] text-gray-500 font-bold mt-3 uppercase tracking-widest">Optimized</p>
            </div>
            <div className="bg-[#1c1b1b] p-7 rounded-3xl border border-white/5 border-l-4 border-gray-700 shadow-2xl">
              <span className="text-[10px] text-gray-500 font-['Space_Grotesk'] uppercase tracking-[0.2em]">Active SKUs</span>
              <h3 className="text-4xl font-black font-['Manrope'] mt-2 tracking-tight">{items.length}</h3>
              <p className="text-[10px] text-gray-500 font-bold mt-3 uppercase tracking-widest">98% in-stock</p>
            </div>
          </div>

          <div className="flex gap-10 items-start">
            {/* PRODUCT BENTO LIST */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-8 px-2">
                <h3 className="font-black font-['Manrope'] uppercase tracking-[0.2em] text-xs text-gray-500">Critical Inventory Assets</h3>
                <div className="flex gap-3">
                    <button className="bg-[#1c1b1b] text-white px-5 py-2.5 rounded-xl font-black text-[10px] border border-white/5 hover:bg-white/10 transition-all uppercase tracking-widest">Filter</button>
                    <button className="bg-[#adc7ff] text-[#002e68] px-5 py-2.5 rounded-xl font-black text-[10px] hover:bg-white transition-all uppercase tracking-widest">Export CSV</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                {items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                  <div key={item.id} className="bg-[#1c1b1b] p-7 rounded-[2.5rem] border border-white/5 flex gap-6 group hover:border-[#adc7ff]/40 transition-all shadow-xl">
                    <div className="w-20 h-20 bg-black/40 rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">📦</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-lg font-['Manrope'] tracking-tight leading-none">{item.name}</h4>
                        {item.stock <= 5 && <span className="text-[9px] font-black text-[#fbbc00] border border-[#fbbc00]/40 px-3 py-1 rounded-full uppercase tracking-tighter">Reorder</span>}
                      </div>
                      <p className="text-[10px] text-gray-600 font-['Space_Grotesk'] tracking-[0.1em] mb-5 uppercase">ID: {item.id.substring(0,10)}</p>
                      <div className="flex justify-between items-center bg-black/30 p-4 rounded-2xl border border-white/5">
                         <div><span className="text-[9px] text-gray-600 block uppercase font-bold tracking-widest">Price</span><span className="text-sm font-black font-['Manrope'] tracking-tight">${item.price.toLocaleString()}</span></div>
                         <div><span className="text-[9px] text-gray-600 block uppercase font-bold tracking-widest">Qty</span><span className="text-sm font-black font-['Manrope'] tracking-tight">{item.stock}</span></div>
                         <div><span className="text-[9px] text-gray-600 block uppercase font-bold tracking-widest">Margin</span><span className="text-[#66dd8b] text-sm font-black font-['Manrope'] tracking-tight">22.5%</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STITCH AI ADVISOR PANE */}
            <aside className="w-80 bg-[#1c1b1b] rounded-[2.5rem] border border-white/5 p-10 flex flex-col h-fit sticky top-0 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-t-[#adc7ff]/20">
              <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
                <span className="material-symbols-outlined text-[#adc7ff] text-2xl animate-pulse">auto_awesome</span>
                <span className="text-lg font-black font-['Manrope'] uppercase tracking-tight">AI Advisor</span>
                <span className="ml-auto w-3 h-3 bg-[#66dd8b] rounded-full shadow-[0_0_10px_#66dd8b]"></span>
              </div>
              <div className="space-y-8">
                <div className="bg-black/30 p-6 rounded-3xl border-l-4 border-[#adc7ff] shadow-inner">
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed font-['Inter']">
                    Net margin for <span className="text-white font-black italic">Recent SKUs</span> has dropped 2.1% due to logistical variance. Adjusting price by <span className="text-[#66dd8b] font-black">+1.5%</span> recommended.
                  </p>
                  <button className="text-[11px] font-black text-[#adc7ff] mt-8 uppercase tracking-[0.2em] hover:text-white transition-colors block">Run tax simulation →</button>
                </div>
                <div className="bg-black/30 p-6 rounded-3xl border-l-4 border-[#66dd8b] shadow-inner">
                  <p className="text-xs text-gray-500 italic leading-relaxed font-['Inter']">
                    "Simulating... Fiscal liability is provisioned at <span className="text-[#66dd8b] font-black tracking-tight">$82,450</span>. Deductions available on reorder inventory: $12,200."
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* STATUS FOOTER */}
        <footer className="h-10 bg-[#131313] border-t border-white/5 flex items-center px-10 justify-between z-30">
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
        <h2 className="text-5xl font-black font-['Manrope'] text-white mb-12 tracking-tighter">Access Terminal</h2>
        <form onSubmit={handleManualLogin} className="space-y-4">
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]/50" type="email" placeholder="Business Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]/50" type="password" placeholder="Terminal Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-5 rounded-[1.5rem] font-black text-xl hover:scale-[1.02] transition-all shadow-xl shadow-[#adc7ff]/10 font-['Manrope']">VERIFY IDENTITY</button>
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
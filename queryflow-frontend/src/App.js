import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";

// --- 1. FULL SCROLLABLE LANDING PAGE (SCROLL FIX APPLIED) ---
const LandingPage = () => (
  <div className="bg-[#0e0e0e] text-white font-['Inter'] selection:bg-[#4182ff]">
    {/* Navigation Bar - Fixed at top */}
    <nav className="fixed top-0 w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex justify-between items-center px-10 py-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-12">
          <span className="text-xl font-black tracking-tighter font-['Manrope']">QueryFlow Vault</span>
          <div className="hidden lg:flex gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">Login</Link>
          <Link to="/login" className="bg-[#4182ff] text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">Request Demo</Link>
        </div>
      </div>
    </nav>

    {/* SECTION 1: HERO */}
    <section className="max-w-[1400px] mx-auto px-10 pt-48 pb-32 grid lg:grid-cols-2 gap-24 items-center">
      <div className="animate-in fade-in slide-in-from-left duration-1000">
        <div className="inline-flex items-center gap-2 bg-[#66dd8b]/10 border border-[#66dd8b]/20 px-4 py-2 rounded-full mb-12">
          <span className="w-2 h-2 bg-[#66dd8b] rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#66dd8b]">V4.0 Live Tracking</span>
        </div>
        <h1 className="text-[90px] md:text-[115px] font-black font-['Manrope'] tracking-tighter leading-[0.85] mb-14">
          The Modern <br/>CFO's <br/><span className="text-[#adc7ff] italic">Digital Vault</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-lg leading-relaxed mb-16 font-medium">
          Unify ledger integrity with algorithmic foresight. QueryFlow Vault transforms raw fiscal data into a fortress of institutional intelligence.
        </p>
        <div className="flex flex-wrap gap-5">
          <Link to="/login" className="bg-[#4182ff] text-white px-12 py-6 rounded-2xl font-black text-lg shadow-2xl hover:bg-white hover:text-black transition-all">Start for Free</Link>
          <button className="bg-[#1c1b1b] border border-white/10 text-white px-12 py-6 rounded-2xl font-black text-lg hover:bg-white/5 transition-all">Request Demo</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right duration-1000">
        <div className="bg-[#1c1b1b] p-12 rounded-[3.5rem] border border-white/5 col-span-2 relative overflow-hidden h-80 flex flex-col justify-between shadow-2xl">
           <span className="text-[11px] text-gray-500 uppercase font-black tracking-[0.2em]">Net Revenue at Risk</span>
           <div className="text-[80px] font-black tracking-tighter leading-none">$4.2M</div>
           <div className="absolute bottom-0 left-0 w-[75%] h-2 bg-[#4182ff]"></div>
        </div>
        <div className="bg-[#1c1b1b] p-10 rounded-[3.5rem] border border-white/5 h-64 flex flex-col justify-between shadow-xl">
           <span className="material-symbols-outlined text-[#66dd8b] text-5xl">trending_up</span>
           <div>
             <div className="text-[11px] text-gray-500 uppercase font-black tracking-[0.2em] mb-2">YTD Growth</div>
             <div className="text-4xl font-black text-[#66dd8b] tracking-tighter">+12.4%</div>
           </div>
        </div>
        <div className="bg-[#66dd8b] p-10 rounded-[3.5rem] flex items-center justify-center h-64 shadow-2xl shadow-[#66dd8b]/20">
           <span className="material-symbols-outlined text-[#003115] text-8xl">verified_user</span>
        </div>
      </div>
    </section>

    {/* SECTION 2: PRECISION ARCHITECTURE */}
    <section id="features" className="bg-[#0b0b0b] py-48 border-y border-white/5">
      <div className="max-w-[1400px] mx-auto px-10">
        <h2 className="text-[70px] font-black font-['Manrope'] tracking-tighter mb-8 leading-tight">Precision Architecture</h2>
        <p className="text-gray-500 mb-32 text-2xl font-medium max-w-3xl leading-relaxed">Enterprise-grade tools engineered for speed, transparency, and regulatory compliance.</p>
        
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="bg-[#1c1b1b] p-14 rounded-[4rem] border border-white/5 lg:col-span-2 flex flex-col md:flex-row gap-12 items-center overflow-hidden relative group hover:border-[#adc7ff]/30 transition-all duration-500">
             <div className="flex-1 z-10">
               <div className="bg-[#adc7ff]/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 border border-[#adc7ff]/20">
                 <span className="material-symbols-outlined text-[#adc7ff] text-4xl">inventory_2</span>
               </div>
               <h3 className="text-4xl font-black mb-6 tracking-tight">Real-time Inventory Valuation</h3>
               <p className="text-gray-400 text-xl leading-relaxed mb-12">Connect global logistics hubs to your balance sheet instantly. Automated triggers ensure zero lag in reporting.</p>
               <div className="flex gap-4">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-xl border border-white/5">SKU Latency: 4ms</span>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-xl border border-white/5 text-[#66dd8b]">Global Sync: ON</span>
               </div>
             </div>
             <div className="w-full md:w-96 h-96 bg-gradient-to-br from-[#252525] to-black rounded-[3rem] border border-white/5 flex items-center justify-center opacity-40 shadow-inner group-hover:opacity-60 transition-opacity">
                <div className="grid grid-cols-3 gap-4 p-10 w-full">
                  {[...Array(9)].map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl border border-white/5"></div>)}
                </div>
             </div>
          </div>

          <div className="bg-[#1c1b1b] p-14 rounded-[4rem] border border-white/5 flex flex-col justify-between hover:border-[#66dd8b]/30 transition-all duration-500">
            <div>
              <div className="bg-[#66dd8b]/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 border border-[#66dd8b]/20">
                <span className="material-symbols-outlined text-[#66dd8b] text-4xl">psychology</span>
              </div>
              <h3 className="text-4xl font-black mb-6 tracking-tight">AI Tax Forecasting</h3>
              <p className="text-gray-400 text-xl leading-relaxed">Predict jurisdictional liability before the quarter ends. Our engine scans 40+ global tax codes daily.</p>
            </div>
            <div className="space-y-6 pt-12">
               <div className="flex justify-between text-xs font-black uppercase tracking-[0.3em] text-[#66dd8b]">
                 <span>Accuracy</span>
                 <span>99.4%</span>
               </div>
               <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-[#66dd8b] w-[99.4%] shadow-[0_0_20px_#66dd8b]"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* SECTION 3: CONSOLIDATED LEDGER */}
    <section className="py-48 bg-[#0e0e0e]">
        <div className="max-w-[1400px] mx-auto px-10">
            <div className="bg-[#1c1b1b] rounded-[4rem] border border-[#adc7ff]/10 overflow-hidden shadow-2xl">
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-[#adc7ff]">Consolidated Ledger V4.2</span>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-white/10"></div>
                        <div className="w-2 h-2 rounded-full bg-white/10"></div>
                        <div className="w-2 h-2 rounded-full bg-[#adc7ff] animate-pulse"></div>
                    </div>
                </div>
                <div className="p-16 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-white/5">
                                <th className="pb-10">Entity Node</th>
                                <th className="pb-10">Reporting Currency</th>
                                <th className="pb-10">Vaulted Balance</th>
                                <th className="pb-10">Compliance Status</th>
                                <th className="pb-10 text-right">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="text-lg">
                            <tr className="border-b border-white/5 group hover:bg-white/[0.02] transition-colors">
                                <td className="py-10 font-bold">EMEA North</td>
                                <td className="py-10 text-gray-500">EUR</td>
                                <td className="py-10 font-black font-['Manrope'] text-2xl">$1,492,000.00</td>
                                <td className="py-10"><span className="px-4 py-1.5 rounded-full bg-[#66dd8b]/10 text-[#66dd8b] text-[10px] font-black tracking-widest border border-[#66dd8b]/20">VERIFIED</span></td>
                                <td className="py-10 text-right text-[#66dd8b] font-black">+4.2%</td>
                            </tr>
                            <tr className="group hover:bg-white/[0.02] transition-colors">
                                <td className="py-10 font-bold">APAC West</td>
                                <td className="py-10 text-gray-500">SGD</td>
                                <td className="py-10 font-black font-['Manrope'] text-2xl">$840,230.15</td>
                                <td className="py-10"><span className="px-4 py-1.5 rounded-full bg-[#66dd8b]/10 text-[#66dd8b] text-[10px] font-black tracking-widest border border-[#66dd8b]/20">VERIFIED</span></td>
                                <td className="py-10 text-right text-[#66dd8b] font-black">+1.8%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>

    {/* SECTION 4: FISCAL FUTURE CALL TO ACTION */}
    <section className="py-64 text-center max-w-6xl mx-auto px-10 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4182ff]/5 rounded-full blur-[120px] -z-10"></div>
      <h2 className="text-[90px] md:text-[110px] font-black font-['Manrope'] tracking-tighter mb-16 leading-[0.9]">Ready to secure <br/>your fiscal future?</h2>
      <p className="text-2xl text-gray-500 mb-20 max-w-2xl mx-auto font-medium leading-relaxed">Join 400+ enterprise CFOs who have achieved total visibility with QueryFlow Vault.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-10">
        <Link to="/login" className="bg-white text-black px-16 py-8 rounded-[2.5rem] font-black text-2xl hover:bg-[#adc7ff] hover:scale-105 transition-all shadow-2xl">Request Demo Access</Link>
        <button className="border border-white/20 text-white px-16 py-8 rounded-[2.5rem] font-black text-2xl hover:bg-white/5 transition-all">View Architecture</button>
      </div>
    </section>

    {/* FINAL FOOTER */}
    <footer className="py-20 border-t border-white/5 px-10 bg-[#0b0b0b]">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.3em]">© 2026 QUERYFLOW VAULT.</p>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#66dd8b] rounded-full animate-pulse"></span>
            <span className="text-[#66dd8b] text-[11px] font-black uppercase tracking-[0.2em]">SYSTEM STATUS: OPERATIONAL.</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Security Architecture</a>
          <a href="#" className="hover:text-white transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  </div>
);

// --- 2. AUTH & VAULT COMPONENTS (UNCHANGED LOGIC) ---
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
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, (Number(item.stock) || 0) + delta);
    setItems(prevItems => prevItems.map(i => i.id === id ? { ...i, stock: newStock } : i));
    setLedger(prev => [{ id: Date.now(), action: delta > 0 ? "Inventory Purchase" : "Asset Liquidation", entity: item.name || "Asset", value: -(delta * (Number(item.price) || 0)), time: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
    try { await axios.put(`${API_BASE_URL}/api/products/${id}`, { stock: newStock, userId: userId }); } 
    catch (err) { console.error("Cloud Sync Failed:", err); }
  };

  const safeItems = items || [];
  const totalValuation = safeItems.reduce((acc, i) => acc + ((Number(i?.price) || 0) * (Number(i?.stock) || 0)), 0);
  const realizableProfit = totalValuation - (totalValuation * 0.7) - (totalValuation * 0.18);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    const newHistory = [...chatHistory, { role: 'user', text: userQuery }];
    setChatHistory(newHistory);
    setUserQuery("");
    setIsAnalyzing(true);

    setTimeout(() => {
        let reply = "Audit complete. Realizable profit projected at $" + Math.floor(realizableProfit).toLocaleString();
        const q = userQuery.toLowerCase();
        if (q.includes("tax")) reply = "Current tax provision is 18%. Applying R&D credits could save up to $250k.";
        setChatHistory([...newHistory, { role: 'assistant', text: reply }]);
        setIsAnalyzing(false);
    }, 1000);
  };

  if (isLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-bold animate-pulse">BOOTING TERMINAL...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white font-['Inter'] overflow-hidden fixed inset-0">
      <aside className="w-64 border-r border-white/5 bg-[#131313] flex flex-col p-6 shrink-0 shadow-2xl">
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
            <div className="space-y-8">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#1c1b1b] p-7 rounded-3xl border-l-4 border-[#adc7ff] shadow-xl overflow-hidden"><span className="text-[10px] text-gray-500 uppercase block mb-1">Valuation</span><h3 className="text-2xl font-black font-['Manrope'] truncate">${totalValuation.toLocaleString()}</h3></div>
                <div className="bg-[#1c1b1b] p-7 rounded-3xl border-l-4 border-[#66dd8b] shadow-xl overflow-hidden"><span className="text-[10px] text-gray-500 uppercase block mb-1">Net Profit</span><h3 className="text-2xl font-black text-[#66dd8b] truncate">${Math.floor(realizableProfit).toLocaleString()}</h3></div>
              </div>
              <div className="bg-[#1c1b1b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <h4 className="font-black uppercase text-[10px] text-gray-400 mb-6 tracking-widest">Recent Interaction</h4>
                {ledger.map(entry => (
                    <div key={entry.id} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                        <div><p className="font-bold text-sm">{entry.action}</p><p className="text-[9px] text-gray-500 uppercase">{entry.entity} | {entry.time}</p></div>
                        <span className={`font-black ${entry.value >= 0 ? 'text-[#66dd8b]' : 'text-red-500'}`}>{entry.value >= 0 ? '+' : '-'}${Math.floor(Math.abs(entry.value)).toLocaleString()}</span>
                    </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "inventory" && (
             <div className="grid grid-cols-2 gap-5">
               {safeItems.filter(i => (i.name||"").toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                 <div key={item.id} className="bg-[#1c1b1b] p-7 rounded-[2.5rem] border border-white/5 shadow-xl">
                   <h4 className="font-black text-xl mb-6 truncate">{item.name}</h4>
                   <div className="flex gap-3">
                     <button onClick={() => updateStock(item.id, 1)} className="flex-1 bg-white/5 hover:bg-red-500/20 py-3 rounded-xl text-[10px] font-black uppercase">Restock</button>
                     <button onClick={() => updateStock(item.id, -1)} className="flex-1 bg-white/5 hover:bg-[#66dd8b]/20 py-3 rounded-xl text-[10px] font-black uppercase">Mark Sold</button>
                   </div>
                 </div>
               ))}
             </div>
          )}
        </div>
      </main>

      <aside className="w-80 bg-[#1c1b1b] border-l border-white/5 p-6 flex flex-col h-full shrink-0 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 uppercase font-black text-[11px]">AI Advisor</div>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-4 rounded-2xl text-[11px] leading-relaxed font-['Inter'] ${msg.role === 'assistant' ? 'bg-black/30 border-l-2 border-[#adc7ff] text-gray-400' : 'bg-[#adc7ff]/10 text-[#adc7ff] text-right'}`}>{msg.text}</div>
          ))}
          {isAnalyzing && <div className="p-3 text-[10px] text-[#adc7ff] animate-pulse">CFO AI is auditing ledger...</div>}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleChat} className="relative mt-auto">
          <input type="text" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} placeholder="Query fiscal data..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-white outline-none focus:border-[#adc7ff]/50 transition-all" />
          <button type="submit" className="absolute right-3 top-2.5 text-[#adc7ff] material-symbols-outlined text-lg">send</button>
        </form>
      </aside>
    </div>
  );
};

// --- 4. MAIN APP COMPONENT ---
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
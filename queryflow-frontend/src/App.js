import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";

/* --- 1. SHARED COMPONENTS --- */

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-white/5">
    <div className="flex justify-between items-center px-10 py-6 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-12">
        <Link to="/" className="text-xl font-black tracking-tighter font-['Manrope']">QueryFlow Vault</Link>
        <div className="hidden lg:flex gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">
          {/* FIXED: Changed from <a> to <Link> for internal routing */}
          <Link to="/features" className="hover:text-white transition-colors">Features</Link>
          <Link to="/solutions" className="hover:text-white transition-colors">Solutions</Link>
          <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link to="/security" className="hover:text-white transition-colors">Security</Link>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Login</Link>
        <Link to="/login" className="bg-[#4182ff] text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">Request Demo</Link>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="py-20 border-t border-white/5 px-10 bg-[#0e0e0e]">
    <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
      <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 QUERYFLOW VAULT • INSTITUTIONAL GRADE</p>
      <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
        <Link to="/security">Security Protocol</Link>
        <Link to="/pricing">Licensing</Link>
      </div>
    </div>
  </footer>
);

/* --- 2. PAGE COMPONENTS --- */

const SecurityPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-10 pb-40 text-center">
      <h1 className="text-[100px] font-black font-['Manrope'] tracking-tighter mb-10 leading-none">Zero-Leak<br/><span className="text-[#66dd8b]">Fiscal Integrity</span></h1>
      <div className="grid md:grid-cols-3 gap-8 mt-20">
        <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 shadow-2xl">
          <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-gray-400">Encryption</h3>
          <p className="text-gray-500 leading-relaxed text-lg">AES-256 end-to-end data obfuscation at rest and in transit.</p>
        </div>
        <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 shadow-2xl">
          <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-gray-400">Isolation</h3>
          <p className="text-gray-500 leading-relaxed text-lg">Physically isolated database clusters for every institutional node.</p>
        </div>
        <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 shadow-2xl">
          <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-gray-400">Compliance</h3>
          <p className="text-gray-500 leading-relaxed text-lg">Full SOC2 Type II and GDPR readiness for global treasury.</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

const SolutionsPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-10 pb-40">
      <h1 className="text-[100px] font-black font-['Manrope'] tracking-tighter mb-20 leading-[0.85]">Tailored for<br/><span className="italic text-gray-600">Complex Treasury</span></h1>
      <div className="bg-[#1c1b1b] p-20 rounded-[5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-20">
        <div className="max-w-xl text-center md:text-left">
            <h3 className="text-5xl font-black mb-8 tracking-tight">E-Commerce Conglomerates</h3>
            <p className="text-xl text-gray-400 leading-relaxed">Unify multiple entity ledgers into a single source of truth with automated tax provision logic.</p>
        </div>
        <div className="w-80 h-80 bg-[#4182ff]/5 rounded-full border border-[#4182ff]/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#4182ff] text-9xl">hub</span>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

const FeaturesPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-10 pb-40">
      <h1 className="text-[100px] font-black font-['Manrope'] tracking-tighter mb-20 leading-none">Precision<br/><span className="text-[#adc7ff]">Architecture</span></h1>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-[#1c1b1b] p-16 rounded-[4rem] border border-white/5">
          <span className="material-symbols-outlined text-[#adc7ff] text-6xl mb-10">inventory_2</span>
          <h3 className="text-4xl font-black mb-6 tracking-tight">Real-time Valuation</h3>
          <p className="text-gray-400 text-xl leading-relaxed">Algorithmic tracking of asset liquidity with 4ms SKU latency.</p>
        </div>
        <div className="bg-[#1c1b1b] p-16 rounded-[4rem] border border-white/5 flex flex-col justify-between">
          <div>
            <span className="material-symbols-outlined text-[#66dd8b] text-6xl mb-10">psychology</span>
            <h3 className="text-4xl font-black mb-6 tracking-tight">AI Tax Forecasting</h3>
            <p className="text-gray-400 text-xl leading-relaxed">Predict jurisdictional liability daily using specialized LLM models.</p>
          </div>
          <div className="mt-12"><div className="h-2 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-[#66dd8b] w-[99%]"></div></div></div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

const PricingPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-10 pb-40 text-center">
      <h1 className="text-8xl font-black font-['Manrope'] tracking-tighter mb-20 leading-none">Transparent Licensing</h1>
      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <div className="bg-[#1c1b1b] p-16 rounded-[4rem] border border-white/5 text-left">
          <h3 className="text-xl font-bold uppercase tracking-widest text-gray-500 mb-4">Professional</h3>
          <div className="text-6xl font-black mb-10">$0<span className="text-lg text-gray-700">/mo</span></div>
          <ul className="space-y-4 mb-12 text-gray-400 font-medium list-none p-0">
            <li>• 1 Active Ledger Vault</li>
            <li>• Standard AI Advisor</li>
            <li>• Real-time Tax Provisioning</li>
          </ul>
          <Link to="/login" className="block text-center py-5 bg-white text-black font-black rounded-2xl">Start Free</Link>
        </div>
        <div className="bg-[#1c1b1b] p-16 rounded-[4rem] border border-[#adc7ff]/30 text-left relative overflow-hidden">
          <h3 className="text-xl font-bold uppercase tracking-widest text-[#adc7ff] mb-4">Institutional</h3>
          <div className="text-6xl font-black mb-10">Custom</div>
          <ul className="space-y-4 mb-12 text-gray-400 font-medium list-none p-0">
            <li>• Unlimited Ledger Vaults</li>
            <li>• Advanced Fiscal Modeling</li>
            <li>• SOC2 Compliance API</li>
          </ul>
          <button className="w-full py-5 bg-[#4182ff] text-white font-black rounded-2xl">Contact Sales</button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

// --- 3. LANDING PAGE ---
const LandingPage = () => (
  <div className="bg-[#0e0e0e] text-white font-['Inter'] selection:bg-[#4182ff]">
    <Navbar />
    <section className="max-w-[1400px] mx-auto px-10 pt-48 pb-32 grid lg:grid-cols-2 gap-24 items-center min-h-screen">
      <div>
        <h1 className="text-[90px] md:text-[115px] font-black font-['Manrope'] tracking-tighter leading-[0.85] mb-14">
          The Modern <br/>CFO's <br/><span className="text-[#adc7ff] italic">Digital Vault</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-lg leading-relaxed mb-16 font-medium">Unify ledger integrity with algorithmic foresight. QueryFlow Vault transforms raw fiscal data into institutional intelligence.</p>
        <Link to="/login" className="bg-[#4182ff] text-white px-12 py-6 rounded-2xl font-black text-lg shadow-2xl hover:bg-white hover:text-black transition-all">Start for Free</Link>
      </div>
      <div className="bg-[#1c1b1b] p-12 rounded-[3.5rem] border border-white/5 h-80 flex flex-col justify-between shadow-2xl">
         <span className="text-[11px] text-gray-500 uppercase font-black tracking-[0.2em]">Net Revenue at Risk</span>
         <div className="text-[80px] font-black tracking-tighter leading-none">$4.2M</div>
         <div className="absolute bottom-0 left-0 w-[75%] h-2 bg-[#4182ff]"></div>
      </div>
    </section>
    <Footer />
  </div>
);

// --- 4. AUTH & VAULT COMPONENTS ---
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
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#adc7ff] to-[#66dd8b]"></div>
        <h2 className="text-5xl font-black font-['Manrope'] text-white mb-10 tracking-tighter">Access Terminal</h2>
        <form onSubmit={handleManualLogin} className="space-y-4 mb-6">
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]" type="email" placeholder="Business Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-5 rounded-[1.5rem] font-black text-xl hover:scale-[1.02] transition-all">SIGN IN</button>
        </form>
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
        setChatHistory([...newHistory, { role: 'assistant', text: `Audit complete. Projected profit: $${Math.floor(realizableProfit).toLocaleString()}` }]);
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
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#1c1b1b] p-10 rounded-[2.5rem] border-l-4 border-[#adc7ff] shadow-xl">
                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Valuation</span>
                    <h3 className="text-4xl font-black font-['Manrope']">${totalValuation.toLocaleString()}</h3>
                </div>
                <div className="bg-[#1c1b1b] p-10 rounded-[2.5rem] border-l-4 border-[#66dd8b] shadow-xl">
                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Net Profit</span>
                    <h3 className="text-4xl font-black text-[#66dd8b] font-['Manrope']">${Math.floor(realizableProfit).toLocaleString()}</h3>
                </div>
              </div>
              <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                <h4 className="font-black uppercase text-[10px] text-gray-400 mb-6 tracking-widest">Interaction Ledger</h4>
                <div className="space-y-4">
                  {ledger.map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                      <div><p className="font-bold text-lg">{entry.action}</p><p className="text-xs text-gray-500">{entry.entity} | {entry.time}</p></div>
                      <span className={`font-black text-xl ${entry.value >= 0 ? 'text-[#66dd8b]' : 'text-red-500'}`}>{entry.value >= 0 ? '+' : '-'}${Math.floor(Math.abs(entry.value)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* ... (inventory and reports activeTabs) */}
        </div>
      </main>

      <aside className="w-80 bg-[#1c1b1b] border-l border-white/5 p-6 flex flex-col h-full shrink-0 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 uppercase font-black text-[11px]">AI Advisor</div>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-4 rounded-2xl text-[11px] leading-relaxed font-['Inter'] ${msg.role === 'assistant' ? 'bg-black/30 border-l-2 border-[#adc7ff] text-gray-400' : 'bg-[#adc7ff]/10 text-[#adc7ff] text-right'}`}>{msg.text}</div>
          ))}
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

// --- 5. MAIN APP COMPONENT ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) handleLogin(true, session.user.email);
      setIsInitialLoading(false);
    };
    checkSession();
  }, []);

  const handleLogin = (status, id) => { 
    setIsAuthenticated(status); setUserId(id); 
    localStorage.setItem("isLoggedIn", "true"); localStorage.setItem("userId", id); 
  };

  const handleLogout = () => { 
    supabase.auth.signOut(); localStorage.clear(); setIsAuthenticated(false); setUserId(""); window.location.replace("/"); 
  };

  if (isInitialLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-bold animate-pulse">SYNCHRONIZING...</div>;

  return (
    <Router>
      <Routes>
        {/* FIXED: All routes are now explicitly defined */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/vault" element={isAuthenticated ? <Vault userId={userId} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
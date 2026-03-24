import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

/* --- 1. SHARED COMPONENTS --- */

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex justify-between items-center px-6 md:px-10 py-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-xl font-black tracking-tighter font-['Manrope']">QueryFlow Vault</Link>
          <div className="hidden lg:flex gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            <Link to="/features" className="hover:text-white transition-colors">Features</Link>
            <Link to="/solutions" className="hover:text-white transition-colors">Solutions</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/security" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Login</Link>
          <Link to="/login" className="bg-[#4182ff] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em]">Request Demo</Link>
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white material-symbols-outlined p-2">
            {isOpen ? 'close' : 'menu'}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden bg-[#0e0e0e] border-b border-white/5 px-6 py-10 space-y-8">
          <div className="flex flex-col gap-6 text-sm font-black uppercase tracking-[0.3em] text-gray-400">
            <Link to="/features" onClick={() => setIsOpen(false)}>Features</Link>
            <Link to="/solutions" onClick={() => setIsOpen(false)}>Solutions</Link>
            <Link to="/pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
            <Link to="/security" onClick={() => setIsOpen(false)}>Security</Link>
            <hr className="border-white/5" />
            <Link to="/login" onClick={() => setIsOpen(false)} className="text-white">Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

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

const FeaturesPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-40">
      <h1 className="text-5xl md:text-[100px] font-black font-['Manrope'] tracking-tighter mb-20 leading-tight">Precision<br/><span className="text-[#adc7ff]">Architecture</span></h1>
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="bg-[#1c1b1b] p-16 rounded-[4rem] border border-white/5 lg:col-span-2">
          <h3 className="text-5xl font-black mb-6">Real-time Valuation</h3>
          <p className="text-gray-400 text-xl leading-relaxed">Our proprietary indexing engine hooks directly into ledgers with 4ms SKU latency.</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

const SolutionsPage = () => ( <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white"><Navbar /><div className="max-w-[1400px] mx-auto px-10"><h1>Solutions</h1></div><Footer /></div> );
const SecurityPage = () => ( <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white"><Navbar /><div className="max-w-[1400px] mx-auto px-10"><h1>Security</h1></div><Footer /></div> );
const PricingPage = () => ( <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white"><Navbar /><div className="max-w-[1400px] mx-auto px-10"><h1>Pricing</h1></div><Footer /></div> );

const LandingPage = () => (
  <div className="bg-[#0e0e0e] text-white font-['Inter']">
    <Navbar />
    <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-32 md:pt-48 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-[60px] md:text-[100px] font-black font-['Manrope'] tracking-tighter leading-[0.85] mb-10">
          The Modern <br/>CFO's <br/><span className="text-[#adc7ff] italic">Digital Vault</span>
        </h1>
        <Link to="/login" className="inline-block bg-[#4182ff] text-white px-10 py-5 rounded-2xl font-black text-lg">Start for Free</Link>
      </div>
      <div className="bg-[#1c1b1b] p-12 rounded-[3.5rem] border border-white/5 h-80 flex flex-col justify-between shadow-2xl">
         <span className="text-[11px] text-gray-500 uppercase font-black tracking-widest">Net Revenue at Risk</span>
         <div className="text-6xl md:text-[80px] font-black tracking-tighter">$4.2M</div>
         <div className="w-full h-2 bg-[#4182ff] rounded-full"></div>
      </div>
    </section>
    <Footer />
  </div>
);

/* --- 3. AUTH & VAULT --- */

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
    else alert(error.message);
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#adc7ff] to-[#66dd8b]"></div>
        <h2 className="text-5xl font-black font-['Manrope'] text-white mb-10 tracking-tighter">Access Terminal</h2>
        <form onSubmit={handleManualLogin} className="space-y-4 mb-6">
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none" type="email" placeholder="Business Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-5 rounded-[1.5rem] font-black text-xl hover:scale-[1.02] transition-all">SIGN IN</button>
        </form>
        <button onClick={handleGoogleLogin} className="w-full bg-white/5 text-white border border-white/10 py-5 rounded-[1.5rem] font-bold flex items-center justify-center gap-3">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-6 h-6" /> Sign in with Google
        </button>
      </div>
    </div>
  );
};

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", cost_price: "", market_price: "", stock: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [ledger, setLedger] = useState([{ id: 1, action: "System Initialization", entity: "Node 04", status: "Verified", value: 0, time: "Start" }]);
  const [userQuery, setUserQuery] = useState("");
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

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/products`, { 
        name: newItem.name, price: newItem.market_price, cost_price: newItem.cost_price, stock: newItem.stock, userId 
      });
      setItems([...items, res.data]);
      setIsAddModalOpen(false);
      setNewItem({ name: "", cost_price: "", market_price: "", stock: "" });
    } catch (err) { alert("Vaulting failed."); }
  };

  const updateStock = async (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, (Number(item.stock) || 0) + delta);
    setItems(prevItems => prevItems.map(i => i.id === id ? { ...i, stock: newStock } : i));
    try { await axios.put(`${API_BASE_URL}/api/products/${id}`, { stock: newStock, userId }); } catch (err) { console.error(err); }
  };

  const safeItems = items || [];
  const totalValuation = safeItems.reduce((acc, i) => acc + ((Number(i?.price) || 0) * (Number(i?.stock) || 0)), 0);
  const totalInvestment = safeItems.reduce((acc, i) => acc + ((Number(i?.cost_price) || 0) * (Number(i?.stock) || 0)), 0);
  const realizableProfit = totalValuation - totalInvestment - (totalValuation * 0.18);

  const handleChat = (e) => {
    e.preventDefault();
    const newHist = [...chatHistory, { role: 'user', text: userQuery }];
    setChatHistory(newHist);
    setUserQuery("");
    setTimeout(() => {
      setChatHistory([...newHist, { role: 'assistant', text: `Vault Analysis: Total Liquidity is $${totalValuation.toLocaleString()}. System Synchronized.` }]);
    }, 1000);
  };

  if (isLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-bold animate-pulse">SYNCHRONIZING...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[#0e0e0e] text-white font-['Inter'] overflow-x-hidden md:overflow-hidden fixed inset-0">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-64 border-r border-white/5 bg-[#131313] flex-col p-6 shrink-0 shadow-2xl">
        <div className="mb-10 font-['Manrope'] text-xl font-black">QueryFlow Vault</div>
        <nav className="flex-1 space-y-2">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black transition-all ${activeTab === tab ? 'bg-[#adc7ff]/10 text-[#adc7ff]' : 'text-gray-500'}`}>
               <span className="material-symbols-outlined">{tab === 'dashboard' ? 'dashboard' : tab === 'inventory' ? 'inventory_2' : 'description'}</span> {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto bg-red-500/10 text-red-500 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase">Exit Terminal</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="min-h-16 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:px-10 bg-[#131313]/50 backdrop-blur-md gap-4">
          <div className="flex justify-between items-center w-full md:w-auto gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-black font-['Manrope'] capitalize">{activeTab} Overview</h2>
              {activeTab === "inventory" && (
                <button onClick={() => { setIsAdvisorOpen(false); setIsAddModalOpen(true); }} className="bg-[#4182ff] text-white p-2 rounded-lg material-symbols-outlined">add</button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onLogout} className="md:hidden p-2 text-red-500/70 material-symbols-outlined">logout</button>
              <button onClick={() => { setIsAddModalOpen(false); setIsAdvisorOpen(!isAdvisorOpen); }} className="md:hidden p-2 bg-[#adc7ff]/10 rounded-lg text-[#adc7ff] material-symbols-outlined">smart_toy</button>
            </div>
          </div>
          <input className="bg-[#1c1b1b] border-none rounded-xl px-4 py-2 text-sm w-full md:w-80 outline-none text-white" placeholder="Search assets..." onChange={e => setSearchTerm(e.target.value)} />
        </header>

        {/* MOBILE TABS */}
        <div className="flex md:hidden bg-[#131313] border-b border-white/5 shrink-0">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'text-[#adc7ff] border-b-2 border-[#adc7ff]' : 'text-gray-500'}`}>{tab}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar bg-[#0e0e0e]">
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1c1b1b] p-5 md:p-7 rounded-3xl border-l-4 border-[#adc7ff] shadow-xl">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">Valuation</span>
                  <h3 className="text-lg md:text-2xl font-black">${totalValuation.toLocaleString()}</h3>
                </div>
                <div className="bg-[#1c1b1b] p-5 md:p-7 rounded-3xl border-l-4 border-[#66dd8b] shadow-xl">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">Net Profit</span>
                  <h3 className="text-lg md:text-2xl font-black text-[#66dd8b]">${Math.floor(realizableProfit).toLocaleString()}</h3>
                </div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
               {safeItems.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                 <div key={item.id} className="bg-[#1c1b1b] p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
                   <h4 className="font-black text-xl mb-4">{item.name}</h4>
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                        <span className="text-[9px] text-gray-600 block uppercase font-black mb-1">Cost Point</span>
                        <span className="text-lg font-black text-gray-400">${Math.floor(item.cost_price || item.price * 0.7).toLocaleString()}</span>
                      </div>
                      <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                        <span className="text-[9px] text-gray-600 block uppercase font-black mb-1">Market Price</span>
                        <span className="text-lg font-black text-white">${Math.floor(item.price).toLocaleString()}</span>
                      </div>
                   </div>
                   <div className="flex gap-4">
                     <button onClick={() => updateStock(item.id, 1)} className="flex-1 bg-white/5 py-3 rounded-xl text-[10px] font-black uppercase">Restock</button>
                     <button onClick={() => updateStock(item.id, -1)} className="flex-1 bg-white/5 py-3 rounded-xl text-[10px] font-black uppercase">Mark Sold</button>
                   </div>
                 </div>
               ))}
             </div>
          )}

          {activeTab === "reports" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-[#1c1b1b] p-6 md:p-16 rounded-[2.5rem] border border-white/5 shadow-2xl">
                 <h3 className="text-xl md:text-3xl font-black mb-8 border-b border-white/5 pb-6">Ledger Performance</h3>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center"><span className="text-gray-400">Total Asset Value</span><span className="font-black text-xl">${totalValuation.toLocaleString()}</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-400">Total Capital Cost</span><span className="font-black text-xl text-red-400">-${totalInvestment.toLocaleString()}</span></div>
                    <div className="bg-[#66dd8b]/10 p-6 rounded-3xl mt-8 border border-[#66dd8b]/20 flex justify-between items-center">
                      <span className="text-[#66dd8b] font-black text-xs uppercase tracking-widest">Projected Net Realizable</span>
                      <span className="font-black text-2xl md:text-4xl text-[#66dd8b]">${Math.floor(realizableProfit).toLocaleString()}</span>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AI ADVISOR SIDEBAR */}
      <aside className={`${isAdvisorOpen ? 'fixed inset-y-0 right-0 z-[80] w-80 flex' : 'hidden'} md:relative md:flex md:w-80 bg-[#1c1b1b] border-l border-white/5 p-6 flex-col h-full shrink-0 shadow-2xl transition-all duration-300`}>
        <button onClick={() => setIsAdvisorOpen(false)} className="md:hidden absolute top-4 right-4 text-gray-500 material-symbols-outlined">close</button>
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 uppercase font-black text-[11px] tracking-widest">AI Advisor</div>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-4 rounded-2xl text-[11px] leading-relaxed ${msg.role === 'assistant' ? 'bg-black/30 border-l-2 border-[#adc7ff] text-gray-400' : 'bg-[#adc7ff]/10 text-[#adc7ff] text-right'}`}>{msg.text}</div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleChat} className="relative mt-auto">
          <input type="text" value={userQuery} onChange={e => setUserQuery(e.target.value)} placeholder="Query fiscal data..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-white outline-none" />
          <button type="submit" className="absolute right-3 top-2.5 text-[#adc7ff] material-symbols-outlined">send</button>
        </form>
      </aside>

      {/* GLOBAL MODAL - FIXED NESTING */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[#1c1b1b] w-full max-w-md p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-in zoom-in">
            <h3 className="text-3xl font-black mb-8">Vault Asset</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <input className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" placeholder="Asset Name" onChange={e => setNewItem({...newItem, name: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" placeholder="Cost ($)" onChange={e => setNewItem({...newItem, cost_price: e.target.value})} required />
                <input type="number" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" placeholder="Market ($)" onChange={e => setNewItem({...newItem, market_price: e.target.value})} required />
              </div>
              <input type="number" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" placeholder="Units" onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 bg-[#4182ff] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">Initialize</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- 4. APP ROUTING --- */

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
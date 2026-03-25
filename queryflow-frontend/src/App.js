import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 

// Import your new UI Components
import InventoryContainer from "./components/InventoryContainer";
import AddAssetModal from "./components/AddAssetModal";

import "./App.css";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

/* --- 1. SHARED UI (NAVBAR & FOOTER) --- */

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
          <button className="bg-[#4182ff] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em]">Request Demo</button>
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white material-symbols-outlined">{isOpen ? 'close' : 'menu'}</button>
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden bg-[#0e0e0e] border-b border-white/5 px-6 py-10 flex flex-col gap-6 text-sm font-black uppercase tracking-widest text-gray-400">
          <Link to="/features" onClick={() => setIsOpen(false)}>Features</Link>
          <Link to="/solutions" onClick={() => setIsOpen(false)}>Solutions</Link>
          <Link to="/security" onClick={() => setIsOpen(false)}>Security</Link>
          <Link to="/login" onClick={() => setIsOpen(false)} className="text-white">Login</Link>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="py-20 border-t border-white/5 px-10 bg-[#0e0e0e] text-center md:text-left">
    <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">© 2026 QUERYFLOW VAULT • INSTITUTIONAL GRADE</p>
      <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-gray-500">
        <Link to="/security">Security</Link>
        <Link to="/pricing">Pricing</Link>
      </div>
    </div>
  </footer>
);

/* --- 2. STATIC PAGES --- */

const LandingPage = () => (
  <div className="bg-[#0e0e0e] text-white min-h-screen">
    <Navbar />
    <section className="max-w-[1400px] mx-auto px-6 pt-48 pb-20 grid lg:grid-cols-2 gap-20 items-center">
      <div className="animate-in fade-in slide-in-from-left duration-700">
        <h1 className="text-6xl md:text-[100px] font-black font-['Manrope'] tracking-tighter leading-[0.85] mb-10">
          The Modern <br/>CFO's <br/><span className="text-[#adc7ff] italic">Digital Vault</span>
        </h1>
        <Link to="/login" className="bg-[#4182ff] px-10 py-5 rounded-2xl font-black text-lg inline-block">Access Terminal</Link>
      </div>
      <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 h-80 flex flex-col justify-between shadow-2xl relative overflow-hidden">
         <span className="text-[11px] text-gray-500 uppercase font-black tracking-widest">Net Revenue at Risk</span>
         <div className="text-6xl md:text-8xl font-black tracking-tighter">$4.2M</div>
         <div className="absolute bottom-0 left-0 w-full h-2 bg-[#4182ff]"></div>
      </div>
    </section>
    <Footer />
  </div>
);

const FeaturesPage = () => (<div className="bg-[#0e0e0e] min-h-screen pt-40 text-white"><Navbar /><div className="p-10"><h1>Features Coming Soon</h1></div><Footer /></div>);

/* --- 3. CORE VAULT LOGIC (THE BRAIN) --- */

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", cost_price: "", market_price: "", stock: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', text: "Terminal Secure. CFO AI standing by." }]);
  const [userQuery, setUserQuery] = useState("");
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
    } catch (err) { alert("Vaulting failed. Verify backend."); }
  };

  const updateStock = async (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, (Number(item.stock) || 0) + delta);
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: newStock } : i));
    try { await axios.put(`${API_BASE_URL}/api/products/${id}`, { stock: newStock, userId }); } catch (err) { console.error(err); }
  };

  // --- CALCULATIONS ---
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
      setChatHistory([...newHist, { role: 'assistant', text: `Audit Complete: Realizable Profit is $${Math.floor(realizableProfit).toLocaleString()}.` }]);
    }, 1000);
  };

  if (isLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-bold animate-pulse">SYNCHRONIZING...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[#0e0e0e] text-white font-['Inter'] overflow-x-hidden md:overflow-hidden fixed inset-0">
      
      {/* SIDEBAR */}
      <aside className="hidden md:flex md:w-64 border-r border-white/5 bg-[#131313] flex-col p-6 shrink-0 shadow-2xl">
        <div className="mb-10 font-['Manrope'] text-xl font-black">QueryFlow Vault</div>
        <nav className="flex-1 space-y-2">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black transition-all ${activeTab === tab ? 'bg-[#adc7ff]/10 text-[#adc7ff]' : 'text-gray-500'}`}>
               <span className="material-symbols-outlined">{tab === 'dashboard' ? 'dashboard' : tab === 'inventory' ? 'inventory_2' : 'description'}</span> {tab}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto bg-red-500/10 text-red-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Exit Terminal</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
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
              <button onClick={() => setIsAdvisorOpen(!isAdvisorOpen)} className="md:hidden p-2 bg-[#adc7ff]/10 rounded-lg text-[#adc7ff] material-symbols-outlined">smart_toy</button>
            </div>
          </div>
          <input className="bg-[#1c1b1b] border-none rounded-xl px-4 py-2 text-sm w-full md:w-80 outline-none text-white" placeholder="Search assets..." onChange={e => setSearchTerm(e.target.value)} />
        </header>

        {/* MOBILE TABS */}
        <div className="flex md:hidden bg-[#131313] border-b border-white/5">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-[10px] font-black tracking-widest uppercase ${activeTab === tab ? 'text-[#adc7ff] border-b-2 border-[#adc7ff]' : 'text-gray-500'}`}>{tab}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in">
              <div className="bg-[#1c1b1b] p-7 rounded-3xl border-l-4 border-[#adc7ff] shadow-xl">
                <span className="text-[10px] text-gray-500 uppercase block mb-1">Valuation</span>
                <h3 className="text-lg md:text-2xl font-black">${totalValuation.toLocaleString()}</h3>
              </div>
              <div className="bg-[#1c1b1b] p-7 rounded-3xl border-l-4 border-[#66dd8b] shadow-xl">
                <span className="text-[10px] text-gray-500 uppercase block mb-1">Net Profit</span>
                <h3 className="text-lg md:text-2xl font-black text-[#66dd8b]">${Math.floor(realizableProfit).toLocaleString()}</h3>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
             <InventoryContainer items={safeItems} searchTerm={searchTerm} onUpdateStock={updateStock} />
          )}

          {activeTab === "reports" && (
            <div className="bg-[#1c1b1b] p-10 md:p-16 rounded-[4rem] border border-white/5 shadow-2xl max-w-3xl mx-auto">
               <h3 className="text-3xl font-black mb-8 border-b border-white/5 pb-6">Ledger Performance</h3>
               <div className="space-y-6">
                  <div className="flex justify-between items-center"><span className="text-gray-400">Total Asset Value</span><span className="font-black text-xl">${totalValuation.toLocaleString()}</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-400">Total Capital Cost</span><span className="font-black text-xl text-red-400">-${totalInvestment.toLocaleString()}</span></div>
                  <div className="bg-[#66dd8b]/10 p-10 rounded-3xl mt-8 border border-[#66dd8b]/20 flex justify-between items-center">
                    <span className="text-[#66dd8b] font-black text-xs uppercase tracking-widest">Projected Net</span>
                    <span className="font-black text-4xl text-[#66dd8b]">${Math.floor(realizableProfit).toLocaleString()}</span>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* AI SIDEBAR */}
      <aside className={`${isAdvisorOpen ? 'fixed inset-y-0 right-0 z-[80] w-80 flex' : 'hidden'} md:relative md:flex md:w-80 bg-[#1c1b1b] border-l border-white/5 p-6 flex-col h-full shrink-0 shadow-2xl transition-all duration-300`}>
        <button onClick={() => setIsAdvisorOpen(false)} className="md:hidden absolute top-4 right-4 text-gray-500 material-symbols-outlined">close</button>
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 uppercase font-black text-[11px] tracking-widest">AI Advisor</div>
        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
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

      {/* MODAL (Imported Component) */}
      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddItem} newItem={newItem} setNewItem={setNewItem} />
    </div>
  );
};

/* --- 4. AUTH & ROUTING --- */

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) { onLogin(true, data.user.email); navigate("/vault"); }
    else alert(error.message);
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 text-center shadow-2xl">
        <h2 className="text-5xl font-black mb-10 text-white tracking-tighter">Access Terminal</h2>
        <form onSubmit={handleManualLogin} className="space-y-4">
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-5 rounded-[1.5rem] font-black text-xl">SIGN IN</button>
        </form>
      </div>
    </div>
  );
};

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

  if (isInitialLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-bold">SYNCHRONIZING...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/vault" element={isAuthenticated ? <Vault userId={userId} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
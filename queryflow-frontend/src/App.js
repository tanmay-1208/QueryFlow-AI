import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 
import "./App.css";

// Change this at the top of App.js
const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

/* --- 1. SHARED COMPONENTS --- */

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Added for mobile toggle

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex justify-between items-center px-6 md:px-10 py-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-xl font-black tracking-tighter font-['Manrope']">QueryFlow Vault</Link>
          
          {/* Desktop Menu - Automatically hidden on mobile */}
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
          
          {/* Mobile Toggle Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white material-symbols-outlined p-2"
          >
            {isOpen ? 'close' : 'menu'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-[#0e0e0e] border-b border-white/5 px-6 py-10 space-y-8 animate-in slide-in-from-top">
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

/* --- 1. EXPANDED FEATURES PAGE --- */
const FeaturesPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white selection:bg-[#adc7ff] selection:text-[#002e68]">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-40">
      <h1 className="text-5xl md:text-[100px] font-black font-['Manrope'] tracking-tighter mb-20 leading-tight">Precision<br/><span className="text-[#adc7ff]">Architecture</span></h1>
      
      {/* Primary Grid */}
      <div className="grid lg:grid-cols-3 gap-10 mb-20">
        <div className="bg-[#1c1b1b] p-16 rounded-[4rem] border border-white/5 lg:col-span-2">
          <h3 className="text-5xl font-black mb-6">Real-time Valuation</h3>
          <p className="text-gray-400 text-xl leading-relaxed mb-10">Our proprietary indexing engine hooks directly into your entity ledgers. Every movement is calculated with 4ms SKU latency, ensuring your balance sheet is never out of sync.</p>
          <div className="flex gap-10">
            <div><span className="block text-2xl font-black text-[#adc7ff]">99.99%</span><span className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Sync Uptime</span></div>
            <div><span className="block text-2xl font-black text-[#adc7ff]">Global</span><span className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Node Coverage</span></div>
          </div>
        </div>
        <div className="bg-[#1c1b1b] p-16 rounded-[4rem] border border-white/5 flex flex-col justify-between">
          <h3 className="text-4xl font-black">AI Tax Forecasting</h3>
          <p className="text-gray-400 text-lg">Automated jurisdictional liability modeling. Predict capital requirements for Q4 before Q3 even ends.</p>
          <div className="h-2 w-full bg-white/5 rounded-full mt-10"><div className="h-full bg-[#66dd8b] w-[85%] shadow-[0_0_20px_rgba(102,221,139,0.3)]"></div></div>
        </div>
      </div>

      {/* Technical Deep Dive Bento */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-[#131313] p-10 rounded-[3rem] border border-white/5">
          <h4 className="font-black text-sm mb-4 uppercase text-gray-500">Auto-Reconcile</h4>
          <p className="text-gray-400 text-sm">Eliminate manual ledger entries. Our AI cross-references 1,000+ interactions per second.</p>
        </div>
        <div className="bg-[#131313] p-10 rounded-[3rem] border border-white/5">
          <h4 className="font-black text-sm mb-4 uppercase text-gray-500">Anomaly Detection</h4>
          <p className="text-gray-400 text-sm">Instant alerts for unauthorized balance shifts or fraudulent entity movements.</p>
        </div>
        <div className="bg-[#131313] p-10 rounded-[3rem] border border-white/5">
          <h4 className="font-black text-sm mb-4 uppercase text-gray-500">Custom Reports</h4>
          <p className="text-gray-400 text-sm">Generate Board-ready PDFs in 2 seconds using natural language queries.</p>
        </div>
        <div className="bg-[#131313] p-10 rounded-[3rem] border border-white/5">
          <h4 className="font-black text-sm mb-4 uppercase text-gray-500">API Access</h4>
          <p className="text-gray-400 text-sm">Standardized REST endpoints for seamless integration into your existing ERP suite.</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

/* --- 2. EXPANDED SOLUTIONS PAGE --- */
const SolutionsPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-40">
<h1 className="text-5xl md:text-[100px] font-black font-['Manrope'] tracking-tighter mb-20 leading-[0.85]">Tailored for<br/><span className="italic text-gray-600 font-light">Complex Treasury</span></h1>      
      <div className="space-y-10">
        <div className="bg-[#1c1b1b] p-20 rounded-[5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-20">
          <div className="max-w-xl">
            <div className="bg-[#4182ff]/10 text-[#4182ff] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block border border-[#4182ff]/20">Enterprise</div>
            <h3 className="text-5xl font-black mb-8 tracking-tight">E-Commerce Conglomerates</h3>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">Unify fragmented logistics data across 50+ global nodes into a single source of truth. QueryFlow Vault handles currency conversions and tax provisioning automatically.</p>
            <ul className="grid grid-cols-2 gap-4 text-sm font-bold text-gray-500">
              <li>✓ Multi-Currency Support</li>
              <li>✓ Automated VAT/GST</li>
              <li>✓ SKU Risk Scoring</li>
              <li>✓ Liquidity Forecasting</li>
            </ul>
          </div>
          <div className="w-96 h-96 bg-gradient-to-br from-[#1c1b1b] to-black rounded-full border border-white/5 flex items-center justify-center shadow-2xl">
             <span className="material-symbols-outlined text-[#4182ff] text-[150px] animate-pulse">hub</span>
          </div>
        </div>

        <div className="bg-[#1c1b1b] p-20 rounded-[5rem] border border-white/5 flex flex-col md:flex-row-reverse justify-between items-center gap-20">
          <div className="max-w-xl">
            <div className="bg-[#66dd8b]/10 text-[#66dd8b] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block border border-[#66dd8b]/20">Asset Management</div>
            <h3 className="text-5xl font-black mb-8 tracking-tight">High-Frequency Vaulting</h3>
            <p className="text-xl text-gray-400 leading-relaxed">For firms managing physical or high-value digital assets. Track market fluctuations and unrealized gains with precision instrumentation.</p>
            <ul className="grid grid-cols-2 gap-4 text-sm font-bold text-gray-500">
              <li>✓ Market Price Crawlers</li>
              <li>✓ Capital Gain Tracking</li>
              <li>✓ Custodial Audit Logs</li>
              <li>✓ Identity Verification</li>
            </ul>
          </div>
          <div className="w-96 h-96 bg-gradient-to-br from-[#1c1b1b] to-black rounded-full border border-white/5 flex items-center justify-center shadow-2xl">
             <span className="material-symbols-outlined text-[#66dd8b] text-[150px]">verified_user</span>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

/* --- 3. EXPANDED SECURITY PAGE --- */
const SecurityPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white selection:bg-[#66dd8b] selection:text-[#003115]">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-40">
      <div className="inline-flex items-center gap-2 bg-[#66dd8b]/10 border border-[#66dd8b]/20 px-6 py-2 rounded-full mb-12">
        <span className="w-2 h-2 bg-[#66dd8b] rounded-full animate-pulse"></span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#66dd8b]">Fortress Protocol 4.0 Verified</span>
      </div>
<h1 className="text-5xl md:text-[100px] font-black font-['Manrope'] tracking-tighter mb-20 leading-[0.85]">Zero-Leak<br/><span className="text-[#66dd8b]">Fiscal Integrity</span></h1>      
      <div className="grid md:grid-cols-3 gap-8 text-left">
        <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 shadow-2xl group hover:border-[#66dd8b]/30 transition-all">
          <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-gray-400">Encryption</h3>
          <p className="text-gray-500 leading-relaxed text-lg mb-8">We use industry-standard AES-256 for all data at rest. During transit, every packet is wrapped in TLS 1.3 with Perfect Forward Secrecy (PFS).</p>
          <div className="text-[10px] font-black text-[#66dd8b] uppercase tracking-widest">Active: SHA-512 Hashing</div>
        </div>
        <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 shadow-2xl group hover:border-[#66dd8b]/30 transition-all">
          <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-gray-400">Isolation</h3>
          <p className="text-gray-500 leading-relaxed text-lg mb-8">Every institutional node resides on a physically isolated database cluster. This "Air-Gap" philosophy ensures zero cross-tenant data leakage.</p>
          <div className="text-[10px] font-black text-[#66dd8b] uppercase tracking-widest">Active: VPC Peering</div>
        </div>
        <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 shadow-2xl group hover:border-[#66dd8b]/30 transition-all">
          <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-gray-400">Compliance</h3>
          <p className="text-gray-500 leading-relaxed text-lg mb-8">QueryFlow Vault is SOC2 Type II ready, GDPR compliant, and adheres to ISO 27001 standards for financial data handling.</p>
          <div className="text-[10px] font-black text-[#66dd8b] uppercase tracking-widest">Certified: 2026 AUDIT</div>
        </div>
      </div>

      <div className="mt-20 bg-[#131313] p-16 rounded-[5rem] border border-white/5 inline-block">
        <h4 className="text-2xl font-black mb-6">Our Security Stack</h4>
        <div className="flex flex-wrap justify-center gap-10 text-gray-600 font-black uppercase text-[10px] tracking-widest">
          <span>Supabase Auth</span>
          <span>•</span>
          <span>End-to-End SSL</span>
          <span>•</span>
          <span>Biometric Sync</span>
          <span>•</span>
          <span>Isolated PostgreSQL</span>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

const PricingPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-40">
      <h1 className="text-5xl md:text-[100px] font-black font-['Manrope'] tracking-tighter mb-20 leading-[0.85]">Zero-Leak<br/><span className="text-[#66dd8b]">Fiscal Integrity</span></h1>
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
    
    {/* HERO SECTION: Changed to responsive-grid */}
    <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-32 md:pt-48 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
      <div className="animate-in fade-in slide-in-from-left duration-1000">
        <div className="inline-flex items-center gap-2 bg-[#66dd8b]/10 border border-[#66dd8b]/20 px-4 py-2 rounded-full mb-8 md:mb-12">
          <span className="w-2 h-2 bg-[#66dd8b] rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#66dd8b]">V4.0 Institutional</span>
        </div>
        
        {/* Added the hero-title class here */}
        <h1 className="hero-title text-[100px] font-black font-['Manrope'] tracking-tighter leading-[0.85] mb-10">
          The Modern <br className="hidden md:block"/>CFO's <br/><span className="text-[#adc7ff] italic">Digital Vault</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed mb-12 font-medium">
          Unify ledger integrity with algorithmic foresight. QueryFlow Vault transforms raw fiscal data into institutional intelligence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5">
          <Link to="/login" className="bg-[#4182ff] text-white px-10 py-5 rounded-2xl font-black text-center text-lg shadow-2xl hover:scale-105 transition-all">
            Start for Free
          </Link>
        </div>
      </div>

      {/* REVENUE CARD: Automatically moves below on mobile */}
      <div className="bg-[#1c1b1b] p-8 md:p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden shadow-2xl h-64 md:h-80 flex flex-col justify-between">
         <span className="text-[11px] text-gray-500 uppercase font-black tracking-[0.2em]">Net Revenue at Risk</span>
         <div className="text-5xl md:text-[80px] font-black tracking-tighter leading-none">$4.2M</div>
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

  // Restoration of Google Login Logic
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
    }
    else { alert(error.message); }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center px-4 font-['Inter']">
      <div className="max-w-md w-full bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 text-center shadow-2xl relative overflow-hidden">
        {/* Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#adc7ff] to-[#66dd8b]"></div>
        
        <h2 className="text-5xl font-black font-['Manrope'] text-white mb-10 tracking-tighter">Access Terminal</h2>
        
        <form onSubmit={handleManualLogin} className="space-y-4 mb-6">
          <input 
            className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]" 
            type="email" 
            placeholder="Business Email" 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]" 
            type="password" 
            placeholder="Password" 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-5 rounded-[1.5rem] font-black text-xl hover:scale-[1.02] transition-all">
            SIGN IN
          </button>
        </form>

        {/* OR Divider */}
        <div className="relative flex items-center gap-4 mb-6">
          <div className="flex-1 h-[1px] bg-white/5"></div>
          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">OR</span>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>

        {/* RESTORED: Google Sign-In Button */}
        <button 
          onClick={handleGoogleLogin} 
          className="w-full bg-white/5 text-white border border-white/10 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-6 h-6" 
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

const Vault = ({ userId, onLogout }) => {
  const [items, setItems] = useState([]);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [ledger, setLedger] = useState([{ id: 1, action: "System Initialization", entity: "Node 04", status: "Verified", value: 0, time: "Start" }]);
  const [userQuery, setUserQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', text: "Terminal Secure. CFO AI standing by." }]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", cost_price: "", market_price: "", stock: "" });
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
        name: newItem.name,
        price: newItem.market_price, 
        cost_price: newItem.cost_price,
        stock: newItem.stock,
        userId 
      });
      setItems([...items, res.data]);
      setIsAddModalOpen(false);
      setNewItem({ name: "", cost_price: "", market_price: "", stock: "" });
    } catch (err) {
      alert("Vaulting failed. Verify backend connection.");
    }
  };

  const updateStock = async (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, (Number(item.stock) || 0) + delta);
    setItems(prevItems => prevItems.map(i => i.id === id ? { ...i, stock: newStock } : i));
    const newEntry = { 
        id: Date.now(), 
        action: delta > 0 ? "Inventory Purchase" : "Asset Liquidation", 
        entity: item.name || "Asset", 
        value: -(delta * (Number(item.price) || 0)), 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setLedger(prev => [newEntry, ...prev.slice(0, 4)]);
    try { await axios.put(`${API_BASE_URL}/api/products/${id}`, { stock: newStock, userId: userId }); } 
    catch (err) { console.error("Cloud Sync Failed:", err); }
  };

  // --- CALCULATIONS ---
  const safeItems = items || [];
  const totalValuation = safeItems.reduce((acc, i) => acc + ((Number(i?.price) || 0) * (Number(i?.stock) || 0)), 0);
  // Fixed: Uses actual cost_price instead of 0.7 estimate
  const totalInvestment = safeItems.reduce((acc, i) => acc + ((Number(i?.cost_price) || 0) * (Number(i?.stock) || 0)), 0);
  const estimatedTax = totalValuation * 0.18;
  const realizableProfit = totalValuation - totalInvestment - estimatedTax;

  const handleChat = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    const newHistory = [...chatHistory, { role: 'user', text: userQuery }];
    setChatHistory(newHistory);
    const currentQuery = userQuery.toLowerCase();
    setUserQuery("");
    setIsAnalyzing(true);
    setTimeout(() => {
      let aiResponse = `Query verified. Institutional Vault Valuation stands at $${totalValuation.toLocaleString()}. System status: Synchronized.`;
      setChatHistory([...newHistory, { role: 'assistant', text: aiResponse }]);
      setIsAnalyzing(false);
    }, 1200);
  };

  if (isLoading) return <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-bold animate-pulse">BOOTING...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[#0e0e0e] text-white font-['Inter'] overflow-x-hidden md:overflow-hidden fixed inset-0">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-64 border-r border-white/5 bg-[#131313] flex-col p-6 shrink-0 shadow-2xl">
        <div className="mb-10 font-['Manrope'] text-xl font-black">QueryFlow Vault</div>
        <nav className="flex-1 space-y-2">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black transition-all capitalize ${activeTab === tab ? 'bg-[#adc7ff]/10 text-[#adc7ff]' : 'text-gray-500 hover:text-white'}`}>
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
              <button onClick={() => setIsAdvisorOpen(!isAdvisorOpen)} className="md:hidden p-2 bg-[#adc7ff]/10 rounded-lg text-[#adc7ff] material-symbols-outlined">smart_toy</button>
            </div>
          </div>
          <input className="bg-[#1c1b1b] border-none rounded-xl px-4 py-2 text-sm w-full md:w-80 outline-none text-white" placeholder="Search assets..." onChange={(e) => setSearchTerm(e.target.value)} />
        </header>

        {/* MOBILE TABS */}
        <div className="flex md:hidden bg-[#131313] border-b border-white/5">
          {['dashboard', 'inventory', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'text-[#adc7ff] border-b-2 border-[#adc7ff]' : 'text-gray-500'}`}>{tab}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar bg-[#0e0e0e]">
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1c1b1b] p-5 md:p-7 rounded-3xl border-l-4 border-[#adc7ff] shadow-xl">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">Valuation</span>
                  <h3 className="text-lg md:text-2xl font-black">${totalValuation.toLocaleString()}</h3>
                </div>
                <div className="bg-[#1c1b1b] p-5 md:p-7 rounded-3xl border-l-4 border-[#fbbc00] shadow-xl">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">Tax Provision</span>
                  <h3 className="text-lg md:text-2xl font-black">-${Math.floor(estimatedTax).toLocaleString()}</h3>
                </div>
                <div className="bg-[#1c1b1b] p-5 md:p-7 rounded-3xl border-l-4 border-[#66dd8b] shadow-xl">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">Net Profit</span>
                  <h3 className="text-lg md:text-2xl font-black text-[#66dd8b]">${Math.floor(realizableProfit).toLocaleString()}</h3>
                </div>
                <div className="bg-[#1c1b1b] p-5 md:p-7 rounded-3xl border-l-4 border-gray-700 shadow-xl">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">SKU Alerts</span>
                  <h3 className="text-lg md:text-2xl font-black text-red-500">{safeItems.filter(i => i.stock <= 5).length}</h3>
                </div>
              </div>
              {/* Rest of Dashboard code... */}
            </div>
          )}

          {activeTab === "inventory" && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
               {safeItems.filter(i => (i.name||"").toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
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
                      <span className="text-[#66dd8b] font-black text-xs uppercase">Projected Net</span>
                      <span className="font-black text-2xl md:text-4xl text-[#66dd8b]">${Math.floor(realizableProfit).toLocaleString()}</span>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AI ADVISOR SIDEBAR - MOBILE FRIENDLY */}
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
          <input type="text" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} placeholder="Query fiscal data..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-white outline-none" />
          <button type="submit" className="absolute right-3 top-2.5 text-[#adc7ff] material-symbols-outlined">send</button>
        </form>
      </aside>

      {/* ADD ASSET MODAL - GLOBAL POSITION */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[#1c1b1b] w-full max-w-md p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-in zoom-in">
            <h3 className="text-3xl font-black mb-8">Vault Asset</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <input className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white" placeholder="Asset Name" onChange={(e) => setNewItem({...newItem, name: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white" placeholder="Cost ($)" onChange={(e) => setNewItem({...newItem, cost_price: e.target.value})} required />
                <input type="number" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white" placeholder="Market ($)" onChange={(e) => setNewItem({...newItem, market_price: e.target.value})} required />
              </div>
              <input type="number" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white" placeholder="Units" onChange={(e) => setNewItem({...newItem, stock: e.target.value})} required />
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 text-gray-500 font-bold uppercase text-xs">Cancel</button>
                <button type="submit" className="flex-1 bg-[#4182ff] py-4 rounded-2xl font-black uppercase text-xs">Initialize</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
         {activeTab === "reports" && (
   <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom duration-500">
     <div className="bg-[#1c1b1b] p-6 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 shadow-2xl">
        <h3 className="text-xl md:text-3xl font-black font-['Manrope'] mb-8 border-b border-white/5 pb-6">Ledger Performance Summary</h3>
        <div className="space-y-6 font-['Inter']">
          <div className="flex flex-col md:flex-row justify-between md:items-center pb-4 border-b border-white/5 gap-2">
            <span className="text-gray-400 font-medium text-xs">Total Asset Value</span>
            <span className="font-black text-xl md:text-2xl">${totalValuation.toLocaleString()}</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between md:items-center pb-4 border-b border-white/5 gap-2">
            <span className="text-gray-400 font-medium text-xs">Capital Invested</span>
            <span className="font-black text-xl md:text-2xl text-red-400">-${Math.floor(totalInvestment).toLocaleString()}</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between bg-[#66dd8b]/10 p-6 md:p-10 rounded-3xl mt-8 border border-[#66dd8b]/20 gap-4">
            <span className="text-[#66dd8b] font-black uppercase tracking-widest text-[10px]">Projected Profit</span>
            <span className="font-black font-['Manrope'] text-2xl md:text-4xl text-[#66dd8b]">${Math.floor(realizableProfit).toLocaleString()}</span>
          </div>
        </div>
     </div>
   </div>
)}
        </div>
      </main>

<aside className={`${isAdvisorOpen ? 'fixed inset-y-0 right-0 z-50 w-80 flex' : 'hidden'} md:relative md:flex md:w-80 bg-[#1c1b1b] border-l border-white/5 p-6 flex-col h-full shrink-0 shadow-2xl transition-all duration-300`}>
  {/* Close button for mobile */}
  <button 
    onClick={() => setIsAdvisorOpen(false)} 
    className="md:hidden absolute top-4 right-4 text-gray-500 material-symbols-outlined"
  >
    close
  </button>
  
  <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 uppercase font-black text-[11px] tracking-widest">
    AI Advisor
  </div>

  {isAddModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <div className="bg-[#1c1b1b] w-full max-w-md p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-in zoom-in duration-300">
      <h3 className="text-3xl font-black font-['Manrope'] mb-8">Vault New Asset</h3>
      <form onSubmit={handleAddItem} className="space-y-4">
        
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black text-gray-500 ml-2 tracking-widest">Asset Name</label>
          <input 
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#4182ff]" 
            placeholder="e.g. Vintage Rolex" 
            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black text-gray-500 ml-2 tracking-widest">Cost Point ($)</label>
            <input 
              type="number"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#4182ff]" 
              placeholder="Purchase Price" 
              onChange={(e) => setNewItem({...newItem, cost_price: e.target.value})}
              required 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black text-gray-500 ml-2 tracking-widest">Market Price ($)</label>
            <input 
              type="number"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#4182ff]" 
              placeholder="Current Value" 
              onChange={(e) => setNewItem({...newItem, market_price: e.target.value})}
              required 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black text-gray-500 ml-2 tracking-widest">Quantity</label>
          <input 
            type="number"
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#4182ff]" 
            placeholder="Units" 
            onChange={(e) => setNewItem({...newItem, stock: e.target.value})}
            required 
          />
        </div>

        <div className="flex gap-4 pt-6">
          <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 text-gray-500 font-bold uppercase text-xs tracking-widest">Cancel</button>
          <button type="submit" className="flex-1 bg-[#4182ff] py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-[#4182ff]/20">Initialize Asset</button>
        </div>
      </form>
    </div>
  </div>
)}
  {/* The rest of your code (chatHistory.map, etc.) continues below... */}
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 uppercase font-black text-[11px] tracking-widest">AI Advisor</div>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-4 rounded-2xl text-[11px] leading-relaxed font-['Inter'] ${msg.role === 'assistant' ? 'bg-black/30 border-l-2 border-[#adc7ff] text-gray-400' : 'bg-[#adc7ff]/10 text-[#adc7ff] text-right'}`}>{msg.text}</div>
          ))}
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
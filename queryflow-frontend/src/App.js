import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";
const GOOGLE_CLIENT_ID = "355056127518-9jjnnp9q7mkeum589k53dseuvdsrdpnf.apps.googleusercontent.com";

// --- AUTH COMPONENTS ---
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

// --- 1. LANDING PAGE (STITCH DESIGN) ---
const LandingPage = () => (
  <div className="bg-[#131313] min-h-screen text-white font-sans selection:bg-[#adc7ff] selection:text-[#002e68]">
    <header className="fixed top-0 right-0 left-0 h-16 flex justify-between items-center px-8 z-50 bg-[#131313]/60 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-8">
        <span className="text-lg font-black tracking-tighter font-headline">QueryFlow Vault</span>
        <nav className="hidden md:flex gap-6 text-sm text-gray-400 font-medium">
          <a href="#" className="hover:text-white transition-opacity">Features</a>
          <a href="#" className="hover:text-white transition-opacity">Solutions</a>
          <a href="#" className="hover:text-white transition-opacity">Pricing</a>
          <a href="#" className="hover:text-white transition-opacity">Security</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white">Login</Link>
        <Link to="/signup" className="bg-[#adc7ff] text-[#002e68] px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105">Request Demo</Link>
      </div>
    </header>

    <main className="pt-32 px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#66dd8b] animate-pulse"></span>
            <span className="text-[10px] font-label uppercase tracking-widest text-gray-400">v4.0 Live Tracking</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-[0.9]">
            The Modern CFO's<br/>
            <span className="text-[#adc7ff] italic">Digital Vault</span>
          </h1>
          <p className="max-w-xl text-lg text-gray-400 leading-relaxed font-body">
            Unify ledger integrity with algorithmic foresight. QueryFlow Vault transforms raw fiscal data into a fortress of institutional intelligence.
          </p>
          <div className="flex gap-4 pt-4">
            <Link to="/signup" className="bg-gradient-to-br from-[#adc7ff] to-[#4a8eff] text-[#002e68] px-8 py-4 rounded-lg font-bold text-lg hover:-translate-y-1 transition-transform shadow-xl shadow-[#adc7ff]/10">Start for Free</Link>
            <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors">Request Demo</button>
          </div>
        </div>
        
        {/* Bento Stats Visuals */}
        <div className="lg:col-span-5 grid grid-cols-6 grid-rows-6 gap-3 h-[500px] relative">
          <div className="col-span-4 row-span-3 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
            <span className="text-[10px] font-label text-gray-500 uppercase tracking-widest">Net Revenue at Risk</span>
            <div className="space-y-2">
              <span className="text-4xl font-headline font-bold text-[#adc7ff]">$4.2M</span>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#adc7ff] w-2/3"></div>
              </div>
            </div>
          </div>
          <div className="col-span-2 row-span-4 bg-[#1c1b1b] rounded-2xl p-6 border border-white/10 flex flex-col justify-between items-center text-center">
             <div className="w-12 h-12 bg-[#66dd8b]/10 rounded-full flex items-center justify-center">
                <span className="text-[#66dd8b] text-3xl font-bold">↗</span>
             </div>
             <div>
               <span className="block text-[10px] text-gray-500 font-label uppercase tracking-widest">YTD GROWTH</span>
               <span className="text-2xl font-bold text-[#66dd8b]">+12.4%</span>
             </div>
          </div>
          <div className="col-span-4 row-span-3 bg-[#66dd8b] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#66dd8b]/20">
            <div className="w-16 h-16 bg-[#003115] rounded-full flex items-center justify-center">
              <span className="text-[#66dd8b] text-4xl font-black">✓</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

// --- 2. THE VAULT (DASHBOARD) ---
const Vault = ({ userId }) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "", price: "", cost: "", stock: "" });

  useEffect(() => { fetchItems(); }, [userId]);
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setItems([]); }
  };

  const addItem = async () => {
    if (!form.name || !form.price) return alert("Required: Name & Price");
    await axios.post(`${API_BASE_URL}/api/products`, { ...form, user_id: userId });
    setForm({ name: "", price: "", cost: "", stock: "" });
    fetchItems();
  };

  const deleteItem = async (id) => {
    if(window.confirm("Archive this entry?")) {
        await axios.delete(`${API_BASE_URL}/api/products/${id}?userId=${userId}`);
        fetchItems();
    }
  };

  const taxRate = 0.18;
  const totalValuation = items.reduce((acc, item) => acc + (item.price * item.stock), 0);
  const totalCost = items.reduce((acc, item) => acc + (item.cost * item.stock), 0);
  const estimatedTax = totalValuation * taxRate;
  const netProfit = (totalValuation - totalCost) - estimatedTax;
  const filteredItems = items.filter(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-[#0e0e0e] min-h-screen pt-24 px-8 pb-12 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
            <h2 className="text-4xl font-black font-headline tracking-tighter">Precision Architecture</h2>
            <p className="text-gray-500 mt-2 font-body">Enterprise-grade tools engineered for institutional speed.</p>
        </div>

        {/* TOP STATS BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          <div className="md:col-span-8 bg-[#1c1b1b] rounded-[2rem] p-8 border border-white/5 flex justify-between items-center group hover:border-[#adc7ff]/30 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#adc7ff]/10 flex items-center justify-center text-xl">📦</div>
              <h3 className="text-2xl font-bold font-headline">Inventory Valuation</h3>
              <p className="text-sm text-gray-500 max-w-sm">Connect global logistics hubs to your balance sheet instantly.</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-label text-gray-600 block uppercase tracking-widest">CURRENT BALANCE</span>
              <span className="text-5xl font-black text-[#adc7ff] font-headline tracking-tighter">${totalValuation.toLocaleString()}</span>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#1c1b1b] rounded-[2rem] p-8 border border-white/5 flex flex-col justify-between">
            <div className="space-y-4">
               <div className="w-12 h-12 rounded-xl bg-[#66dd8b]/10 flex items-center justify-center text-xl text-[#66dd8b]">🧠</div>
               <h3 className="text-xl font-bold font-headline">AI Tax Forecasting</h3>
            </div>
            <div className="mt-8">
              <div className="flex justify-between text-[10px] font-label text-[#66dd8b] mb-2 uppercase tracking-widest">
                <span>ESTIMATED TAX</span>
                <span>18.0%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#66dd8b] w-[18%]"></div>
              </div>
              <span className="block mt-4 text-2xl font-black text-[#ffb4ab] font-headline">-${estimatedTax.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* INPUT TERMINAL */}
        <div className="bg-[#1c1b1b] p-3 rounded-2xl mb-12 flex flex-wrap gap-3 border border-white/5 items-center">
          <input className="bg-[#2a2a2a] border-none text-white rounded-xl px-5 py-3 flex-1 min-w-[200px] outline-none focus:ring-1 ring-[#adc7ff]/50" placeholder="SKU Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input className="bg-[#2a2a2a] border-none text-white rounded-xl px-5 py-3 w-32 outline-none" type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          <input className="bg-[#2a2a2a] border-none text-white rounded-xl px-5 py-3 w-32 outline-none" type="number" placeholder="Cost" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} />
          <input className="bg-[#2a2a2a] border-none text-white rounded-xl px-5 py-3 w-24 outline-none" type="number" placeholder="Qty" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
          <button onClick={addItem} className="bg-[#adc7ff] text-[#002e68] px-10 py-3 rounded-xl font-black hover:scale-105 transition-all">ADD SKU</button>
        </div>

        {/* INVENTORY LIST */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-[#1c1b1b] border border-white/5 rounded-[2.5rem] p-8 relative group hover:border-[#adc7ff]/30 transition-all">
              {item.stock <= 5 && <span className="absolute top-4 right-4 bg-[#93000a] text-[#ffdad6] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">REORDER REQ</span>}
              <h4 className="text-xl font-bold font-headline text-white mb-6">{item.name}</h4>
              <div className="flex justify-between items-center bg-black/40 p-5 rounded-2xl mb-6">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-label">Unit Profit</span>
                  <span className="text-[#66dd8b] font-black text-xl font-headline">+${(item.price - item.cost).toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block uppercase font-label">Inventory</span>
                  <span className="text-white font-black text-xl font-headline">{item.stock}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => deleteItem(item.id)} className="w-full bg-white/5 hover:bg-red-500/10 hover:text-red-400 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-widest">Archive SKU</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- AUTH SCREENS ---
const AuthLayout = ({ children, title, badge }) => (
  <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center px-4">
    <div className="max-w-md w-full bg-[#1c1b1b] p-12 rounded-[3rem] border border-white/5 text-center shadow-2xl">
      <div className="text-[10px] font-label text-[#adc7ff] tracking-[0.4em] mb-4 uppercase">{badge}</div>
      <h2 className="text-4xl font-headline font-black text-white mb-10 tracking-tight">{title}</h2>
      {children}
    </div>
  </div>
);

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { alert(error.message); }
    else { onLogin(true, data.user.email); navigate("/vault"); }
  };

  return (
    <AuthLayout title="Access Terminal" badge="Secure Node: 042">
      <form onSubmit={handleManualLogin} className="space-y-4">
        <input className="w-full bg-[#2a2a2a] border-none text-white rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-[#adc7ff]/30" type="email" placeholder="Business Email" onChange={e => setEmail(e.target.value)} required />
        <input className="w-full bg-[#2a2a2a] border-none text-white rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-[#adc7ff]/30" type="password" placeholder="Terminal Password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all">VERIFY IDENTITY</button>
      </form>
      <div className="my-10 flex items-center gap-4 text-gray-700 text-xs font-bold uppercase tracking-widest"><div className="h-px flex-1 bg-white/5"></div>Encrypted Gateway<div className="h-px flex-1 bg-white/5"></div></div>
      <GoogleBtn onLogin={onLogin} />
    </AuthLayout>
  );
};

// --- MAIN APP ---
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

  const handleLogin = (status, id) => {
    setIsAuthenticated(status); setUserId(id);
    localStorage.setItem("isLoggedIn", status); localStorage.setItem("userId", id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false); setUserId("");
    localStorage.clear();
  };

  return (
    <Router>
      <NavManager isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Login onLogin={handleLogin} />} />
        <Route path="/vault" element={isAuthenticated ? <Vault userId={userId} /> : <Navigate to="/login" />} />
        <Route path="/advisor" element={isAuthenticated ? <Advisor userId={userId} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

const NavManager = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();
  if (!isAuthenticated || ["/", "/login", "/signup"].includes(location.pathname)) return null;
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-50">
      <div className="font-black text-white tracking-tighter text-lg font-headline">QueryFlow <span className="text-[#adc7ff]">Vault</span></div>
      <div className="flex gap-6 items-center">
        <Link to="/vault" className="text-sm text-gray-400 hover:text-white transition-colors font-body">Ledger</Link>
        <Link to="/advisor" className="text-sm text-gray-400 hover:text-white transition-colors font-body">CFO Suite</Link>
        <button onClick={onLogout} className="bg-white/5 text-white px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest hover:bg-white/10 transition-colors uppercase">Logout</button>
      </div>
    </nav>
  );
};

export default App;
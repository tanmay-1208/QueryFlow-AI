import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";
const GOOGLE_CLIENT_ID = "355056127518-9jjnnp9q7mkeum589k53dseuvdsrdpnf.apps.googleusercontent.com";

// --- 1. AUTH HELPERS ---
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

// --- 2. STITCH FULL LANDING PAGE ---
const LandingPage = () => (
  <div className="bg-[#131313] min-h-screen text-white font-body selection:bg-[#adc7ff] selection:text-[#002e68]">
    {/* Navigation */}
    <header className="fixed top-0 w-full h-16 flex justify-between items-center px-8 z-50 bg-[#131313]/60 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-8">
        <span className="text-lg font-black tracking-tighter font-headline">QueryFlow Vault</span>
        <nav className="hidden md:flex gap-6 text-sm text-gray-400 font-medium">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white">Login</Link>
        <Link to="/signup" className="bg-[#adc7ff] text-[#002e68] px-4 py-2 rounded-lg text-sm font-bold hover:scale-105 transition-all">Request Demo</Link>
      </div>
    </header>

    <main className="pt-20">
      {/* SECTION A: HERO */}
      <section className="px-8 py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#66dd8b]"></span>
            <span className="text-[10px] font-label uppercase tracking-widest text-gray-400">v4.0 Live Tracking</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-[0.9]">
            The Modern CFO's<br/><span className="text-[#adc7ff] italic">Digital Vault</span>
          </h1>
          <p className="max-w-xl text-lg text-gray-400 leading-relaxed">
            Unify ledger integrity with algorithmic foresight. QueryFlow Vault transforms raw fiscal data into a fortress of institutional intelligence.
          </p>
          <div className="flex gap-4">
            <Link to="/signup" className="bg-[#adc7ff] text-[#002e68] px-8 py-4 rounded-lg font-bold text-lg hover:-translate-y-1 transition-all">Start for Free</Link>
            <button className="bg-[#1c1b1b] border border-white/10 px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10">Request Demo</button>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-6 grid-rows-6 gap-3 h-[500px]">
          <div className="col-span-4 row-span-3 bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
            <span className="text-[10px] font-label text-gray-500 uppercase">Net Revenue at Risk</span>
            <div className="space-y-2">
              <span className="text-4xl font-headline font-bold text-[#adc7ff]">$4.2M</span>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#adc7ff] w-2/3"></div>
              </div>
            </div>
          </div>
          <div className="col-span-2 row-span-4 bg-[#1c1b1b] rounded-2xl p-6 border border-white/10 flex flex-col justify-between items-center text-center">
             <div className="w-12 h-12 bg-[#66dd8b]/10 rounded-full flex items-center justify-center text-[#66dd8b] text-2xl font-bold">↗</div>
             <div>
               <span className="block text-[10px] text-gray-500 font-label uppercase">YTD GROWTH</span>
               <span className="text-2xl font-bold text-[#66dd8b]">+12.4%</span>
             </div>
          </div>
          <div className="col-span-4 row-span-3 bg-[#66dd8b] rounded-2xl flex items-center justify-center">
            <div className="w-16 h-16 bg-[#003115] rounded-full flex items-center justify-center text-[#66dd8b] text-4xl font-black">✓</div>
          </div>
        </div>
      </section>

      {/* SECTION B: PRECISION ARCHITECTURE */}
      <section id="features" className="py-24 px-8 bg-[#0e0e0e] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-headline font-extrabold text-white mb-4">Precision Architecture</h2>
            <p className="text-gray-500 max-w-2xl font-body">Enterprise-grade tools engineered for speed, transparency, and regulatory compliance.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-[#1c1b1b] rounded-2xl p-8 border border-white/5 flex flex-col md:flex-row justify-between group hover:border-[#adc7ff]/30 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#adc7ff]/10 flex items-center justify-center text-[#adc7ff]">
                   <span className="material-symbols-outlined">inventory_2</span>
                </div>
                <h3 className="text-xl font-bold font-headline">Real-time Inventory Valuation</h3>
                <p className="text-sm text-gray-500 max-w-xs font-body">Connect global logistics hubs to your balance sheet instantly. Automated triggers ensure zero lag.</p>
                <div className="flex gap-4 pt-4">
                  <div className="text-[10px] font-label text-gray-500 px-3 py-1 bg-white/5 rounded border border-white/5 uppercase tracking-widest">SKU Latency: 4ms</div>
                  <div className="text-[10px] font-label text-gray-500 px-3 py-1 bg-white/5 rounded border border-white/5 uppercase tracking-widest">Global Sync: On</div>
                </div>
              </div>
              <div className="mt-8 md:mt-0 md:w-1/3 bg-gradient-to-br from-[#adc7ff]/10 to-transparent rounded-xl opacity-20"></div>
            </div>

            <div className="md:col-span-4 bg-[#1c1b1b] rounded-2xl p-8 border border-white/5 flex flex-col justify-between hover:border-[#66dd8b]/30 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#66dd8b]/10 flex items-center justify-center text-[#66dd8b]">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <h3 className="text-xl font-bold font-headline">AI-Driven Tax Forecasting</h3>
                <p className="text-sm text-gray-500 font-body">Predict jurisdictional liability before the quarter ends. Our engine scans 40+ global codes.</p>
              </div>
              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="flex justify-between text-xs font-label text-[#66dd8b] mb-2 font-bold uppercase tracking-widest">
                  <span>Accuracy Rate</span>
                  <span>99.4%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#66dd8b] w-[99.4%] shadow-[0_0_10px_#66dd8b]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: LEDGER TABLE */}
      <section className="py-24 px-8 bg-[#0e0e0e]">
        <div className="max-w-7xl mx-auto bg-[#1c1b1b] rounded-2xl border border-[#adc7ff]/20 overflow-hidden relative">
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
             <span className="text-[10px] font-label uppercase tracking-widest text-[#adc7ff]">Consolidated Ledger v4.2</span>
             <div className="w-2 h-2 rounded-full bg-[#adc7ff] animate-pulse"></div>
          </div>
          <div className="p-8 overflow-x-auto">
            <table className="w-full text-left font-label">
              <thead className="text-[10px] text-gray-500 uppercase tracking-widest">
                <tr><th className="pb-4">Entity</th><th className="pb-4">Currency</th><th className="pb-4">Balance</th><th className="pb-4">Status</th><th className="pb-4 text-right">Trend</th></tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5 font-body">
                <tr className="hover:bg-white/5 transition-colors"><td className="py-4 text-white">EMEA North</td><td className="py-4 text-gray-500">EUR</td><td className="py-4 text-white font-bold">1,492,000.00</td><td className="py-4"><span className="px-2 py-1 rounded bg-[#66dd8b]/10 text-[#66dd8b] text-[10px] font-bold">VERIFIED</span></td><td className="py-4 text-right text-[#66dd8b] font-bold">+4.2%</td></tr>
                <tr className="hover:bg-white/5 transition-colors"><td className="py-4 text-white">APAC West</td><td className="py-4 text-gray-500">SGD</td><td className="py-4 text-white font-bold">840,230.15</td><td className="py-4"><span className="px-2 py-1 rounded bg-[#66dd8b]/10 text-[#66dd8b] text-[10px] font-bold">VERIFIED</span></td><td className="py-4 text-right text-[#66dd8b] font-bold">+1.8%</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION D: CTA */}
      <section className="py-32 px-8 text-center relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-primary/5 blur-[120px]"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-10">
          <h2 className="text-5xl md:text-6xl font-black font-headline text-white tracking-tighter">Ready to secure your fiscal future?</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto font-body">Join 400+ enterprise CFOs who have achieved total visibility with QueryFlow Vault.</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-6">
            <Link to="/signup" className="w-full md:w-auto px-12 py-5 bg-white text-black font-extrabold rounded-xl hover:bg-[#adc7ff] transition-all text-center">Request Demo Access</Link>
            <button className="w-full md:w-auto px-12 py-5 bg-transparent border border-white/20 text-white font-extrabold rounded-xl hover:bg-white/5 transition-all">View Security Architecture</button>
          </div>
        </div>
      </section>
    </main>

    <footer className="py-12 px-8 border-t border-white/5 bg-[#131313] flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-label uppercase tracking-widest text-gray-600">© 2026 QueryFlow Vault. System Status: <span className="text-[#66dd8b] font-bold">Operational.</span></span>
      </div>
      <div className="flex gap-8 text-[10px] font-label uppercase tracking-widest text-gray-600">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a><a href="#" className="hover:text-white transition-colors">Terms of Service</a><a href="#" className="hover:text-white transition-colors">Security</a>
      </div>
    </footer>
  </div>
);

// --- 3. THE VAULT (DASHBOARD) ---
const Vault = ({ userId }) => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", cost: "", stock: "" });

  useEffect(() => { fetchItems(); }, [userId]);
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?userId=${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setItems([]); }
  };

  const addItem = async () => {
    if (!form.name || !form.price) return;
    await axios.post(`${API_BASE_URL}/api/products`, { ...form, user_id: userId });
    setForm({ name: "", price: "", cost: "", stock: "" });
    fetchItems();
  };

  const deleteItem = async (id) => {
    if(window.confirm("Archive entry?")) {
        await axios.delete(`${API_BASE_URL}/api/products/${id}?userId=${userId}`);
        fetchItems();
    }
  };

  const totalValuation = items.reduce((acc, item) => acc + (item.price * item.stock), 0);
  const totalCost = items.reduce((acc, item) => acc + (item.cost * item.stock), 0);
  const estimatedTax = totalValuation * 0.18;
  const netProfit = (totalValuation - totalCost) - estimatedTax;

  return (
    <div className="bg-[#0e0e0e] min-h-screen pt-24 px-8 pb-12 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
            <h2 className="text-4xl font-black font-headline tracking-tighter">Precision Architecture</h2>
            <p className="text-gray-500 mt-2 font-body">Enterprise-grade tools for institutional speed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          <div className="md:col-span-8 bg-[#1c1b1b] rounded-[2rem] p-8 border border-white/5 flex justify-between items-center group hover:border-[#adc7ff]/30 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#adc7ff]/10 flex items-center justify-center text-xl">📦</div>
              <h3 className="text-2xl font-bold font-headline">Inventory Valuation</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-label text-gray-600 block uppercase tracking-widest">LIVE VALUE</span>
              <span className="text-5xl font-black text-[#adc7ff] font-headline tracking-tighter">${totalValuation.toLocaleString()}</span>
            </div>
          </div>
          <div className="md:col-span-4 bg-[#1c1b1b] rounded-[2rem] p-8 border border-white/5 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#66dd8b]/10 flex items-center justify-center text-xl text-[#66dd8b]">🧠</div>
            <div>
              <div className="flex justify-between text-[10px] font-label text-[#66dd8b] mb-2 uppercase tracking-widest font-bold"><span>EST. TAX (18%)</span><span>-${estimatedTax.toLocaleString()}</span></div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-[#66dd8b] w-[18%] shadow-[0_0_10px_#66dd8b]"></div></div>
            </div>
          </div>
        </div>

        <div className="bg-[#1c1b1b] p-3 rounded-2xl mb-12 flex flex-wrap gap-3 border border-white/5 items-center">
          <input className="bg-[#2a2a2a] border-none text-white rounded-xl px-5 py-3 flex-1 min-w-[200px]" placeholder="SKU Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input className="bg-[#2a2a2a] border-none text-white rounded-xl px-5 py-3 w-32" type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          <input className="bg-[#2a2a2a] border-none text-white rounded-xl px-5 py-3 w-32" type="number" placeholder="Cost" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} />
          <input className="bg-[#2a2a2a] border-none text-white rounded-xl px-5 py-3 w-24" type="number" placeholder="Qty" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
          <button onClick={addItem} className="bg-[#adc7ff] text-[#002e68] px-10 py-3 rounded-xl font-black hover:scale-105 transition-all uppercase tracking-widest text-xs">Deploy SKU</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-[#1c1b1b] border border-white/5 rounded-[2.5rem] p-8 relative group hover:border-[#adc7ff]/30 transition-all">
              {item.stock <= 5 && <span className="absolute top-4 right-4 bg-red-500/10 text-red-500 text-[10px] font-bold px-3 py-1 rounded-full border border-red-500/20">REORDER REQ</span>}
              <h4 className="text-xl font-bold font-headline text-white mb-6">{item.name}</h4>
              <div className="flex justify-between items-center bg-black/40 p-5 rounded-2xl mb-6">
                <div><span className="text-[10px] text-gray-500 block uppercase font-label">Unit Profit</span><span className="text-[#66dd8b] font-black text-xl font-headline">+${(item.price - item.cost).toLocaleString()}</span></div>
                <div className="text-right"><span className="text-[10px] text-gray-500 block uppercase font-label">Stock</span><span className="text-white font-black text-xl font-headline">{item.stock}</span></div>
              </div>
              <button onClick={() => deleteItem(item.id)} className="w-full bg-white/5 hover:bg-red-500/10 hover:text-red-500 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-widest">Archive SKU</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 4. AUTH & MAIN ---
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
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1c1b1b] p-12 rounded-[3rem] border border-white/5 text-center shadow-2xl">
        <div className="text-[10px] font-label text-[#adc7ff] tracking-[0.4em] mb-4 uppercase">Secure Node: 042</div>
        <h2 className="text-4xl font-headline font-black text-white mb-10 tracking-tight">Access Terminal</h2>
        <form onSubmit={handleManualLogin} className="space-y-4">
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-2xl px-6 py-4" type="email" placeholder="Business Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-[#2a2a2a] border-none text-white rounded-2xl px-6 py-4" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all">VERIFY IDENTITY</button>
        </form>
        <div className="my-10 flex items-center gap-4 text-gray-700 text-xs font-bold uppercase tracking-widest"><div className="h-px flex-1 bg-white/5"></div>OR<div className="h-px flex-1 bg-white/5"></div></div>
        <GoogleBtn onLogin={onLogin} />
      </div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const handleLogin = (status, id) => { setIsAuthenticated(status); setUserId(id); localStorage.setItem("isLoggedIn", status); localStorage.setItem("userId", id); };
  const handleLogout = () => { setIsAuthenticated(false); setUserId(""); localStorage.clear(); };

  return (
    <Router>
      <NavManager isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Login onLogin={handleLogin} />} />
        <Route path="/vault" element={isAuthenticated ? <Vault userId={userId} /> : <Navigate to="/login" />} />
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
      <div className="flex gap-6 items-center"><Link to="/vault" className="text-sm text-gray-400 hover:text-white transition-colors font-body">Ledger</Link><button onClick={onLogout} className="bg-white/5 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">Logout</button></div>
    </nav>
  );
};

export default App;
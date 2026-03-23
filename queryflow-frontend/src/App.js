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
        theme: "outline", 
        size: "large", 
        width: "320" 
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
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-gray-400 hover:text-white text-sm font-medium">Login</Link>
        <Link to="/signup" className="bg-[#adc7ff] text-[#002e68] px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105">Get Started</Link>
      </div>
    </header>

    <main className="pt-32 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#66dd8b]"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">v4.0 Live Tracking</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-[0.9]">
            The Modern CFO's<br/>
            <span className="text-[#adc7ff] italic">Digital Vault</span>
          </h1>
          <p className="max-w-xl text-lg text-gray-400 leading-relaxed font-body">
            Unify ledger integrity with algorithmic foresight. QueryFlow Vault transforms raw fiscal data into a fortress of institutional intelligence.
          </p>
          <div className="flex gap-4 pt-4">
            <Link to="/signup" className="bg-gradient-to-br from-[#adc7ff] to-[#4a8eff] text-[#002e68] px-8 py-4 rounded-lg font-bold text-lg hover:-translate-y-1 transition-transform">Start for Free</Link>
            <Link to="/login" className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors">Access Vault</Link>
          </div>
        </div>
      </div>
    </main>
  </div>
);

// --- 2. THE VAULT (BENTO GRID DESIGN) ---
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

  const handleAction = async (type, id) => {
    await axios.post(`${API_BASE_URL}/api/products/${type}/${id}?userId=${userId}`);
    fetchItems();
  };

  const deleteItem = async (id) => {
    if(window.confirm("Delete SKU?")) {
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
    <div className="bg-[#0e0e0e] min-h-screen pt-24 px-8 pb-12 text-white font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-white/5">
          <span className="text-[10px] font-label text-gray-500 uppercase tracking-widest">VAULT VALUATION</span>
          <h3 className="text-3xl font-black text-[#adc7ff] mt-2">${totalValuation.toLocaleString()}</h3>
        </div>
        <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-white/5">
          <span className="text-[10px] font-label text-gray-500 uppercase tracking-widest">TAX LIABILITY (18%)</span>
          <h3 className="text-3xl font-black text-[#ffb4ab] mt-2">-${estimatedTax.toLocaleString()}</h3>
        </div>
        <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-white/5">
          <span className="text-[10px] font-label text-gray-500 uppercase tracking-widest">NET PROFIT</span>
          <h3 className="text-3xl font-black text-[#66dd8b] mt-2">${netProfit.toLocaleString()}</h3>
        </div>
        <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-white/5">
          <span className="text-[10px] font-label text-gray-500 uppercase tracking-widest">TOTAL SKUs</span>
          <h3 className="text-3xl font-black text-white mt-2">{items.length}</h3>
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-[#1c1b1b] p-4 rounded-xl mb-12 flex flex-wrap gap-4 border border-white/5 items-center">
        <input className="bg-[#2a2a2a] border-none text-white rounded-lg px-4 py-3 flex-1 min-w-[200px]" placeholder="Item Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input className="bg-[#2a2a2a] border-none text-white rounded-lg px-4 py-3 w-32" type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
        <input className="bg-[#2a2a2a] border-none text-white rounded-lg px-4 py-3 w-32" type="number" placeholder="Cost" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} />
        <input className="bg-[#2a2a2a] border-none text-white rounded-lg px-4 py-3 w-24" type="number" placeholder="Qty" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
        <button onClick={addItem} className="bg-[#adc7ff] text-[#002e68] px-8 py-3 rounded-lg font-bold hover:bg-[#4a8eff] transition-all">Add SKU</button>
      </div>

      <div className="max-w-7xl mx-auto mb-6">
        <input type="text" placeholder="🔍 Search Inventory..." className="w-full bg-transparent border-b border-white/10 py-4 text-xl outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-[#1c1b1b] border border-white/5 rounded-2xl p-6 relative group hover:border-[#adc7ff]/30 transition-all">
            {item.stock <= 5 && <span className="absolute top-4 right-4 bg-[#93000a] text-[#ffdad6] text-[10px] font-bold px-2 py-1 rounded">REORDER REQUIRED</span>}
            <h4 className="text-xl font-headline font-bold text-white mb-4">{item.name}</h4>
            <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl mb-6">
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">Unit Profit</span>
                <span className="text-[#66dd8b] font-bold text-lg">+${(item.price - item.cost).toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-500 block uppercase">Inventory</span>
                <span className="text-white font-bold text-lg">{item.stock}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleAction('sell', item.id)} className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-bold">SELL</button>
              <button onClick={() => handleAction('restock', item.id)} className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-bold">STOCK</button>
              <button onClick={() => deleteItem(item.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-lg text-xs font-bold">DEL</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 3. THE ADVISOR (STITCH DESIGN) ---
const Advisor = ({ userId }) => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAdvisor = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/chat`, { message: query, userId: userId });
      setResponse(res.data);
    } catch (err) { setResponse("Advisor connection error."); }
    setLoading(false);
  };

  return (
    <div className="bg-[#0e0e0e] min-h-screen pt-24 px-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-black font-headline mb-8">Financial AI Analyst</h2>
        <div className="bg-[#1c1b1b] p-6 rounded-3xl border border-white/5">
          <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Run profit optimization audit..." className="w-full bg-[#2a2a2a] border-none rounded-2xl p-6 text-white h-48 mb-6 outline-none" />
          <button onClick={askAdvisor} disabled={loading} className="w-full bg-[#adc7ff] text-[#002e68] py-4 rounded-xl font-bold text-lg hover:scale-[1.01] transition-all">
            {loading ? "ANALYZING LEDGER..." : "RUN AI AUDIT"}
          </button>
        </div>
        {response && <div className="mt-8 p-8 bg-[#1c1b1b] rounded-3xl border border-[#adc7ff]/20 animate-pulse-slow font-body leading-relaxed">{response}</div>}
      </div>
    </div>
  );
};

// --- 4. AUTH SCREENS ---
const AuthLayout = ({ children, title, badge }) => (
  <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center px-4">
    <div className="max-w-md w-full bg-[#1c1b1b] p-10 rounded-[2.5rem] border border-white/5 text-center">
      <div className="text-[10px] font-label text-[#adc7ff] tracking-[0.3em] mb-4 uppercase">{badge}</div>
      <h2 className="text-4xl font-headline font-black text-white mb-8">{title}</h2>
      {children}
    </div>
  </div>
);

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { alert(error.message); setLoading(false); }
    else { onLogin(true, data.user.email); navigate("/vault"); }
  };

  return (
    <AuthLayout title="Sign In" badge="Secure Node: 042">
      <form onSubmit={handleManualLogin} className="space-y-4">
        <input className="w-full bg-[#2a2a2a] border-none text-white rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-[#adc7ff]/50" type="email" placeholder="Business Email" onChange={e => setEmail(e.target.value)} required />
        <input className="w-full bg-[#2a2a2a] border-none text-white rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-[#adc7ff]/50" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading} className="w-full bg-[#adc7ff] text-[#002e68] py-4 rounded-2xl font-black hover:scale-[1.02] transition-all">
          {loading ? "VERIFYING..." : "VERIFY IDENTITY"}
        </button>
      </form>
      <div className="my-8 flex items-center gap-4 text-gray-700 text-xs font-bold uppercase"><div className="h-px flex-1 bg-white/5"></div>Encrypted Gateway<div className="h-px flex-1 bg-white/5"></div></div>
      <GoogleBtn onLogin={onLogin} />
    </AuthLayout>
  );
};

const Signup = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleManualSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { alert(error.message); setLoading(false); }
    else { onLogin(true, data.user.email); navigate("/vault"); }
  };

  return (
    <AuthLayout title="Register" badge="New Instance">
      <form onSubmit={handleManualSignup} className="space-y-4">
        <input className="w-full bg-[#2a2a2a] border-none text-white rounded-2xl px-6 py-4" type="text" placeholder="Business Name" required />
        <input className="w-full bg-[#2a2a2a] border-none text-white rounded-2xl px-6 py-4" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input className="w-full bg-[#2a2a2a] border-none text-white rounded-2xl px-6 py-4" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading} className="w-full bg-[#adc7ff] text-[#002e68] py-4 rounded-2xl font-black transition-all hover:scale-[1.02]">
          {loading ? "CREATING NODE..." : "CREATE ACCOUNT"}
        </button>
      </form>
      <div className="my-8 flex items-center gap-4 text-gray-700 text-xs font-bold uppercase"><div className="h-px flex-1 bg-white/5"></div>OR<div className="h-px flex-1 bg-white/5"></div></div>
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
        <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/vault" />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup onLogin={handleLogin} /> : <Navigate to="/vault" />} />
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
        <Link to="/vault" className="text-sm text-gray-400 hover:text-white transition-colors font-body">Inventory</Link>
        <Link to="/advisor" className="text-sm text-gray-400 hover:text-white transition-colors font-body">CFO Suite</Link>
        <button onClick={onLogout} className="bg-white/5 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">Logout</button>
      </div>
    </nav>
  );
};

export default App;
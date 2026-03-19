import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";
const GOOGLE_CLIENT_ID = "355056127518-9jjnnp9q7mkeum589k53dseuvdsrdpnf.apps.googleusercontent.com";

// --- GOOGLE AUTH COMPONENT ---
const GoogleBtn = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          console.log("Google Auth Success");
          onLogin(true);
          navigate("/vault");
        }
      });
      google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large", width: "320" }
      );
    }
  }, [onLogin, navigate]);

  return <div id="googleBtn" className="google-flex-center"></div>;
};

// --- 1. LANDING PAGE (PUBLIC) ---
const LandingPage = () => (
  <div className="landing-page">
    <nav className="public-nav">
      <div className="logo-text">QueryFlow <span className="blue-accent">SME</span></div>
      <div className="auth-btns">
        <Link to="/login" className="login-link">Login</Link>
        <Link to="/signup" className="cta-button-small">Get Started</Link>
      </div>
    </nav>
    <div className="hero-section">
      <h1 className="hero-title">Your Business Intelligence <br/> <span className="blue-accent">Simplified.</span></h1>
      <p className="hero-subtitle">The all-in-one CFO Suite for modern SMEs. Manage inventory, track real-time margins, and consult your AI Financial Analyst.</p>
      <div className="hero-actions">
        <Link to="/signup" className="cta-button">Start Free Trial</Link>
        <Link to="/login" className="secondary-button">Access Vault</Link>
      </div>
    </div>
  </div>
);

// --- 2. LOGIN COMPONENT ---
const Login = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleManualLogin = (e) => {
    e.preventDefault();
    if (user === "tanmay" && pass === "queryflow2026") {
      onLogin(true);
      navigate("/vault");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h2>Secure Login</h2>
        <p className="login-subtitle">Enter credentials to unlock your terminal</p>
        <form onSubmit={handleManualLogin}>
          <input type="text" placeholder="Username" className="biz-input full-width" onChange={(e)=>setUser(e.target.value)} />
          <input type="password" placeholder="Password" className="biz-input full-width" style={{marginTop:'10px'}} onChange={(e)=>setPass(e.target.value)} />
          <button type="submit" className="add-stock-btn login-btn">UNLOCK TERMINAL</button>
        </form>
        <div className="divider"><span>OR</span></div>
        <GoogleBtn onLogin={onLogin} />
        <p className="signup-text">New Client? <Link to="/signup" className="blue-accent">Create an Account</Link></p>
      </div>
    </div>
  );
};

// --- 3. SIGNUP COMPONENT ---
const Signup = ({ onLogin }) => (
  <div className="login-screen">
    <div className="login-card">
      <h2>Register Business</h2>
      <p className="login-subtitle">Join the QueryFlow SME Network</p>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="Business Name" className="biz-input full-width" />
        <input type="email" placeholder="Business Email" className="biz-input full-width" style={{marginTop:'10px'}} />
        <input type="password" placeholder="Set Password" className="biz-input full-width" style={{marginTop:'10px'}} />
        <button type="submit" className="add-stock-btn login-btn">CREATE ACCOUNT</button>
      </form>
      <div className="divider"><span>OR</span></div>
      <GoogleBtn onLogin={onLogin} />
      <p className="signup-text">Already a member? <Link to="/login" className="blue-accent">Login here</Link></p>
    </div>
  </div>
);

// --- 4. THE VAULT (INVENTORY) ---
const Vault = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "", price: "", cost: "", stock: "" });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setItems([]); }
  };

  const taxRate = 0.18;
  const totalValuation = items.reduce((acc, item) => acc + ((item?.price || 0) * (item?.stock || 0)), 0);
  const totalPotentialProfit = items.reduce((acc, item) => acc + (((item?.price || 0) - (item?.cost || 0)) * (item?.stock || 0)), 0);
  const estimatedTax = totalValuation * taxRate;
  const netAfterTax = totalPotentialProfit - estimatedTax;

  const filteredItems = items.filter(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const addItem = async () => {
    if (!form.name || !form.price) return alert("Required: Name & Price");
    try {
      await axios.post(`${API_BASE_URL}/api/products`, {
        name: form.name, price: parseFloat(form.price) || 0,
        cost: parseFloat(form.cost) || 0, stock: parseInt(form.stock) || 0
      });
      setForm({ name: "", price: "", cost: "", stock: "" });
      fetchItems();
    } catch (err) { console.error(err); }
  };

  const handleAction = async (type, id) => {
    try {
      await axios.post(`${API_BASE_URL}/api/products/${type}/${id}`);
      fetchItems();
    } catch (err) { console.error(err); }
  };

  const deleteItem = async (id) => {
    if(!window.confirm("Delete this SKU?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
      fetchItems();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="dashboard-container">
      <div className="stats-header">
        <div className="stat-card"><label className="stat-label">VALUATION</label><h3 className="stat-value">${totalValuation.toLocaleString()}</h3></div>
        <div className="stat-card"><label className="stat-label">TAX (18%)</label><h3 className="stat-value text-red">-${estimatedTax.toLocaleString()}</h3></div>
        <div className="stat-card"><label className="stat-label">NET PROFIT</label><h3 className="stat-value text-green">${netAfterTax.toLocaleString()}</h3></div>
        <div className="stat-card"><label className="stat-label">TOTAL SKUs</label><h3 className="stat-value">{items.length}</h3></div>
      </div>

      <div className="inventory-controls">
        <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Item Name" className="biz-input" />
        <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} placeholder="Price" className="biz-input" />
        <input type="number" value={form.cost} onChange={(e) => setForm({...form, cost: e.target.value})} placeholder="Cost" className="biz-input" />
        <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} placeholder="Qty" className="biz-input" />
        <button onClick={addItem} className="add-stock-btn">Add SKU</button>
      </div>

      <div className="search-section">
        <input type="text" placeholder="🔍 Search Inventory..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="inventory-grid">
        {filteredItems.map((item) => {
          const unitProfit = (item?.price || 0) - (item?.cost || 0);
          const marginPercent = ((unitProfit / (item?.price || 1)) * 100).toFixed(1);
          const isLowStock = (item?.stock || 0) <= 5;

          return (
            <div key={item.id} className={`inventory-card ${isLowStock ? 'low-stock-warning' : ''}`}>
              {isLowStock && <div className="alert-badge">REORDER</div>}
              <h4 className="item-title">{item.name}</h4>
              <div className="item-financials"><span>Price: <b>${item?.price || 0}</b></span><span>Cost: <b>${item?.cost || 0}</b></span></div>
              <div className="unit-economics">
                <div className="eco-item"><span className="eco-label">Profit</span><span className="eco-value text-green">+${unitProfit.toLocaleString()}</span></div>
                <div className="eco-item"><span className="eco-label">Margin</span><span className="eco-value">{marginPercent}%</span></div>
              </div>
              <div className={`item-meta ${isLowStock ? 'text-red bold' : ''}`}>Stock: {item?.stock || 0} | Sold: {item?.sold_count || 0}</div>
              <div className="item-actions">
                <button onClick={() => handleAction('sell', item.id)}>Sell</button>
                <button onClick={() => handleAction('restock', item.id)}>Stock</button>
                <button onClick={() => deleteItem(item.id)} className="del-btn">DEL</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- 5. THE ADVISOR (CFO SUITE) ---
const Advisor = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAdvisor = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/chat`, { message: query });
      setResponse(res.data);
    } catch (err) { setResponse("Advisor error."); }
    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      <h2 className="page-header">Financial AI Analyst</h2>
      <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask about profit optimization..." className="advisor-textarea" />
      <button onClick={askAdvisor} disabled={loading} className="add-stock-btn full-width">{loading ? "Analyzing..." : "Run AI Audit"}</button>
      {response && <div className="advisor-response fade-in">{response}</div>}
    </div>
  );
};

// --- MAIN APP (SaaS ROUTING) ---
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isLoggedIn") === "true");

  const handleLogin = (status) => {
    setIsAuthenticated(status);
    localStorage.setItem("isLoggedIn", status);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <Router>
      <div className="App-wrapper">
        <NavManager isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/vault" />} />
          <Route path="/signup" element={!isAuthenticated ? <Signup onLogin={handleLogin} /> : <Navigate to="/vault" />} />
          <Route path="/vault" element={isAuthenticated ? <Vault /> : <Navigate to="/login" />} />
          <Route path="/advisor" element={isAuthenticated ? <Advisor /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

const NavManager = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();
  if (!isAuthenticated || location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup") return null;
  return (
    <nav className="navbar">
      <div className="logo-group"><Link to="/vault" style={{textDecoration: 'none'}}><div className="logo-text">QueryFlow <span className="blue-accent">Vault</span></div></Link></div>
      <div className="nav-links">
        <Link to="/vault" className="nav-item">Inventory</Link>
        <Link to="/advisor" className="nav-item">CFO Suite</Link>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default App;
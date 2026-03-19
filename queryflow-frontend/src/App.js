import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";

// --- LOGIN COMPONENT ---
const Login = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Professional Master Credentials for Client Demo
    if (user === "admin" && pass === "queryflow2026") {
      onLogin(true);
    } else {
      alert("Access Denied: Invalid Credentials");
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1 className="logo-text">QueryFlow <span className="blue-accent">Secure</span></h1>
        <p className="login-subtitle">Enterprise Resource Planning Terminal</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input type="text" placeholder="admin" className="biz-input full-width" onChange={(e) => setUser(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" className="biz-input full-width" onChange={(e) => setPass(e.target.value)} />
          </div>
          <button type="submit" className="add-stock-btn login-btn">UNLOCK TERMINAL</button>
        </form>
        <p className="login-footer">© 2026 QueryFlow Business Intelligence</p>
      </div>
    </div>
  );
};

// --- DASHBOARD COMPONENTS ---
const Navigation = ({ onLogout }) => {
  const location = useLocation();
  if (location.pathname === "/") return null;
  return (
    <nav className="navbar">
      <div className="logo-group">
        <Link to="/vault" style={{textDecoration: 'none'}}>
          <div className="logo-text">QueryFlow <span className="blue-accent">Business</span></div>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/vault" className="nav-item">Inventory</Link>
        <Link to="/advisor" className="nav-item">Advisor</Link>
        <button onClick={onLogout} className="logout-btn">Log Out</button>
      </div>
    </nav>
  );
};

const Vault = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "", price: "", cost: "", stock: "" });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { 
      console.error("Sync Error", err);
      setItems([]); 
    }
  };

  const taxRate = 0.18;
  const totalValuation = items.reduce((acc, item) => acc + ((item?.price || 0) * (item?.stock || 0)), 0);
  const totalPotentialProfit = items.reduce((acc, item) => acc + (((item?.price || 0) - (item?.cost || 0)) * (item?.stock || 0)), 0);
  const estimatedTax = totalValuation * taxRate;
  const netAfterTax = totalPotentialProfit - estimatedTax;

  const filteredItems = items.filter(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const topPerformer = items.length > 0 ? [...items].sort((a, b) => {
    const marginA = ((a?.price || 0) - (a?.cost || 0)) / (a?.price || 1);
    const marginB = ((b?.price || 0) - (b?.cost || 0)) / (b?.price || 1);
    return marginB - marginA;
  })[0] : null;

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
    if(!window.confirm("Permanent SKU deletion?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
      fetchItems();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="dashboard-container">
      <div className="stats-header">
        <div className="stat-card"><label className="stat-label">VALUATION</label><h3 className="stat-value">${totalValuation.toLocaleString()}</h3></div>
        <div className="stat-card"><label className="stat-label">TAX LIABILITY</label><h3 className="stat-value text-red">-${estimatedTax.toLocaleString()}</h3></div>
        <div className="stat-card"><label className="stat-label">NET PROFIT</label><h3 className="stat-value text-green">${netAfterTax.toLocaleString()}</h3></div>
        <div className="stat-card"><label className="stat-label">TOTAL SKUs</label><h3 className="stat-value">{items.length}</h3></div>
      </div>

      <div className="inventory-controls">
        <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Item Name" className="biz-input" />
        <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} placeholder="Sale Price" className="biz-input" />
        <input type="number" value={form.cost} onChange={(e) => setForm({...form, cost: e.target.value})} placeholder="Cost Price" className="biz-input" />
        <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} placeholder="Qty" className="biz-input" />
        <button onClick={addItem} className="add-stock-btn">Add SKU</button>
      </div>

      <div className="search-section">
        <input type="text" placeholder="🔍 Search inventory..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="inventory-grid">
        {filteredItems.map((item) => {
          const unitProfit = (item?.price || 0) - (item?.cost || 0);
          const marginPercent = ((unitProfit / (item?.price || 1)) * 100).toFixed(1);
          const isLowStock = (item?.stock || 0) <= 5;

          return (
            <div key={item.id} className={`inventory-card ${topPerformer?.id === item.id ? 'highlight-margin' : ''} ${isLowStock ? 'low-stock-warning' : ''}`}>
              {topPerformer?.id === item.id && <div className="margin-badge">Best Margin</div>}
              {isLowStock && <div className="alert-badge">REORDER</div>}
              <h4 className="item-title">{item.name}</h4>
              <div className="item-financials">
                <span>Price: <b>${item?.price || 0}</b></span>
                <span>Cost: <b>${item?.cost || 0}</b></span>
              </div>
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
    } catch (err) { setResponse("Advisor sync error."); }
    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      <h2 style={{marginBottom: '20px'}}>Financial Advisor</h2>
      <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Analyze my business..." className="advisor-textarea" />
      <button onClick={askAdvisor} disabled={loading} className="add-stock-btn full-width">{loading ? "Processing..." : "Run AI Audit"}</button>
      {response && <div className="advisor-response fade-in">{response}</div>}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
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

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <Router>
      <div className="App-wrapper">
        <Navigation onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Navigate to="/vault" />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/advisor" element={<Advisor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
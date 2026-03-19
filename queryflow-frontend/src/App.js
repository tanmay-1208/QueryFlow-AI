import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";

const Navigation = () => {
  const location = useLocation();
  if (location.pathname === "/") return null;
  return (
    <nav className="navbar">
      <div className="logo-group">
        <Link to="/" style={{textDecoration: 'none'}}><div className="logo gold-text">QUERYFLOW AI</div></Link>
        <div className="tagline-sub">EXECUTIVE TERMINAL</div>
      </div>
      <div className="nav-links">
        <Link to="/vault" className={`nav-item ${location.pathname === '/vault' ? 'active' : ''}`}>Vault</Link>
        <Link to="/advisor" className={`nav-item ${location.pathname === '/advisor' ? 'active' : ''}`}>CFO Suite</Link>
      </div>
    </nav>
  );
};

const LandingPage = () => (
  <div className="hero-wrapper">
    <div className="hero">
      <div className="status-indicator"><span className="dot"></span> SECURE CONNECTION ACTIVE</div>
      <h1 className="header-title">THE VIRTUAL CA</h1>
      <p className="hero-subtitle">
        Luxury Asset Security & Financial Intelligence. 
        High-fidelity tracking for elite portfolios.
      </p>
      <div className="hero-actions">
        <Link to="/vault" className="cta-button gold-bg">INITIALIZE VAULT</Link>
        <Link to="/advisor" className="secondary-btn">AI ANALYSIS</Link>
      </div>
    </div>
  </div>
);

const Vault = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", cost: "", stock: "" });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setItems(res.data);
    } catch (err) { console.error("Sync Error", err); }
  };

  const taxRate = 0.18;
  const totalValuation = items.reduce((acc, item) => acc + (item.price * item.stock), 0);
  const totalPotentialProfit = items.reduce((acc, item) => acc + ((item.price - item.cost) * item.stock), 0);
  const estimatedTax = totalValuation * taxRate;
  const netAfterTax = totalPotentialProfit - estimatedTax;

  const topPerformer = items.length > 0 ? [...items].sort((a, b) => {
    const marginA = (a.price - (a.cost || 0)) / (a.price || 1);
    const marginB = (b.price - (b.cost || 0)) / (b.price || 1);
    return marginB - marginA;
  })[0] : null;

  const addItem = async () => {
    if (!form.name || !form.price || !form.cost) return alert("Fill all fields");
    try {
      await axios.post(`${API_BASE_URL}/api/products`, {
        name: form.name,
        price: parseFloat(form.price),
        cost: parseFloat(form.cost),
        stock: parseInt(form.stock) || 0
      });
      setForm({ name: "", price: "", cost: "", stock: "" });
      fetchItems();
    } catch (err) { console.error("Add failed", err); }
  };

  const handleAction = async (type, id) => {
    try {
      await axios.post(`${API_BASE_URL}/api/products/${type}/${id}`);
      fetchItems();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="main-container vault-page">
      <div className="financial-summary gold-border">
        <div className="summary-item">
          <p className="label">GROSS VALUATION</p>
          <p className="value gold-text">${totalValuation.toLocaleString()}</p>
        </div>
        <div className="summary-item">
          <p className="label">EST. TAX (18%)</p>
          <p className="value color-red">-${estimatedTax.toLocaleString()}</p>
        </div>
        <div className="summary-item">
          <p className="label">NET AFTER TAX</p>
          <p className="value color-green">${netAfterTax.toLocaleString()}</p>
        </div>
        <div className="summary-item">
          <p className="label">PORTFOLIO SIZE</p>
          <p className="value gold-text">{items.length} ASSETS</p>
        </div>
      </div>

      <div className="input-section gold-border">
        <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="ASSET NAME" className="dark-input" />
        <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} placeholder="PRICE" className="dark-input" />
        <input type="number" value={form.cost} onChange={(e) => setForm({...form, cost: e.target.value})} placeholder="COST" className="dark-input" />
        <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} placeholder="UNITS" className="dark-input" />
        <button onClick={addItem} className="gold-btn">SECURE ASSET</button>
      </div>

      <div className="asset-grid">
        {items.map((item) => (
          <div key={item.id} className={`asset-card gold-border ${topPerformer?.id === item.id ? 'top-asset' : ''}`}>
            {topPerformer?.id === item.id && <div className="top-badge">TOP MARGIN</div>}
            <h3 className="gold-text">{item.name}</h3>
            <p className="price-tag">${(item.price || 0).toLocaleString()}</p>
            <p className="cost-tag">COST: ${item.cost || 0}</p>
            <div className="stock-info">
              <span>STOCK: {item.stock}</span>
              <span>SOLD: {item.sold_count || 0}</span>
            </div>
            <div className="card-actions">
              <button onClick={() => handleAction('sell', item.id)} className="action-btn">SELL</button>
              <button onClick={() => handleAction('restock', item.id)} className="action-btn restock">RESTOCK</button>
            </div>
          </div>
        ))}
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
    } catch (err) { setResponse("Intelligence Sync Offline."); }
    setLoading(false);
  };

  return (
    <div className="main-container advisor-page">
      <h2 className="gold-text section-title">CFO INTELLIGENCE</h2>
      <div className="ai-container">
        <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="REQUEST FINANCIAL ANALYSIS..." className="dark-input ai-textarea" />
        <button onClick={askAdvisor} disabled={loading} className="gold-btn full-width">
          {loading ? "PROCESSING DATA..." : "RUN ANALYSIS"}
        </button>
        {response && <div className="ai-report gold-border gold-text fade-in">{response}</div>}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/advisor" element={<Advisor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
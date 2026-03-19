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
        <Link to="/" style={{textDecoration: 'none'}}><div className="logo">QueryFlow <span className="blue-text">Business</span></div></Link>
      </div>
      <div className="nav-links">
        <Link to="/vault" className={`nav-item ${location.pathname === '/vault' ? 'active' : ''}`}>Inventory</Link>
        <Link to="/advisor" className={`nav-item ${location.pathname === '/advisor' ? 'active' : ''}`}>Financial Advisor</Link>
      </div>
    </nav>
  );
};

const LandingPage = () => (
  <div className="landing-wrapper">
    <div className="hero">
      <h1 className="hero-title">Smart Inventory for <span className="blue-text">SMEs</span></h1>
      <p className="hero-subtitle">
        Automate your stock tracking, calculate real-time margins, and get AI-driven financial insights for your growing business.
      </p>
      <div className="hero-actions">
        <Link to="/vault" className="cta-button">Manage Inventory</Link>
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
    if (!form.name || !form.price || !form.cost) return alert("All fields required");
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
    <div className="main-container">
      <div className="stats-grid">
        <div className="stat-card">
          <label>Inventory Value</label>
          <h3>${totalValuation.toLocaleString()}</h3>
        </div>
        <div className="stat-card">
          <label>Est. Tax Liability</label>
          <h3 className="red-text">-${estimatedTax.toLocaleString()}</h3>
        </div>
        <div className="stat-card">
          <label>Projected Net Profit</label>
          <h3 className="green-text">${netAfterTax.toLocaleString()}</h3>
        </div>
        <div className="stat-card">
          <label>SKU Count</label>
          <h3>{items.length}</h3>
        </div>
      </div>

      <div className="biz-input-bar">
        <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Item Name" />
        <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} placeholder="Sale Price" />
        <input type="number" value={form.cost} onChange={(e) => setForm({...form, cost: e.target.value})} placeholder="Cost Price" />
        <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} placeholder="Initial Stock" />
        <button onClick={addItem} className="biz-btn">Add to Stock</button>
      </div>

      <div className="biz-grid">
        {items.map((item) => (
          <div key={item.id} className={`biz-card ${topPerformer?.id === item.id ? 'best-seller' : ''}`}>
            {topPerformer?.id === item.id && <span className="badge">High Margin</span>}
            <h4>{item.name}</h4>
            <div className="biz-card-data">
              <p>Price: <b>${item.price}</b></p>
              <p>Cost: <b>${item.cost}</b></p>
            </div>
            <div className="stock-level">
              Stock: {item.stock} | Sold: {item.sold_count || 0}
            </div>
            <div className="biz-actions">
              <button onClick={() => handleAction('sell', item.id)}>Log Sale</button>
              <button onClick={() => handleAction('restock', item.id)} className="restock-btn">Restock</button>
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
    } catch (err) { setResponse("Advisor currently offline."); }
    setLoading(false);
  };

  return (
    <div className="main-container">
      <h2 className="page-title">Business Intelligence Advisor</h2>
      <div className="advisor-box">
        <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g., Which items should I liquidate? How is my monthly margin?" />
        <button onClick={askAdvisor} disabled={loading} className="biz-btn">
          {loading ? "Analyzing..." : "Get Business Insight"}
        </button>
        {response && <div className="report-box">{response}</div>}
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
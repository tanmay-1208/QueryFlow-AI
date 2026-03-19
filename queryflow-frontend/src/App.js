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
        <Link to="/" style={{textDecoration: 'none'}}>
          <div className="logo-text">QueryFlow <span className="blue-accent">Business</span></div>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/vault" className={`nav-item ${location.pathname === '/vault' ? 'active' : ''}`}>Inventory</Link>
        <Link to="/advisor" className={`nav-item ${location.pathname === '/advisor' ? 'active' : ''}`}>Advisor</Link>
      </div>
    </nav>
  );
};

const LandingPage = () => (
  <div className="landing-wrapper">
    <div className="hero-content">
      <h1 className="hero-title">Inventory for <span className="blue-accent">SMEs</span></h1>
      <p className="hero-subtitle">Professional stock tracking and AI-driven financial insights.</p>
      <Link to="/vault" className="cta-button">Access Dashboard</Link>
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
        name: form.name, price: parseFloat(form.price), cost: parseFloat(form.cost), stock: parseInt(form.stock) || 0
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
    <div className="dashboard-container">
      <div className="stats-header">
        <div className="stat-card">
          <span className="stat-label">Stock Valuation</span>
          <h3 className="stat-value">${totalValuation.toLocaleString()}</h3>
        </div>
        <div className="stat-card">
          <span className="stat-label">Tax (18%)</span>
          <h3 className="stat-value text-red">-${estimatedTax.toLocaleString()}</h3>
        </div>
        <div className="stat-card">
          <span className="stat-label">Net Profit</span>
          <h3 className="stat-value text-green">${netAfterTax.toLocaleString()}</h3>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total SKUs</span>
          <h3 className="stat-value">{items.length}</h3>
        </div>
      </div>

      <div className="inventory-controls">
        <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Item Name" className="biz-input" />
        <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} placeholder="Price" className="biz-input" />
        <input type="number" value={form.cost} onChange={(e) => setForm({...form, cost: e.target.value})} placeholder="Cost" className="biz-input" />
        <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} placeholder="Qty" className="biz-input" />
        <button onClick={addItem} className="add-stock-btn">Add Stock</button>
      </div>

      <div className="inventory-grid">
        {items.map((item) => {
          const unitProfit = item.price - (item.cost || 0);
          const marginPercent = ((unitProfit / (item.price || 1)) * 100).toFixed(1);

          return (
            <div key={item.id} className={`inventory-card ${topPerformer?.id === item.id ? 'highlight-margin' : ''}`}>
              {topPerformer?.id === item.id && <div className="margin-badge">Best Margin</div>}
              
              <h4 className="item-title">{item.name}</h4>
              
              <div className="item-financials">
                <span>Price: <b>${item.price}</b></span>
                <span>Cost: <b>${item.cost}</b></span>
              </div>

              {/* NEW: UNIT ECONOMICS SECTION */}
              <div className="unit-economics">
                <div className="eco-item">
                  <span className="eco-label">Profit / Unit</span>
                  <span className="eco-value text-green">+${unitProfit.toLocaleString()}</span>
                </div>
                <div className="eco-item">
                  <span className="eco-label">Margin %</span>
                  <span className="eco-value">{marginPercent}%</span>
                </div>
              </div>

              <div className="item-meta">Stock: {item.stock} | Sold: {item.sold_count || 0}</div>
              
              <div className="item-actions">
                <button onClick={() => handleAction('sell', item.id)} className="log-sale-btn">Log Sale</button>
                <button onClick={() => handleAction('restock', item.id)} className="restock-btn">Restock</button>
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
    } catch (err) { setResponse("Advisor error."); }
    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      <h2 className="page-header">Business Advisor</h2>
      <div className="advisor-area">
        <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Analyze my business..." className="advisor-textarea" />
        <button onClick={askAdvisor} disabled={loading} className="add-stock-btn full-width">
          {loading ? "Analyzing..." : "Get Analysis"}
        </button>
        {response && <div className="advisor-response fade-in">{response}</div>}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App-wrapper">
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
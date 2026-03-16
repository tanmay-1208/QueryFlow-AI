import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";

const LandingPage = () => (
  <div className="main-container landing">
    <nav className="navbar">
      <div className="logo gold-text">QUERYFLOW AI</div>
      <div className="nav-links">
        <Link to="/vault" className="nav-item">Vault</Link>
        <Link to="/advisor" className="nav-item">CFO Suite</Link>
      </div>
    </nav>
    <header className="hero">
      <h1 className="gold-text header-title">THE VIRTUAL CA</h1>
      <p className="subtitle">Luxury Asset Security & Financial Intelligence.</p>
      <Link to="/vault" className="cta-button gold-bg">Open the Vault</Link>
    </header>
  </div>
);

const Vault = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setItems(res.data);
    } catch (err) { console.error("Sync Error", err); }
  };

  const handleAction = async (type, id) => {
    try {
      await axios.post(`${API_BASE_URL}/api/products/${type}/${id}`);
      fetchItems();
    } catch (err) { console.error(`${type} failed`, err); }
  };

  const addItem = async () => {
    if (!form.name || !form.price || !form.stock) return;
    try {
      await axios.post(`${API_BASE_URL}/api/products`, form);
      setForm({ name: "", price: "", stock: "" });
      fetchItems();
    } catch (err) { console.error("Vault Locked", err); }
  };

  return (
    <div className="main-container vault-page">
      <Link to="/" className="back-link gold-text">← TERMINAL</Link>
      <h2 className="gold-text section-title">ASSET INVENTORY</h2>
      
      <div className="input-section gold-border">
        <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="ASSET NAME" className="dark-input" />
        <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} placeholder="PRICE" className="dark-input" />
        <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} placeholder="STOCK" className="dark-input" />
        <button onClick={addItem} className="gold-btn">SECURE</button>
      </div>

      <div className="asset-grid">
        {items.map((item) => (
          <div key={item.id} className={`asset-card gold-border ${item.stock <= 0 ? 'out-of-stock-card' : ''}`}>
            <h3 className="gold-text">{item.name}</h3>
            <p className="price-tag">VALUATION: ${item.price}</p>
            <p className={item.stock <= 0 ? 'red-text' : 'stock-text'}>
              {item.stock <= 0 ? "⚠️ OUT OF STOCK" : `INVENTORY: ${item.stock}`}
            </p>
            
            <div className="card-actions">
              <button onClick={() => handleAction('sell', item.id)} disabled={item.stock <= 0} className="action-btn">SELL</button>
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
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/chat`, { message: query });
      setResponse(res.data);
    } catch (err) { setResponse("Intelligence sync failed..."); }
    setLoading(false);
  };

  return (
    <div className="main-container advisor-page">
      <Link to="/" className="back-link gold-text">← TERMINAL</Link>
      <h2 className="gold-text section-title">CFO INTELLIGENCE</h2>
      <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="REQUEST ANALYSIS..." className="dark-input ai-textarea" />
      <button onClick={askAdvisor} disabled={loading} className="gold-btn full-width">
        {loading ? "DECRYPTING..." : "RUN ANALYSIS"}
      </button>
      {response && <div className="ai-report gold-border gold-text">{response}</div>}
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
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
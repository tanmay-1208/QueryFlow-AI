import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

// --- PRODUCTION CONFIGURATION ---
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setItems(res.data);
    } catch (err) { console.error("Vault Offline", err); }
  };

  const addItem = async () => {
    if (!name || !description) return;
    try {
      await axios.post(`${API_BASE_URL}/api/products`, { name, description });
      setName(""); setDescription(""); fetchItems();
    } catch (err) { console.error("Security Breach", err); }
  };

  return (
    <div className="main-container vault-page">
      <div className="top-nav">
        <Link to="/" className="back-link gold-text">← TERMINAL</Link>
      </div>
      <h2 className="gold-text section-title">ASSET INVENTORY</h2>
      <div className="input-section gold-border">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ITEM NAME" className="dark-input" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="VALUATION/DETAILS" className="dark-input" />
        <button onClick={addItem} className="gold-btn">SECURE ASSET</button>
      </div>
      <div className="asset-grid">
        {items.map((item) => (
          <div key={item.id} className="asset-card gold-border">
            <h3 className="gold-text">{item.name}</h3>
            <p className="asset-desc">{item.description}</p>
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
      <div className="top-nav">
        <Link to="/" className="back-link gold-text">← TERMINAL</Link>
      </div>
      <h2 className="gold-text section-title">CFO INTELLIGENCE</h2>
      <div className="ai-input-wrapper">
        <textarea 
          value={query} onChange={(e) => setQuery(e.target.value)} 
          placeholder="REQUEST FINANCIAL ANALYSIS..." className="dark-input ai-textarea"
        />
        <button onClick={askAdvisor} disabled={loading} className="gold-btn full-width">
          {loading ? "DECRYPTING..." : "RUN ANALYSIS"}
        </button>
      </div>
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
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

// --- CONFIGURATION ---
const API_BASE_URL = "https://queryflow-ai-tubi.onrender.com";

// --- COMPONENTS ---

const LandingPage = () => (
  <div className="landing-container">
    <nav className="navbar">
      <div className="logo">QueryFlow AI</div>
      <div className="nav-links">
        <Link to="/vault" className="nav-item">Vault</Link>
        <Link to="/advisor" className="nav-item">CFO Suite</Link>
      </div>
    </nav>
    <header className="hero">
      <h1>The Virtual CA for Your Lifestyle</h1>
      <p>Secure your assets. Analyze your growth. Automate your financial legacy.</p>
      <Link to="/vault" className="cta-button">Open Your Vault</Link>
    </header>
  </div>
);

const Vault = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching vault items:", err);
    }
  };

  const addItem = async () => {
    if (!name || !description) return;
    try {
      await axios.post(`${API_BASE_URL}/api/products`, { name, description });
      setName("");
      setDescription("");
      fetchItems();
    } catch (err) {
      console.error("Error securing item:", err);
    }
  };

  return (
    <div className="vault-container">
      <Link to="/" className="back-link">← Back to Terminal</Link>
      <h2>Digital Asset Vault</h2>
      <div className="input-group">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Asset Name (e.g. Rolex)" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Value/Details" />
        <button onClick={addItem}>Secure Asset</button>
      </div>
      <div className="asset-grid">
        {items.map((item) => (
          <div key={item.id} className="asset-card">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
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
    } catch (err) {
      setResponse("Connection lost. Retrying backend...");
    }
    setLoading(false);
  };

  return (
    <div className="advisor-container">
      <Link to="/" className="back-link">← Back to Terminal</Link>
      <h2>AI CFO Suite</h2>
      <textarea 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Ask about your financial status or tax liability..."
      />
      <button onClick={askAdvisor} disabled={loading}>
        {loading ? "Analyzing..." : "Run Intelligence Report"}
      </button>
      {response && <div className="ai-response-box">{response}</div>}
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
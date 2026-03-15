import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';
import './App.css';

// --- PAGE 1: LANDING (Marketing & Info) ---
const LandingPage = () => (
  <div className="page-fade">
    <section className="hero">
      <label className="gold-text">INTRODUCING QUERYFLOW AI</label>
      <h1>The Virtual CFO for <br/>Modern Enterprises.</h1>
      <p>Bridging the gap between raw data and financial intelligence. Manage inventory, track velocity, and audit your wealth in one moody vault.</p>
      <Link to="/login" className="cta-btn">ENTER THE VAULT</Link>
    </section>
  </div>
);

// --- PAGE 2: LOGIN (Auth Gate) ---
const LoginPage = () => (
  <div className="page-fade auth-container">
    <div className="auth-card">
      <label>SECURITY CHECK</label>
      <h2>Authorized Access Only</h2>
      <input type="password" placeholder="ENTER ACCESS KEY" />
      <Link to="/vault" className="cta-btn">AUTHENTICATE</Link>
    </div>
  </div>
);

// --- PAGE 3: VAULT (The Operations Page) ---
const VaultPage = ({ results, loadAll, handleSell, handleRestock, handleDelete, handleFileUpload, newItem, setNewItem, secureItem }) => (
  <div className="page-fade">
    <section className="entry-section">
      <form onSubmit={(e) => { e.preventDefault(); secureItem(newItem).then(loadAll); }} className="add-form">
        <input placeholder="NAME" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
        <input placeholder="PRICE" type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
        <input placeholder="STOCK" type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} />
        <button type="submit">SECURE</button>
        <label htmlFor="csv" className="import-label">CSV</label>
        <input id="csv" type="file" onChange={handleFileUpload} style={{display:'none'}} />
      </form>
    </section>

    <div className="results-grid">
      {results.map((item, idx) => (
        <div key={idx} className="product-card">
          <button className="delete-btn" onClick={() => handleDelete(item.name)}>×</button>
          <div className={`status-badge ${item.stock < 5 ? 'low-stock' : 'in-vault'}`}>
            {item.stock < 5 ? 'REPLENISH' : 'SECURED'}
          </div>
          <h2>{item.name}</h2>
          <p className="price">₹{Number(item.price).toLocaleString('en-IN')}</p>
          <div className="card-footer">
            <span className="stock-count">{item.stock} UNITS | {item.sold_count || 0} SOLD</span>
          </div>
          <div className="card-controls">
            <button className="sell-btn" onClick={() => handleSell(item.name)} disabled={item.stock === 0}>SELL</button>
            <button className="restock-btn" onClick={() => handleRestock(item.name)}>+ STOCK</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- PAGE 4: CFO SUITE (CA Analysis Page) ---
const CFOSuite = ({ results }) => {
  const totalValue = results.reduce((sum, i) => sum + (i.price * i.stock), 0);
  const totalRevenue = results.reduce((sum, i) => sum + (i.price * (i.sold_count || 0)), 0);
  const highValueAsset = [...results].sort((a,b) => (b.price*b.stock) - (a.price*a.stock))[0];

  return (
    <div className="page-fade">
      <div className="cfo-grid">
        <div className="audit-card highlight">
          <label>NET LIQUIDITY</label>
          <h2>₹{totalRevenue.toLocaleString('en-IN')}</h2>
          <p className="note">Total capital recovered via sales.</p>
        </div>
        <div className="audit-card">
          <label>ASSET CONCENTRATION</label>
          <h2>{highValueAsset ? ((highValueAsset.price * highValueAsset.stock / totalValue) * 100).toFixed(1) : 0}%</h2>
          <p className="note">Wealth locked in {highValueAsset?.name || 'N/A'}.</p>
        </div>
        <div className="audit-card">
          <label>HEALTH SCORE</label>
          <h2 style={{color: 'var(--success)'}}>
            {results.length > 0 ? (100 - (results.filter(i => i.stock < 5).length / results.length * 100)).toFixed(0) : 0}%
          </h2>
          <p className="note">Based on stock replenishment efficiency.</p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  const [results, setResults] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', stock: '' });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/ask?query=list all products ordered by id desc`);
      setResults(res.data || []);
    } catch (err) { console.error("Vault offline"); }
  };

  const secureItem = async (item) => {
    await axios.post('http://localhost:8080/api/add', item);
  };

  const handleSell = async (n) => { await axios.post(`http://localhost:8080/api/sell/${n}`); loadAll(); };
  const handleRestock = async (n) => { await axios.post(`http://localhost:8080/api/restock/${n}`); loadAll(); };
  const handleDelete = async (n) => { if(window.confirm('Release?')) { await axios.delete(`http://localhost:8080/api/delete/${n}`); loadAll(); }};

  return (
    <Router>
      <div className="app-container">
        <nav className="main-nav">
          <div className="nav-logo">QUERYFLOW <span className="accent">AI</span></div>
          <div className="nav-links">
            <NavLink to="/">INFO</NavLink>
            <NavLink to="/vault">VAULT</NavLink>
            <NavLink to="/advisor">CFO SUITE</NavLink>
            <NavLink to="/login" className="login-link">ACCESS</NavLink>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/vault" element={<VaultPage results={results} loadAll={loadAll} handleSell={handleSell} handleRestock={handleRestock} handleDelete={handleDelete} newItem={newItem} setNewItem={setNewItem} secureItem={secureItem} />} />
          <Route path="/advisor" element={<CFOSuite results={results} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
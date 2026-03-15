import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', stock: '' });

  // Load all items when the app opens
  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/ask?query=list all products`);
      setResults(res.data);
    } catch (err) { console.error("Could not load vault data."); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/ask?query=${query}`);
      setResults(res.data);
    } catch (err) { alert("AI Query Error. Check Terminal."); }
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return alert("Enter all details.");
    
    try {
      await axios.post('http://localhost:8080/api/add', {
        name: newItem.name,
        price: parseFloat(newItem.price),
        stock: parseInt(newItem.stock || 0)
      });
      setNewItem({ name: '', price: '', stock: '' });
      loadAll(); // Refresh the list
    } catch (err) { alert("Error securing asset. Check ID constraints in Supabase."); }
  };

  const handleDelete = async (name) => {
    if (window.confirm(`Release ${name} from the Vault?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/delete/${name}`);
        loadAll();
      } catch (err) { alert("Failed to release asset."); }
    }
  };

  const totalValue = Array.isArray(results) 
    ? results.reduce((sum, i) => sum + ((i.price || 0) * (i.stock || 0)), 0) 
    : 0;

  return (
    <div className="app-container">
      <header className="vault-header">
        <h1>QUERYFLOW <span className="accent">AI</span></h1>
        <p className="subtitle">EXECUTIVE INVENTORY MANAGEMENT</p>
      </header>

      {/* NEW ASSET ENTRY SECTION */}
      <section className="entry-section">
        <form onSubmit={handleAdd} className="add-form">
          <input placeholder="ASSET NAME" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
          <input placeholder="PRICE" type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
          <input placeholder="STOCK" type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} />
          <button type="submit">SECURE ASSET</button>
        </form>
      </section>

      <div className="stats-bar">
        <div className="stat-card">
          <label>Entries</label>
          <h3>{results.length}</h3>
        </div>
        <div className="stat-card">
          <label>Valuation</label>
          <h3>₹{totalValue.toLocaleString('en-IN')}</h3>
        </div>
      </div>

      <form onSubmit={handleSearch} className="search-box">
        <input 
          placeholder="Ask the AI about your inventory..." 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
        />
        <button type="submit">{loading ? '...' : 'QUERY'}</button>
      </form>

      <div className="results-grid">
        {results.map((item, index) => (
          <div key={index} className="product-card">
            <button className="delete-btn" onClick={() => handleDelete(item.name)}>×</button>
            <div className="card-header"><span className="stock-tag">{item.stock || 0} IN STOCK</span></div>
            <h2>{item.name || "UNNAMED"}</h2>
            <p className="price">₹{Number(item.price || 0).toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
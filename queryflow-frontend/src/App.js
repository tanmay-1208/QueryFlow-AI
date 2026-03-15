import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', stock: '' });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/ask?query=list all products`);
      setResults(res.data);
    } catch (err) { console.error("Vault offline"); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/ask?query=${query}`);
      setResults(res.data);
    } catch (err) { alert("AI processing error"); }
    setLoading(false);
  };

  // Logic for Individual Form Add
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    await secureItem(newItem);
    setNewItem({ name: '', price: '', stock: '' });
    loadAll();
  };

  // reusable function for adding to DB
  const secureItem = async (item) => {
    try {
      await axios.post('http://localhost:8080/api/add', {
        name: item.name,
        price: parseFloat(item.price),
        stock: parseInt(item.stock || 0)
      });
    } catch (err) { console.error("Failed to secure:", item.name); }
  };

  // --- NEW: SPREADSHEET IMPORT LOGIC ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        // Process each row sequentially to avoid DB locking
        for (const row of rows) {
          const mappedItem = {
            name: row.name || row.Name || row.item,
            price: row.price || row.Price || 0,
            stock: row.stock || row.Stock || 0
          };
          if (mappedItem.name) await secureItem(mappedItem);
        }
        setLoading(false);
        alert(`Vault Updated: ${rows.length} assets imported.`);
        loadAll();
      }
    });
  };

  const handleDelete = async (name) => {
    if (window.confirm(`Release ${name}?`)) {
      await axios.delete(`http://localhost:8080/api/delete/${name}`);
      loadAll();
    }
  };

  const totalValue = results.reduce((sum, i) => sum + ((i.price || 0) * (i.stock || 0)), 0);

  return (
    <div className="app-container">
      <header className="vault-header">
        <h1>QUERYFLOW <span className="accent">AI</span></h1>
        <p className="subtitle">EXECUTIVE INVENTORY MANAGEMENT</p>
      </header>

      <section className="entry-section">
        <form onSubmit={handleAdd} className="add-form">
          <input placeholder="ASSET NAME" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
          <input placeholder="PRICE" type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
          <input placeholder="STOCK" type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} />
          <button type="submit">SECURE ASSET</button>
          
          <div className="import-wrapper">
            <label htmlFor="csv-upload" className="import-label">IMPORT CSV</label>
            <input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
          </div>
        </form>
      </section>

      <div className="stats-bar">
        <div className="stat-card"><h3>{results.length}</h3><label>ENTRIES</label></div>
        <div className="stat-card"><h3>₹{totalValue.toLocaleString('en-IN')}</h3><label>VALUATION</label></div>
      </div>

      <form onSubmit={handleSearch} className="search-box">
        <input placeholder="Search via AI..." value={query} onChange={e => setQuery(e.target.value)} />
        <button type="submit">{loading ? '...' : 'QUERY'}</button>
      </form>

      <div className="results-grid">
        {results.map((item, index) => (
          <div key={index} className="product-card">
            <button className="delete-btn" onClick={() => handleDelete(item.name)}>×</button>
            <div className="card-header"><span className="stock-tag">{item.stock} IN STOCK</span></div>
            <h2>{item.name}</h2>
            <p className="price">₹{Number(item.price).toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
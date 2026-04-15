import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import InventoryContainer from "../components/InventoryContainer";
import AddAssetModal from "../components/AddAssetModal";
import CreateVaultModal from "../components/CreateVaultModal";
import TeamModal from "../components/TeamModal";
import InvoiceModal from "../components/InvoiceModal";
import CSVImportModal from "../components/CSVImportModal";
import SkeletonCard from "../components/SkeletonCard";
import SkeletonDashboard from "../components/SkeletonDashboard";
import OnboardingModal from "../components/OnboardingModal";
import { FadeIn, StaggerContainer, StaggerItem } from "../components/AnimatedPage";
import { exportVaultReport } from "../utils/exportPDF";

const API_BASE_URL = "https://tanmaysingh12r-queryflow-ai.hf.space";

const Vault = ({ userId, userEmail, onLogout }) => {
  const [items, setItems] = useState([]);
  const [sellHistory, setSellHistory] = useState([]);
  const [vaults, setVaults] = useState([]);
  const [activeVault, setActiveVault] = useState(null);
  const [isVaultDropdownOpen, setIsVaultDropdownOpen] = useState(false);
  const [isCreateVaultOpen, setIsCreateVaultOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [invoiceSale, setInvoiceSale] = useState(null);
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loadingVaults, setLoadingVaults] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [chatLog, setChatLog] = useState([
    { role: "agent", text: "[SYSTEM]: Neural link stable. QueryFlow Agent v5.0 initialized. Ready for audit." }
  ]);

  // --- DATA SYNC ---
  const fetchVaults = useCallback(async () => {
    if (!userId) return;
    setLoadingVaults(true);
    try {
      const ownRes = await axios.get(`${API_BASE_URL}/api/vaults?userId=${userId}`);
      const ownVaults = Array.isArray(ownRes.data) ? ownRes.data : [];

      const sharedRes = await axios.get(`${API_BASE_URL}/api/team/my-vaults?userId=${userId}`);
      const sharedIds = Array.isArray(sharedRes.data) ? sharedRes.data : [];

      const sharedVaults = await Promise.all(
        sharedIds.map(id =>
          axios.get(`${API_BASE_URL}/api/vaults/${id}`)
            .then(r => r.data)
            .catch(() => null)
        )
      );

      const allVaults = [...ownVaults, ...sharedVaults.filter(Boolean)];
      const unique = allVaults.filter((v, i, self) =>
        self.findIndex(x => x.id === v.id) === i
      );

      setVaults(unique);

      if (unique.length > 0 && !activeVault) {
        setActiveVault(unique[0]);
      }

      // Show onboarding for new users
      const isOnboarded = localStorage.getItem(`onboarded_${userId}`);
      if (unique.length === 0 && !isOnboarded) {
        setShowOnboarding(true);
      }

    } catch (err) {
      console.error("Vault fetch error:", err);
    } finally {
      setLoadingVaults(false);
    }
  }, [userId]);

  const fetchItems = useCallback(async () => {
    if (!userId || !activeVault) return;
    setLoadingItems(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?vaultId=${activeVault.id}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Vault Retrieval Error:", err);
    } finally {
      setLoadingItems(false);
    }
  }, [userId, activeVault]);

  const fetchSellHistory = useCallback(async () => {
    if (!userId || !activeVault) return;
    setLoadingDashboard(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/sell?userId=${userId}&vaultId=${activeVault.id}`);
      setSellHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Sell History Error:", err);
    } finally {
      setLoadingDashboard(false);
    }
  }, [userId, activeVault]);

  useEffect(() => {
    fetchVaults();
  }, [fetchVaults]);

  useEffect(() => {
    if (activeVault) {
      fetchItems();
      fetchSellHistory();
    }
  }, [activeVault, fetchItems, fetchSellHistory]);

  // --- HANDLERS ---
  const handleOnAdd = (newAsset) => {
    setItems((prev) => [newAsset, ...prev]);
  };

  const handleDeleteAsset = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const handleUpdateStock = async (id, change) => {
    try {
      const item = items.find(i => i.id === id);
      if (!item) return;
      const newStock = (item.stock || 0) + change;
      if (newStock < 0) return;
      const updated = { ...item, stock: newStock };
      await axios.put(`${API_BASE_URL}/api/products/${id}`, updated);
      setItems(prev => prev.map(i => i.id === id ? updated : i));
    } catch (err) {
      console.error("Stock Update Error:", err);
    }
  };

  const handleEditAsset = (updatedItem) => {
    const normalized = {
      ...updatedItem,
      costPrice: updatedItem.costPrice || updatedItem.cost_price || 0,
      cost_price: updatedItem.costPrice || updatedItem.cost_price || 0
    };
    setItems(prev => prev.map(i =>
      String(i.id) === String(normalized.id) ? normalized : i
    ));
  };

  const handleSellComplete = (sellRecord) => {
    setSellHistory(prev => [sellRecord, ...prev]);
    fetchItems();
  };

  const handleExportPDF = () => {
    exportVaultReport({
      items,
      sellHistory,
      grossVal,
      net,
      tax,
      costVal,
      userId
    });
  };

  // --- AI LOGIC ---
  const handleAiSubmit = async (e) => {
    if (e.key === "Enter" && aiQuery.trim() !== "") {
      const userMessage = aiQuery.trim();
      setAiQuery("");
      setChatLog(prev => [...prev, { role: "user", text: userMessage }]);
      try {
        let currentItems = items;
        if (activeVault) {
          const resProducts = await axios.get(`${API_BASE_URL}/api/products?vaultId=${activeVault.id}`);
          currentItems = Array.isArray(resProducts.data) ? resProducts.data : [];
        }

        const validatedItems = currentItems.map(item => ({
          productName: item.name,
          costPrice: Number(item.costPrice || item.cost_price || 0),
          priceGroups: {
            retail: item.priceGroups?.RETAIL ? Number(item.priceGroups.RETAIL) : Number(item.price || 0),
            dealer: item.priceGroups?.DEALER ? Number(item.priceGroups.DEALER) : 0,
            wholesale: item.priceGroups?.WHOLESALE ? Number(item.priceGroups.WHOLESALE) : 0
          },
          stock: Number(item.stock || 0)
        }));

        const res = await axios.post(`${API_BASE_URL}/api/chat`, {
          message: userMessage,
          items: validatedItems
        });
        setChatLog(prev => [...prev, { role: "agent", text: res.data }]);
      } catch (err) {
        console.error("AI Sync Error:", err);
        setChatLog(prev => [...prev, { role: "agent", text: "[ERR]: Connection to Groq Core timed out. Verify API Key." }]);
      }
    }
  };

  // --- CALCULATIONS ---
  const safeVal = (v) => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));
  const grossVal = items.reduce((acc, i) => acc + safeVal(i.price) * safeVal(i.stock), 0);
  const costVal = items.reduce((acc, i) => acc + safeVal(i.costPrice || i.cost_price) * safeVal(i.stock), 0);
  const totalStock = items.reduce((acc, i) => acc + safeVal(i.stock), 0);
  const tax = grossVal * 0.18;
  const net = grossVal - costVal - tax;
  const topFive = [...items].sort((a, b) => (b.price * b.stock) - (a.price * a.stock)).slice(0, 5);

  // --- GRAPH DATA ---
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const dayData = days.map(day => {
    const label = day.toLocaleDateString('en-IN', { weekday: 'short' });
    const profit = sellHistory
      .filter(s => new Date(s.soldAt).toDateString() === day.toDateString())
      .reduce((acc, s) => acc + (s.profit || 0), 0);
    return { label, profit };
  });

  const maxDayProfit = Math.max(...dayData.map(d => d.profit), 1);

  const itemProfits = {};
  sellHistory.forEach(s => {
    if (!itemProfits[s.productName]) itemProfits[s.productName] = 0;
    itemProfits[s.productName] += s.profit || 0;
  });
  const sortedItemProfits = Object.entries(itemProfits)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxItemProfit = Math.max(...sortedItemProfits.map(s => s[1]), 1);

  return (
    <div className="flex h-[100dvh] w-full bg-[#080A0F] font-dm overflow-hidden text-white relative">
      {/* 1. SIDEBAR */}
      <aside className={`w-64 border-l-2 border-l-[#C9A84C] border-r border-[#C9A84C]/15 p-8 flex flex-col justify-between bg-gradient-to-r from-[#080A0F] to-[#0A0D12] backdrop-blur-xl shrink-0 z-50 absolute md:static top-0 bottom-0 transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <button className="md:hidden absolute top-4 right-4 text-white/50 text-xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
        <div>

          {/* VAULT SWITCHER */}
          <div className="mb-12 relative">
            {loadingVaults ? (
              <div className="h-8 bg-white/5 rounded-xl animate-pulse" />
            ) : (
              <>
                <button
                  onClick={() => setIsVaultDropdownOpen(!isVaultDropdownOpen)}
                  className="w-full flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#C9A84C] rounded-full shadow-[0_0_10px_#C9A84C]" />
                    <span className="font-syne font-bold text-sm tracking-widest uppercase text-[#C9A84C] truncate">
                      {activeVault?.name || "Vault.v5"}
                    </span>
                  </div>
                  <span className="text-white/30 text-xs">▾</span>
                </button>

                {isVaultDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl">
                    {vaults.map(vault => (
                      <button
                        key={vault.id}
                        onClick={() => {
                          setActiveVault(vault);
                          setIsMobileMenuOpen(false);
                          setIsMobileMenuOpen(false);
                          setIsVaultDropdownOpen(false);
                          setItems([]);
                          setSellHistory([]);
                        }}
                        className={`w-full text-left px-4 py-3 text-[14px] md:text-[9px] font-black uppercase tracking-widest transition-all ${
                          activeVault?.id === vault.id
                            ? 'bg-[#C9A84C]/10 text-[#C9A84C]'
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {vault.name}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setIsVaultDropdownOpen(false);
                        setIsCreateVaultOpen(true);
                      }}
                      className="w-full text-left px-4 py-3 text-[14px] md:text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-[#C9A84C] border-t border-white/5 transition-all"
                    >
                      + New Vault
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <nav className="space-y-3">
            {["dashboard", "inventory"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setIsMobileMenuOpen(false); }}
                className={`group relative w-full text-left p-4 pr-0 rounded-xl text-[14px] md:text-[10px] font-bold uppercase tracking-[0.3em] font-syne transition-all duration-200 hover:translate-x-2 ${
                  activeTab === tab ? "text-[#C9A84C]" : "text-white/20 hover:text-[#C9A84C]/80"
                }`}
              >
                {activeTab === tab && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />}
                <span className={activeTab === tab ? "ml-4" : "ml-2 group-hover:ml-4 transition-all"}>{tab}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={() => { setIsAiOpen(true); setIsMobileMenuOpen(false); }}
            className="mt-10 w-full flex items-center gap-3 p-4 rounded-xl border border-[#C9A84C]/20 bg-[#4182ff]/5 text-[#C9A84C] text-[14px] md:text-[9px] font-black uppercase tracking-widest hover:bg-[#C9A84C]/10 transition-all"
          >
            <span className={`${isAiOpen ? 'text-[#2ECC8A]' : 'animate-pulse text-[#C9A84C]'}`}>●</span> Agent_Interface
          </button>

          <button
            onClick={() => { setIsTeamOpen(true); setIsMobileMenuOpen(false); }}
            className="mt-3 w-full flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 text-white/40 text-[14px] md:text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
          >
            <span className="text-white/20">●</span> Team_Access
          </button>
        </div>

        <button onClick={onLogout} className="text-red-900/40 text-[14px] md:text-[9px] font-bold uppercase hover:text-[#E05555] transition-colors tracking-widest">
          [ Terminate ]
        </button>
      </aside>

      {/* 2. MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#080A0F] relative transition-all duration-500 ease-in-out">
        <header className="h-auto min-h-[6rem] py-4 border-b border-white/5 flex flex-col md:flex-row justify-between md:items-center px-4 md:px-12 shrink-0 gap-4 md:gap-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-white/50 hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
              ☰
            </button>
            <h2 className="text-[14px] md:text-[10px] break-all font-bold uppercase tracking-[0.3em] text-[#C9A84C] font-syne">
              Terminal / <span className="text-white/50 px-1">{activeVault?.name || "Vault"}</span> / <span className="text-white px-1">{activeTab}</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap sm:gap-6 w-full md:w-auto">
            <div className="text-right">
              <p className="text-[14px] md:text-[8px] text-[#C9A84C]/50 uppercase font-bold tracking-widest font-syne">Node_Status</p>
              <p className="flex items-center justify-end gap-2 text-[14px] md:text-[10px] text-[#2ECC8A] font-dm">
                <span className="w-2 h-2 rounded-full bg-[#2ECC8A] animate-pulse"></span>
                0x{userId?.slice(0, 8)}
              </p>
            </div>

            {activeTab === "dashboard" && (
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 bg-transparent border border-[#C9A84C]/30 px-4 py-2 rounded-xl text-[14px] md:text-[9px] font-bold uppercase tracking-widest text-[#C9A84C] hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all duration-200 hover:-translate-y-[2px]"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Export PDF
              </button>
            )}

            {activeTab === "inventory" && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCSVImportOpen(true)}
                  className="flex items-center gap-2 bg-transparent border border-[#C9A84C]/30 px-4 py-2 rounded-xl text-[14px] md:text-[9px] font-bold uppercase tracking-widest text-[#C9A84C] hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all duration-200 hover:-translate-y-[2px]"
                >
                  CSV Import
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-[#4182ff] w-12 h-12 rounded-full shadow-[0_0_20px_#4182ff66] hover:scale-105 active:scale-95 transition-all text-xl font-bold"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </header>

        {/* NO VAULT STATE */}
        {!loadingVaults && !activeVault ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <p className="text-white/20 text-[14px] md:text-[10px] uppercase font-black tracking-widest">No Vault Found</p>
            <button
              onClick={() => setIsCreateVaultOpen(true)}
              className="bg-[#4182ff] px-8 py-4 rounded-2xl font-black uppercase text-[14px] md:text-[10px] tracking-widest text-white hover:brightness-110 transition-all"
            >
              Create Your First Vault
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 space-y-6 md:space-y-10 custom-scrollbar">
            {activeTab === "dashboard" ? (
              loadingDashboard ? (
                <SkeletonDashboard />
              ) : (
                <FadeIn>
                  <div className="space-y-10">

                    {/* TOP METRICS */}
                    <StaggerContainer>
                      <div className="grid grid-cols-4 gap-6">
                        {[
                          { label: "Gross Valuation", value: `Rs.${grossVal.toLocaleString("en-IN")}`, accent: "#4182ff" },
                          { label: "Net Efficiency", value: `Rs.${net.toLocaleString("en-IN")}`, accent: "#00ff88" },
                          { label: "Tax Provision", value: `-Rs.${tax.toLocaleString("en-IN")}`, accent: "#ff3366" },
                          { label: "Units Held", value: totalStock.toLocaleString(), accent: "#ffffff" }
                        ].map((card, i) => (
                          <StaggerItem key={i}>
                            <GlassCard label={card.label} value={card.value} accent={card.accent} />
                          </StaggerItem>
                        ))}
                      </div>
                    </StaggerContainer>

                    {/* PERFORMANCE GRAPH */}
                    <div className="glass-panel p-6 md:p-10">
                      <p className="text-[14px] md:text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-8">Performance_Report_Live</p>
                      <div className="grid grid-cols-2 gap-6 md:p-10">
                        <div>
                          <p className="text-[14px] md:text-[8px] text-white/20 uppercase font-black mb-6 tracking-widest">Daily Profit — Last 7 Days</p>
                          <div className="flex items-end gap-2 h-40">
                            {dayData.map((d, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-[14px] md:text-[7px] text-white/30 font-black">
                                  {d.profit > 0 ? `Rs.${d.profit.toFixed(0)}` : ''}
                                </span>
                                <div
                                  className="w-full rounded-t-sm bg-gradient-to-t from-[#4182ff]/20 to-[#4182ff] transition-all"
                                  style={{
                                    height: `${Math.max((d.profit / maxDayProfit) * 100, d.profit > 0 ? 5 : 2)}%`,
                                    opacity: d.profit > 0 ? 1 : 0.1
                                  }}
                                />
                                <span className="text-[14px] md:text-[7px] text-white/30 font-black uppercase">{d.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-[14px] md:text-[8px] text-white/20 uppercase font-black mb-6 tracking-widest">Profit Per Item</p>
                          {sortedItemProfits.length === 0 ? (
                            <div className="flex items-center justify-center h-40">
                              <p className="text-white/10 text-[14px] md:text-[9px] uppercase font-black">No sales data yet</p>
                            </div>
                          ) : (
                            <div className="space-y-4 flex flex-col justify-center h-40">
                              {sortedItemProfits.map(([name, profit], i) => (
                                <div key={i} className="flex items-center gap-3">
                                  <span className="text-[14px] md:text-[8px] text-white/40 font-black uppercase w-16 truncate shrink-0">{name}</span>
                                  <div className="flex-1 bg-white/5 rounded-full h-2">
                                    <div
                                      className="h-2 rounded-full bg-gradient-to-r from-[#4182ff] to-[#00ff88] transition-all"
                                      style={{ width: `${(profit / maxItemProfit) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-[14px] md:text-[8px] text-[#2ECC8A] font-black w-14 text-right shrink-0">
                                    Rs.{profit.toFixed(0)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM DATA */}
                    <div className="grid grid-cols-2 gap-8">
                      <div className="glass-panel p-6 md:p-10">
                        <p className="text-[14px] md:text-[10px] font-bold text-white/30 uppercase mb-8 tracking-widest">Top_Holdings</p>
                        <div className="space-y-6">
                          {topFive.map((item, i) => (
                            <div key={i} className="flex justify-between items-center group">
                              <span className="text-[14px] md:text-[11px] font-bold uppercase text-white/70 group-hover:text-white transition-colors">{item.name}</span>
                              <div className="flex-1 mx-4 border-b border-white/5 border-dashed" />
                              <span className="text-[14px] md:text-[11px] font-bold text-[#C9A84C]">Rs.{(item.price * item.stock).toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="glass-panel p-6 md:p-10 font-mono text-[14px] md:text-[9px] text-white/20 space-y-2">
                        <p className="text-white/40 mb-6 font-bold uppercase tracking-widest">[ System_Logs ]</p>
                        <p className="text-[#2ECC8A]">{">"} Handshake: Session_Active</p>
                        <p>{">"} Vault: {activeVault?.name}</p>
                        <p>{">"} DB Sync: {items.length} assets integrated</p>
                        <p className="text-[#ff3366] animate-pulse">{">"} Real-time Valuation Engine: Active</p>
                      </div>
                    </div>

                    {/* SELL HISTORY */}
                    <div className="glass-panel p-6 md:p-10 pb-10">
                      <p className="text-[14px] md:text-[10px] font-bold text-white/30 uppercase mb-8 tracking-widest">Recent_Sales</p>
                      {sellHistory.length === 0 ? (
                        <p className="text-white/20 text-[14px] md:text-[9px] uppercase font-black text-center py-6">No sales recorded yet</p>
                      ) : (
                        <div className="space-y-4">
                          {sellHistory.slice(0, 10).map((sale, i) => (
                            <div key={i} className="flex justify-between items-center group border-b border-white/5 pb-4">
                              <div>
                                <p className="text-[14px] md:text-[11px] font-black uppercase text-white/70 group-hover:text-white transition-colors">
                                  {sale.productName}
                                </p>
                                <p className="text-[14px] md:text-[8px] text-white/20 uppercase font-black mt-1">
                                  {sale.quantity} units • {new Date(sale.soldAt).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className={`text-[14px] md:text-[11px] font-black ${sale.profit >= 0 ? 'text-[#2ECC8A]' : 'text-[#E05555]'}`}>
                                    +Rs.{sale.profit?.toFixed(2)}
                                  </p>
                                  <p className="text-[14px] md:text-[8px] text-white/20 uppercase font-black mt-1">profit</p>
                                </div>
                                <button
                                  onClick={() => { setInvoiceSale(sale); setIsInvoiceOpen(true); }}
                                  className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-[14px] md:text-[8px] font-black uppercase text-white/30 hover:text-white hover:border-white/20 transition-all"
                                >
                                  Invoice
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </FadeIn>
              )
            ) : (
              <FadeIn>
                <div className="space-y-6">
                  <div className="flex gap-3 flex-wrap">
                    {["All", ...new Set(items.map(i => i.category).filter(Boolean))].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-[14px] md:text-[9px] font-black uppercase tracking-widest transition-all ${
                          selectedCategory === cat
                            ? 'bg-[#4182ff] text-white'
                            : 'bg-white/5 text-white/30 hover:text-white border border-white/5'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {loadingItems ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={i} />
                      ))}
                    </div>
                  ) : (
                    <InventoryContainer
                      items={selectedCategory === "All" ? items : items.filter(i => i.category === selectedCategory)}
                      userId={userId}
                      onDeleteAsset={handleDeleteAsset}
                      onUpdateStock={handleUpdateStock}
                      onEditAsset={handleEditAsset}
                      onSellComplete={handleSellComplete}
                    />
                  )}
                </div>
              </FadeIn>
            )}
          </div>
        )}
      </main>

      {/* 3. AI AGENT DRAWER */}
      <div
        className={`h-full bg-[#080808] border-l border-white/10 transition-transform duration-500 ease-in-out shrink-0 absolute md:relative right-0 flex flex-col z-[100] ${
          isAiOpen ? 'w-full sm:w-[450px] translate-x-0 opacity-100 border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] md:shadow-none' : 'w-[450px] translate-x-full md:translate-x-0 md:w-0 opacity-0 border-none'
        }`}
      >
        <div className="w-full sm:w-[450px] p-6 sm:p-6 md:p-10 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-[#C9A84C] font-syne font-bold text-sm uppercase tracking-[0.2em]">QueryFlow_Agent</h3>
              <p className="text-[14px] md:text-[8px] text-[#C9A84C]/50 uppercase font-dm mt-1 tracking-widest">Autonomous_CA_Unit_v5.0</p>
            </div>
            <button onClick={() => setIsAiOpen(false)} className="text-[#C9A84C]/50 hover:text-[#C9A84C] text-[14px] md:text-[10px] font-bold border border-[#C9A84C]/20 hover:bg-[#C9A84C]/10 px-3 py-2 min-h-[44px] md:min-h-0 rounded-md transition-all uppercase">Close</button>
          </div>

          <div className="flex-1 font-mono text-[14px] md:text-[10px] leading-relaxed bg-black/60 p-6 rounded-3xl border border-white/5 overflow-y-auto custom-scrollbar shadow-inner space-y-4">
            {chatLog.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-500`}>
                <span className={`text-[10px] font-syne uppercase tracking-widest mb-1 ${msg.role === 'user' ? 'text-[#C9A84C]' : 'text-[#4A9EFF]'}`}>
                  {msg.role === 'user' ? 'Operator' : 'Agent'}
                </span>
                <div className={`p-4 rounded-xl inline-block prose prose-invert prose-sm max-w-[85%] [&_p]:whitespace-pre-wrap font-dm ${msg.role === 'user' ? 'bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C]' : 'bg-[#080A0F] border border-white/5 text-white/80'}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 relative flex items-center">
            <input
              className="w-full bg-transparent border-0 border-b border-[#C9A84C]/30 p-4 pb-2 text-[14px] md:text-[11px] text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all pr-12 font-dm placeholder:text-[#C9A84C]/30"
              placeholder="Enter directive..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={handleAiSubmit}
            />
            <button
               onClick={() => handleAiSubmit({key: "Enter"})}
               className="absolute right-2 text-[#C9A84C]/50 hover:text-[#C9A84C] material-symbols-outlined transition-all hover:scale-110"
            >
              send
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleOnAdd}
        userId={userId}
        vaultId={activeVault?.id}
      />

      <CreateVaultModal
        isOpen={isCreateVaultOpen}
        onClose={() => setIsCreateVaultOpen(false)}
        onCreated={(newVault) => {
          setVaults(prev => [...prev, newVault]);
          setActiveVault(newVault);
        }}
        userId={userId}
        vaultCount={vaults.length}
      />

      <TeamModal
        isOpen={isTeamOpen}
        onClose={() => setIsTeamOpen(false)}
        activeVault={activeVault}
        userId={userId}
        userEmail={userEmail}
      />

      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => { setIsInvoiceOpen(false); setInvoiceSale(null); }}
        sale={invoiceSale}
        userId={userId}
      />

      <CSVImportModal
        isOpen={isCSVImportOpen}
        onClose={() => setIsCSVImportOpen(false)}
        onImportComplete={() => {
          fetchItems();
          setIsCSVImportOpen(false);
        }}
        userId={userId}
        vaultId={activeVault?.id}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        userId={userId}
        userEmail={userEmail}
        onComplete={(newVault) => {
          setShowOnboarding(false);
          if (newVault) {
            setVaults([newVault]);
            setActiveVault(newVault);
          }
          fetchVaults();
        }}
      />
    </div>
  );
};

const GlassCard = ({ label, value, accent }) => (
  <div className="bg-[#0D1117] border-l-2 border-white/5 p-8 group hover:-translate-y-[2px] hover:shadow-[0_4px_20px_rgba(201,168,76,0.1)] transition-all duration-300 relative overflow-hidden" style={{ borderLeftColor: accent }}>
    <p className="text-[14px] md:text-[10px] font-syne font-bold text-white/50 uppercase tracking-[0.2em] mb-3">{label}</p>
    <p className="text-2xl font-dm text-white truncate drop-shadow-md group-hover:drop-shadow-[0_0_8px_rgba(201,168,76,0.5)] transition-all" style={{ color: value.includes('-') ? '#E05555' : undefined }}>
      {value}
    </p>
  </div>
);

export default Vault;
import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const STEPS = ["welcome", "vault", "item", "done"];

const OnboardingModal = ({ isOpen, userId, userEmail, onComplete }) => {
  const [step, setStep] = useState(0);
  const [vaultName, setVaultName] = useState("");
  const [itemForm, setItemForm] = useState({ name: "", price: "", cost_price: "", stock: "" });
  const [createdVault, setCreatedVault] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleCreateVault = async () => {
    if (!vaultName.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/vaults`, {
        userId,
        name: vaultName,
        description: "My first vault"
      });
      setCreatedVault(res.data);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create vault.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!itemForm.name || !itemForm.price || !itemForm.stock) return;
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/api/products`, {
        name: itemForm.name,
        price: parseFloat(itemForm.price) || 0,
        cost_price: parseFloat(itemForm.cost_price) || 0,
        stock: parseInt(itemForm.stock) || 0,
        userId,
        vaultId: createdVault?.id
      });
      setStep(3);
    } catch (err) {
      setError("Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkipItem = () => setStep(3);

  const handleDone = () => {
    localStorage.setItem(`onboarded_${userId}`, "true");
    onComplete(createdVault);
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[200] p-6">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden">

        {/* PROGRESS BAR */}
        <div className="w-full h-1 bg-white/5">
          <div
            className="h-1 bg-gradient-to-r from-[#4182ff] to-[#00ff88] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-12">

          {/* STEP INDICATORS */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-500 ${
                  i === step
                    ? 'w-6 h-2 bg-[#4182ff]'
                    : i < step
                      ? 'w-2 h-2 bg-[#00ff88]'
                      : 'w-2 h-2 bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* STEP 0 — WELCOME */}
          {step === 0 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-[#4182ff]/10 border border-[#4182ff]/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <span className="text-[#4182ff] text-2xl font-black italic">V</span>
              </div>
              <h2 className="text-white font-black text-xl uppercase tracking-widest italic">
                Welcome to Vault
              </h2>
              <p className="text-white/30 text-[10px] uppercase tracking-widest leading-relaxed">
                Your AI-powered inventory and financial command center. Let's get you set up in 2 minutes.
              </p>
              <div className="grid grid-cols-3 gap-4 py-4">
                {[
                  { icon: "📦", label: "Track Inventory" },
                  { icon: "💰", label: "Monitor Profits" },
                  { icon: "🤖", label: "AI Advisor" }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                    <p className="text-2xl mb-2">{item.icon}</p>
                    <p className="text-[8px] text-white/30 uppercase font-black tracking-widest">{item.label}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                className="w-full bg-[#4182ff] p-4 rounded-2xl font-black uppercase text-[10px] text-white tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(65,130,255,0.3)]"
              >
                Get Started →
              </button>
              <p className="text-white/10 text-[8px] uppercase font-black">
                Signed in as {userEmail}
              </p>
            </div>
          )}

          {/* STEP 1 — CREATE VAULT */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <p className="text-white/20 text-[9px] uppercase font-black tracking-widest mb-2">Step 1 of 3</p>
                <h2 className="text-white font-black text-lg uppercase tracking-widest">Name Your Vault</h2>
                <p className="text-white/20 text-[9px] uppercase tracking-widest mt-2">
                  A vault is like a workspace for your business
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <p className="text-red-400 text-[9px] font-black uppercase text-center">{error}</p>
                </div>
              )}

              <input
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#4182ff] transition-all text-[11px] font-bold uppercase text-center tracking-widest"
                placeholder="e.g. My Electronics Store"
                value={vaultName}
                onChange={e => setVaultName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCreateVault()}
                autoFocus
              />

              <div className="flex gap-3 flex-wrap justify-center">
                {["My Store", "Electronics Shop", "Clothing Boutique", "Hardware Store"].map(name => (
                  <button
                    key={name}
                    onClick={() => setVaultName(name)}
                    className="bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-[8px] font-black uppercase text-white/30 hover:text-white hover:border-white/20 transition-all"
                  >
                    {name}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCreateVault}
                disabled={loading || !vaultName.trim()}
                className="w-full bg-[#4182ff] p-4 rounded-2xl font-black uppercase text-[10px] text-white tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Vault →"}
              </button>
            </div>
          )}

          {/* STEP 2 — ADD FIRST ITEM */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center mb-6">
                <p className="text-white/20 text-[9px] uppercase font-black tracking-widest mb-2">Step 2 of 3</p>
                <h2 className="text-white font-black text-lg uppercase tracking-widest">Add Your First Item</h2>
                <p className="text-white/20 text-[9px] uppercase tracking-widest mt-2">
                  Add one product to get started
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <p className="text-red-400 text-[9px] font-black uppercase text-center">{error}</p>
                </div>
              )}

              <input
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold uppercase"
                placeholder="Item Name *"
                value={itemForm.name}
                onChange={e => setItemForm({ ...itemForm, name: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold"
                  placeholder="Buy Price (Rs.)"
                  type="number"
                  value={itemForm.cost_price}
                  onChange={e => setItemForm({ ...itemForm, cost_price: e.target.value })}
                />
                <input
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold"
                  placeholder="Sell Price (Rs.) *"
                  type="number"
                  value={itemForm.price}
                  onChange={e => setItemForm({ ...itemForm, price: e.target.value })}
                />
              </div>

              <input
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold"
                placeholder="Stock Quantity *"
                type="number"
                value={itemForm.stock}
                onChange={e => setItemForm({ ...itemForm, stock: e.target.value })}
              />

              <button
                onClick={handleAddItem}
                disabled={loading || !itemForm.name || !itemForm.price || !itemForm.stock}
                className="w-full bg-[#4182ff] p-4 rounded-2xl font-black uppercase text-[10px] text-white tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Item →"}
              </button>

              <button
                onClick={handleSkipItem}
                className="w-full text-white/20 text-[9px] font-black uppercase tracking-widest hover:text-white/40 transition-all"
              >
                Skip for now
              </button>
            </div>
          )}

          {/* STEP 3 — DONE */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-3xl flex items-center justify-center mx-auto">
                <span className="text-[#00ff88] text-3xl">✓</span>
              </div>
              <h2 className="text-white font-black text-xl uppercase tracking-widest">
                You're All Set!
              </h2>
              <p className="text-white/30 text-[10px] uppercase tracking-widest leading-relaxed">
                {createdVault?.name} is ready. Start tracking your inventory and profits.
              </p>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-left space-y-3">
                <p className="text-white/20 text-[8px] uppercase font-black tracking-widest mb-4">What you can do now:</p>
                {[
                  "Add more items to your inventory",
                  "Ask the AI agent for profit advice",
                  "Invite your team members",
                  "Generate invoices for every sale"
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[#4182ff] text-xs">→</span>
                    <p className="text-white/50 text-[9px] uppercase font-black">{tip}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={handleDone}
                className="w-full bg-gradient-to-r from-[#4182ff] to-[#00ff88] p-4 rounded-2xl font-black uppercase text-[10px] text-white tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(65,130,255,0.2)]"
              >
                Enter Vault →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
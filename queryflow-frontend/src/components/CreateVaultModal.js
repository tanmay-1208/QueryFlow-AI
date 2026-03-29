import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://queryflow-ai-production.up.railway.app";

const CreateVaultModal = ({ isOpen, onClose, onCreated, userId, vaultCount }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/vaults`, {
        userId,
        name,
        description
      });
      onCreated(res.data);
      onClose();
      setName("");
      setDescription("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create vault.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0f0f0f] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl"
      >
        <h2 className="text-white font-black uppercase text-center mb-2 text-xs tracking-[0.4em] italic">
          Create_New_Vault
        </h2>
        <p className="text-white/20 text-[9px] text-center uppercase tracking-widest mb-8">
          {vaultCount}/2 vaults used — Free Plan
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-[9px] font-black uppercase text-center">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <input
            className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold uppercase"
            placeholder="Vault Name (e.g. Electronics Store)"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#4182ff] transition-all text-[10px] font-bold"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl font-bold uppercase text-[9px] text-white/30 hover:bg-white/10 hover:text-white transition-all"
            >
              [ Cancel ]
            </button>
            <button
              type="submit"
              disabled={loading || vaultCount >= 2}
              className="flex-1 bg-[#4182ff] p-4 rounded-xl font-black uppercase text-[9px] text-white shadow-[0_0_20px_rgba(65,130,255,0.2)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Vault"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateVaultModal;
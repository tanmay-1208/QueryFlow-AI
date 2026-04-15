import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://tanmaysingh12r-queryflow-ai.hf.space";

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
    <div className="fixed inset-0 bg-[#080A0F]/95 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0D1117] border border-[#C9A84C]/20 p-6 md:p-10 rounded-2xl w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent"></div>
        <h2 className="text-[#C9A84C] font-syne font-bold uppercase text-center mb-2 text-sm tracking-[0.3em]">
          Create_New_Vault
        </h2>
        <p className="text-white/20 text-[14px] md:text-[9px] text-center uppercase tracking-widest mb-8">
          {vaultCount}/2 vaults used — Free Plan
        </p>

        {error && (
          <div className="bg-[#E05555]/10 border border-[#E05555]/20 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-[14px] md:text-[9px] font-black uppercase text-center">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <input
            className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-4 rounded-xl text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-dm uppercase shadow-inner placeholder:text-[#C9A84C]/30"
            placeholder="Vault Name (e.g. Electronics)"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-4 rounded-xl text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-dm shadow-inner placeholder:text-[#C9A84C]/30"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-transparent border border-white/10 p-4 rounded-xl font-syne font-bold uppercase text-[14px] md:text-[10px] tracking-[0.2em] text-white/40 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || vaultCount >= 2}
              className="flex-1 bg-[#C9A84C] p-4 rounded-xl font-syne font-bold uppercase text-[14px] md:text-[10px] tracking-[0.2em] text-[#080A0F] shadow-[0_0_15px_rgba(201,168,76,0.3)] hover:brightness-110 active:scale-95 transition-all duration-200 disabled:opacity-50"
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


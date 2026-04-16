import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://tanmaysingh12r-queryflow-ai.hf.space";

const CustomerModal = ({ isOpen, onClose, onCustomerSaved, vaultId, existingCustomer }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [priceGroup, setPriceGroup] = useState("RETAIL");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingCustomer) {
      setName(existingCustomer.name || "");
      setPhone(existingCustomer.phone || "");
      setPriceGroup(existingCustomer.priceGroup || "RETAIL");
    } else {
      setName("");
      setPhone("");
      setPriceGroup("RETAIL");
    }
  }, [existingCustomer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const payload = {
        name,
        phone,
        priceGroup,
        vaultId
      };

      let res;
      if (existingCustomer) {
        res = await axios.put(`${API_BASE_URL}/api/customers/${existingCustomer.id}`, payload);
      } else {
        res = await axios.post(`${API_BASE_URL}/api/customers`, payload);
      }
      
      onCustomerSaved(res.data);
      onClose();
    } catch (error) {
      console.error("Save Customer Error:", error);
      alert("Terminal Error: Could not save customer context.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#080A0F]/95 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <div className="bg-[#0D1117] border border-[#C9A84C]/20 p-6 md:p-10 rounded-2xl w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent"></div>

        <h2 className="text-[#C9A84C] font-syne font-bold uppercase text-center mb-8 text-sm tracking-[0.3em]">
          {existingCustomer ? "Update_Identity" : "Register_Identity"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[14px] md:text-[8px] text-white/30 uppercase font-black mb-2 tracking-widest">
              Entity Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-4 rounded-xl text-white font-dm text-sm outline-none focus:border-[#C9A84C] shadow-inner transition-all"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-[14px] md:text-[8px] text-white/30 uppercase font-black mb-2 tracking-widest">
              Contact Line
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-4 rounded-xl text-white font-dm text-sm outline-none focus:border-[#C9A84C] shadow-inner transition-all"
              placeholder="e.g. +91 9876543210"
            />
          </div>

          <div>
            <label className="block text-[14px] md:text-[8px] text-white/30 uppercase font-black mb-2 tracking-widest">
              Clearance Tier (Price Group)
            </label>
            <select
              value={priceGroup}
              onChange={(e) => setPriceGroup(e.target.value)}
              className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-4 rounded-xl text-white font-dm text-sm outline-none focus:border-[#C9A84C] shadow-inner transition-all appearance-none cursor-pointer"
            >
              <option value="RETAIL">[ Tier_3 ] Retail</option>
              <option value="DEALER">[ Tier_2 ] Dealer</option>
              <option value="WHOLESALE">[ Tier_1 ] Wholesale</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-transparent border border-white/10 p-4 rounded-xl font-syne font-bold uppercase text-[14px] md:text-[10px] tracking-[0.2em] text-white/40 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              Abort
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 bg-[#C9A84C] p-4 rounded-xl font-syne font-bold uppercase text-[14px] md:text-[10px] tracking-[0.2em] text-[#080A0F] shadow-[0_0_15px_rgba(201,168,76,0.3)] hover:brightness-110 active:scale-95 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Commit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;

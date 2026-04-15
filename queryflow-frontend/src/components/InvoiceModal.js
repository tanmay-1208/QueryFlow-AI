import React, { useState } from "react";
import { generateInvoice } from "../utils/generateInvoice";

const InvoiceModal = ({ isOpen, onClose, sale, userId }) => {
  const [seller, setSeller] = useState({
    businessName: "",
    address: "",
    phone: "",
    gstin: "",
    bankDetails: ""
  });

  const [buyer, setBuyer] = useState({
    name: "",
    address: "",
    phone: "",
    gstin: ""
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen || !sale) return null;

  const handleGenerate = () => {
    setLoading(true);
    try {
      const invoiceNumber = Date.now().toString().slice(-6);
      generateInvoice({
        sale,
        seller,
        buyer,
        invoiceNumber
      });
    } catch (err) {
      console.error("Invoice Error:", err);
      alert("Failed to generate invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#080A0F]/95 backdrop-blur-md flex items-center justify-center z-[100] p-6 overflow-y-auto">
      <div className="bg-[#0D1117] border border-[#C9A84C]/20 p-6 md:p-10 rounded-2xl w-full max-w-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative overflow-hidden my-6">

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent"></div>

        <div className="flex justify-between items-center mb-8 relative">
          <div>
            <h2 className="text-[#C9A84C] font-syne font-bold uppercase text-sm tracking-[0.3em]">
              Generate_Invoice
            </h2>
            <p className="text-white/20 text-[14px] md:text-[9px] uppercase tracking-widest mt-1 font-dm">
              {sale.productName} — {sale.quantity} units — ₹{sale.sellPrice?.toLocaleString("en-IN")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-[14px] md:text-[10px] font-syne font-bold border border-white/10 px-3 py-1 rounded-md transition-all uppercase"
          >
            Close
          </button>
        </div>

        {/* SALE SUMMARY */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-[#0D1117]/80 border border-[#C9A84C]/15 p-4 rounded-2xl border border-white/5 text-center">
            <p className="text-[14px] md:text-[7px] text-gray-500 uppercase font-black mb-1">Quantity</p>
            <p className="text-sm font-black text-white">{sale.quantity}</p>
          </div>
          <div className="bg-[#0D1117]/80 border border-[#C9A84C]/15 p-4 rounded-2xl border border-white/5 text-center">
            <p className="text-[14px] md:text-[7px] text-gray-500 uppercase font-black mb-1">Sell Price</p>
            <p className="text-sm font-black text-white">₹{sale.sellPrice?.toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-[#0D1117]/80 border border-[#C9A84C]/15 p-4 rounded-2xl border border-white/5 text-center">
            <p className="text-[14px] md:text-[7px] text-gray-500 uppercase font-black mb-1">Profit</p>
            <p className="text-sm font-black text-[#2ECC8A]">₹{sale.profit?.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">

          {/* SELLER INFO */}
          <div className="space-y-3">
            <p className="text-[14px] md:text-[8px] text-white/20 uppercase font-black tracking-widest mb-4">
              Your Business Info
            </p>
            <input
              className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-3 rounded-xl text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-dm shadow-inner placeholder:text-[#C9A84C]/30"
              placeholder="Business Name *"
              value={seller.businessName}
              onChange={e => setSeller({ ...seller, businessName: e.target.value })}
            />
            <input
              className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-3 rounded-xl text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-dm shadow-inner placeholder:text-[#C9A84C]/30"
              placeholder="Address"
              value={seller.address}
              onChange={e => setSeller({ ...seller, address: e.target.value })}
            />
            <input
              className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-3 rounded-xl text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-dm shadow-inner placeholder:text-[#C9A84C]/30"
              placeholder="Phone Number"
              value={seller.phone}
              onChange={e => setSeller({ ...seller, phone: e.target.value })}
            />
            <input
              className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-3 rounded-xl text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-dm shadow-inner placeholder:text-[#C9A84C]/30"
              placeholder="GSTIN (optional)"
              value={seller.gstin}
              onChange={e => setSeller({ ...seller, gstin: e.target.value })}
            />
            <input
              className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-3 rounded-xl text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-dm shadow-inner placeholder:text-[#C9A84C]/30"
              placeholder="Bank Details (optional)"
              value={seller.bankDetails}
              onChange={e => setSeller({ ...seller, bankDetails: e.target.value })}
            />
          </div>

          {/* BUYER INFO */}
          <div className="space-y-3">
            <p className="text-[14px] md:text-[8px] text-white/20 uppercase font-black tracking-widest mb-4">
              Buyer Info
            </p>
            <input
              className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-3 rounded-xl text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-dm shadow-inner placeholder:text-[#C9A84C]/30"
              placeholder="Buyer Name *"
              value={buyer.name}
              onChange={e => setBuyer({ ...buyer, name: e.target.value })}
            />
            <input
              className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-3 rounded-xl text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-dm shadow-inner placeholder:text-[#C9A84C]/30"
              placeholder="Buyer Address"
              value={buyer.address}
              onChange={e => setBuyer({ ...buyer, address: e.target.value })}
            />
            <input
              className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-3 rounded-xl text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-dm shadow-inner placeholder:text-[#C9A84C]/30"
              placeholder="Buyer Phone"
              value={buyer.phone}
              onChange={e => setBuyer({ ...buyer, phone: e.target.value })}
            />
            <input
              className="w-full bg-[#080A0F] border border-[#C9A84C]/20 p-3 rounded-xl text-[#C9A84C] outline-none focus:border-[#C9A84C] transition-all text-[14px] md:text-[10px] font-dm shadow-inner placeholder:text-[#C9A84C]/30"
              placeholder="Buyer GSTIN (optional)"
              value={buyer.gstin}
              onChange={e => setBuyer({ ...buyer, gstin: e.target.value })}
            />
          </div>
        </div>

        {/* GENERATE BUTTON */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 bg-transparent border border-white/10 p-4 rounded-xl font-syne font-bold uppercase text-[14px] md:text-[10px] tracking-[0.2em] text-white/40 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !seller.businessName || !buyer.name}
            className="flex-1 bg-[#C9A84C] p-4 rounded-xl font-syne font-bold uppercase text-[14px] md:text-[10px] tracking-[0.2em] text-[#080A0F] shadow-[0_0_15px_rgba(201,168,76,0.3)] hover:brightness-110 active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Download Invoice PDF"}
          </button>
        </div>

        <p className="text-white/10 text-[14px] md:text-[8px] uppercase font-black text-center mt-4">
          Business name and buyer name are required
        </p>
      </div>
    </div>
  );
};

export default InvoiceModal;

// commit change 2
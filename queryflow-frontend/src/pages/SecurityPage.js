import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SecurityPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-10 pb-40">
      <div className="inline-flex items-center gap-2 bg-[#66dd8b]/10 border border-[#66dd8b]/20 px-6 py-2 rounded-full mb-12">
        <span className="w-2 h-2 bg-[#66dd8b] rounded-full animate-pulse"></span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#66dd8b]">SOC2 Type II COMPLIANT</span>
      </div>
      <h1 className="text-6xl md:text-[100px] font-black font-['Manrope'] tracking-tighter mb-20 leading-[0.85]">Zero-Leak<br/><span className="text-[#66dd8b]">Fiscal Integrity</span></h1>      
      
      <div className="bg-[#131313] p-16 rounded-[5rem] border border-white/5 mb-12">
        <h3 className="text-3xl font-black mb-10">The Zero-Knowledge Promise</h3>
        <p className="text-gray-400 text-xl leading-relaxed max-w-3xl">
          At QueryFlow, we believe in **Sovereign Data**. Our architecture uses end-to-end encryption where only you hold the keys to your ledger. We provide the intelligence; you provide the access.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5">
          <h4 className="font-black text-gray-500 uppercase text-xs mb-4 tracking-widest">Isolated Infrastructure</h4>
          <p className="text-gray-500">Every institutional vault resides on a physically isolated database cluster. This "Air-Gap" philosophy ensures zero cross-tenant data leakage.</p>
        </div>
        <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5">
          <h4 className="font-black text-gray-500 uppercase text-xs mb-4 tracking-widest">Audit Trail Transparency</h4>
          <p className="text-gray-500">Every ledger interaction is logged on an immutable, append-only history. Your compliance team has a full audit trail for every asset movement.</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default SecurityPage;
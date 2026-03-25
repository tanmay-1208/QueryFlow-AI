import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SecurityPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white font-['Inter']">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-40">
      <div className="inline-flex items-center gap-2 bg-[#66dd8b]/10 border border-[#66dd8b]/20 px-6 py-2 rounded-full mb-12">
        <span className="w-2 h-2 bg-[#66dd8b] rounded-full animate-pulse"></span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#66dd8b]">Fortress Protocol 4.0 Verified</span>
      </div>
      <h1 className="text-5xl md:text-[100px] font-black font-['Manrope'] tracking-tighter mb-20 leading-[0.85]">Zero-Leak<br/><span className="text-[#66dd8b]">Fiscal Integrity</span></h1>      
      
      <div className="grid md:grid-cols-3 gap-8 text-left">
        <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 hover:border-[#66dd8b]/30 transition-all">
          <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-gray-400">Encryption</h3>
          <p className="text-gray-500 leading-relaxed mb-8">AES-256 for data at rest. TLS 1.3 with Perfect Forward Secrecy (PFS) for all transit packets.</p>
          <div className="text-[10px] font-black text-[#66dd8b] uppercase tracking-widest">Active: SHA-512 Hashing</div>
        </div>
        
        <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 hover:border-[#66dd8b]/30 transition-all">
          <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-gray-400">Isolation</h3>
          <p className="text-gray-500 leading-relaxed mb-8">Physically isolated database clusters. Our "Air-Gap" philosophy ensures zero cross-tenant leakage.</p>
          <div className="text-[10px] font-black text-[#66dd8b] uppercase tracking-widest">Active: VPC Peering</div>
        </div>

        <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 hover:border-[#66dd8b]/30 transition-all">
          <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-gray-400">Compliance</h3>
          <p className="text-gray-500 leading-relaxed mb-8">SOC2 Type II ready, GDPR compliant, and adhering to ISO 27001 standards for financial data.</p>
          <div className="text-[10px] font-black text-[#66dd8b] uppercase tracking-widest">Certified: 2026 Audit</div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default SecurityPage;
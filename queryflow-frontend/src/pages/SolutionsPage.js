import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SolutionsPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white font-['Inter']">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-40">
      <h1 className="text-5xl md:text-[100px] font-black font-['Manrope'] tracking-tighter mb-20 leading-[0.85]">
        Tailored for<br/><span className="italic text-gray-600 font-light">Complex Treasury</span>
      </h1>      
      <div className="space-y-10">
        <div className="bg-[#1c1b1b] p-12 md:p-20 rounded-[5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-xl">
            <div className="bg-[#4182ff]/10 text-[#4182ff] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block border border-[#4182ff]/20">Enterprise</div>
            <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tight text-white">E-Commerce Conglomerates</h3>
            <p className="text-lg text-gray-400 leading-relaxed mb-8">Unify fragmented logistics data across global nodes. QueryFlow Vault handles currency conversions and tax provisioning automatically.</p>
            <ul className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase text-gray-600 tracking-widest">
              <li>✓ Multi-Currency</li>
              <li>✓ Automated VAT</li>
              <li>✓ SKU Risk Scoring</li>
              <li>✓ Liquidity Forecasting</li>
            </ul>
          </div>
          <div className="w-64 h-64 bg-gradient-to-br from-[#1c1b1b] to-black rounded-full border border-white/5 flex items-center justify-center">
             <span className="material-symbols-outlined text-[#4182ff] text-8xl animate-pulse">hub</span>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default SolutionsPage;
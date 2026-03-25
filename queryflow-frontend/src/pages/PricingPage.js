import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PricingPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white font-['Inter']">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-40">
      <h1 className="text-5xl md:text-[100px] font-black font-['Manrope'] tracking-tighter mb-20 leading-[0.85] text-center">Institutional<br/>Access</h1>
      
      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <div className="bg-[#1c1b1b] p-16 rounded-[4rem] border border-white/5 text-left">
          <h3 className="text-xl font-bold uppercase tracking-widest text-gray-500 mb-4">Professional</h3>
          <div className="text-7xl font-black mb-10 text-white">$0<span className="text-lg text-gray-700">/mo</span></div>
          <ul className="space-y-4 mb-12 text-gray-400 font-medium">
            <li>• 1 Active Ledger Vault</li>
            <li>• Standard AI Advisor</li>
            <li>• Real-time Tax Provisioning</li>
          </ul>
          <button className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all">Start Free</button>
        </div>

        <div className="bg-[#1c1b1b] p-16 rounded-[4rem] border border-[#4182ff]/30 text-left relative">
          <h3 className="text-xl font-bold uppercase tracking-widest text-[#4182ff] mb-4">Institutional</h3>
          <div className="text-7xl font-black mb-10 text-white">Custom</div>
          <ul className="space-y-4 mb-12 text-gray-400 font-medium">
            <li>• Unlimited Ledger Vaults</li>
            <li>• Advanced Fiscal Modeling</li>
            <li>• SOC2 Compliance API</li>
          </ul>
          <button className="w-full py-5 bg-[#4182ff] text-white font-black rounded-2xl shadow-lg shadow-[#4182ff]/20 hover:scale-[1.02] transition-all">Contact Sales</button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default PricingPage;
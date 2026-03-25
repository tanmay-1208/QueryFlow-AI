import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SolutionsPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white font-['Inter']">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-10 pb-40">
      <h1 className="text-6xl md:text-[100px] font-black font-['Manrope'] tracking-tighter mb-20 leading-[0.85]">
        Industry<br/><span className="text-[#4182ff]">Verticals</span>
      </h1>      

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Solution 1: E-Commerce */}
        <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 group hover:border-[#4182ff]/30 transition-all">
          <div className="flex justify-between items-start mb-10">
            <span className="material-symbols-outlined text-4xl text-[#4182ff]">shopping_cart</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">High Volume</span>
          </div>
          <h3 className="text-3xl font-black mb-6">Global E-Commerce</h3>
          <p className="text-gray-400 leading-relaxed mb-8">
            Manage thousands of SKUs across multiple warehouses. QueryFlow automatically reconciles shipping costs, returns, and platform fees (Shopify/Amazon) into a single net-profit view.
          </p>
          <ul className="space-y-3 text-sm font-bold text-gray-500">
            <li className="flex items-center gap-2">✓ Multi-currency settlement</li>
            <li className="flex items-center gap-2">✓ Inventory burn-rate alerts</li>
            <li className="flex items-center gap-2">✓ Automated VAT/GST logic</li>
          </ul>
        </div>

        {/* Solution 2: Real Estate */}
        <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 group hover:border-[#adc7ff]/30 transition-all">
          <div className="flex justify-between items-start mb-10">
            <span className="material-symbols-outlined text-4xl text-[#adc7ff]">domain</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Fixed Assets</span>
          </div>
          <h3 className="text-3xl font-black mb-6">Asset Management</h3>
          <p className="text-gray-400 leading-relaxed mb-8">
            Track property valuations, rental yields, and maintenance liabilities. Our vault treats physical assets with the same precision as liquid cash, providing a true Total Net Worth.
          </p>
          <ul className="space-y-3 text-sm font-bold text-gray-500">
            <li className="flex items-center gap-2">✓ Depreciation scheduling</li>
            <li className="flex items-center gap-2">✓ Mortgage interest tracking</li>
            <li className="flex items-center gap-2">✓ Capital gain forecasting</li>
          </ul>
        </div>

        {/* Solution 3: Digital Agencies */}
        <div className="bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 group hover:border-[#66dd8b]/30 transition-all">
          <div className="flex justify-between items-start mb-10">
            <span className="material-symbols-outlined text-4xl text-[#66dd8b]">ads_click</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Service Based</span>
          </div>
          <h3 className="text-3xl font-black mb-6">Scale Agencies</h3>
          <p className="text-gray-400 leading-relaxed mb-8">
            Monitor client retainers, contractor payouts, and project margins. Predict your runway based on recurring revenue vs. operational overhead in real-time.
          </p>
          <ul className="space-y-3 text-sm font-bold text-gray-500">
            <li className="flex items-center gap-2">✓ Subscription MRR tracking</li>
            <li className="flex items-center gap-2">✓ Contractor margin analysis</li>
            <li className="flex items-center gap-2">✓ Cash-flow runway modeling</li>
          </ul>
        </div>

        {/* Solution 4: Institutional Treasury */}
        <div className="bg-[#131313] p-12 rounded-[4rem] border border-[#4182ff]/20">
          <h3 className="text-3xl font-black mb-6 italic text-[#4182ff]">Custom Enterprise</h3>
          <p className="text-gray-400 leading-relaxed mb-8">
            For organizations with bespoke fiscal requirements, we offer API-first integration to sync QueryFlow Vault with your existing ERP or internal accounting software.
          </p>
          <button className="bg-[#4182ff] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
            Talk to Engineering
          </button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);
//
export default SolutionsPage;
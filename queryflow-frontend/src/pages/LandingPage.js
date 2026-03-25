import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

const LandingPage = () => (
  <div className="bg-[#0e0e0e] text-white font-['Inter']">
    <Navbar />
    <Hero />
    
    {/* NEW SECTION: MISSION CONTROL */}
    <section className="max-w-[1400px] mx-auto px-10 py-32 border-t border-white/5">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-5xl font-black font-['Manrope'] tracking-tighter mb-8 italic">
            Beyond the <br/><span className="text-[#adc7ff]">Static Ledger</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Traditional accounting is reactive—you find out what happened last month, next month. QueryFlow Vault is **proactive**. We sync with your entity nodes to provide a live "Snapshot of Truth."
          </p>
          <div className="space-y-6">
            <div className="flex gap-4">
              <span className="text-[#66dd8b] font-black">01</span>
              <p className="text-sm text-gray-500"><strong className="text-white">Unified Visibility:</strong> Connect multiple bank terminals and digital vaults into one interface.</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#66dd8b] font-black">02</span>
              <p className="text-sm text-gray-500"><strong className="text-white">Algorithmic Foresight:</strong> Predict tax liabilities and capital gains before the quarter ends.</p>
            </div>
          </div>
        </div>
        <div className="bg-[#131313] p-10 rounded-[4rem] border border-white/5 aspect-square flex items-center justify-center">
           <div className="text-center">
             <div className="text-6xl font-black text-[#4182ff] mb-4">94%</div>
             <p className="text-[10px] uppercase font-black tracking-widest text-gray-600">Reduction in Manual Audit Time</p>
           </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default LandingPage;
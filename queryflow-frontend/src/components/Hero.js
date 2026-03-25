import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-32 md:pt-48 pb-20 grid lg:grid-cols-2 gap-24 items-center">
      <div className="animate-in fade-in slide-in-from-left duration-1000">
        <div className="inline-flex items-center gap-2 bg-[#66dd8b]/10 border border-[#66dd8b]/20 px-4 py-2 rounded-full mb-8 md:mb-12">
          <span className="w-2 h-2 bg-[#66dd8b] rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#66dd8b]">V4.0 Institutional</span>
        </div>
        
        <h1 className="text-[60px] md:text-[100px] font-black font-['Manrope'] tracking-tighter leading-[0.85] mb-10 text-white">
          The Modern <br className="hidden md:block"/>CFO's <br/><span className="text-[#adc7ff] italic">Digital Vault</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed mb-12 font-medium">
          Unify ledger integrity with algorithmic foresight. QueryFlow Vault transforms raw fiscal data into institutional intelligence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5">
          <Link to="/login" className="bg-[#4182ff] text-white px-10 py-5 rounded-2xl font-black text-center text-lg shadow-2xl hover:scale-105 transition-all">
            Access Terminal
          </Link>
        </div>
      </div>

      {/* REVENUE CARD */}
      <div className="bg-[#1c1b1b] p-8 md:p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden shadow-2xl h-64 md:h-80 flex flex-col justify-between">
         <span className="text-[11px] text-gray-500 uppercase font-black tracking-[0.2em]">Net Revenue at Risk</span>
         <div className="text-5xl md:text-[80px] font-black tracking-tighter leading-none text-white">$4.2M</div>
         <div className="absolute bottom-0 left-0 w-[75%] h-2 bg-[#4182ff]"></div>
      </div>
    </section>
  );
};

export default Hero;
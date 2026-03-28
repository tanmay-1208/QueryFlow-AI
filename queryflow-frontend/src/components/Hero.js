import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#080808]">
      
      {/* --- XTRACT STARFIELD BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="stars-container"></div> {/* We will add this CSS in step 2 */}
      </div>

      {/* --- THE CENTER GLOW ORB (The "Planet" effect) --- */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] bg-[#4182ff] rounded-full blur-[120px] opacity-30 z-0"
      />

      {/* --- CONTENT (CENTRE ALIGNED) --- */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <span className="bg-[#4182ff]/10 text-[#4182ff] text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-[#4182ff]/20">
            New: Automated Asset Synthesis
          </span>
        </motion.div>

        {/* Main Title (Centred & Massive) */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight mb-8"
        >
          Intelligent Finance for <br/>
          <span className="italic text-[#adc7ff]">Modern Entities.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          QueryFlow brings AI-driven fiscal automation to your fingertips. 
          Streamline your ledger, secure your vault, and automate your audit.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row gap-4 justify-center items-center"
        >
          <Link to="/login">
            <button className="px-10 py-4 bg-[#4182ff] text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all duration-500 rounded-lg">
              Get Started →
            </button>
          </Link>
          <Link to="/features">
            <button className="px-10 py-4 bg-transparent border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all rounded-lg">
              View Services
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
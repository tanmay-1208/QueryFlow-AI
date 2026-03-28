import React from "react";
import { motion } from "framer-motion";
import MatrixRain from "./MatrixRain";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#080808] overflow-hidden">
      
      {/* FALLING TEXT LAYER */}
      <MatrixRain />

      {/* XTRACT NEBULA GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4182ff]/20 blur-[150px] rounded-full z-0" />

      {/* AKIO BRUTALIST CONTENT */}
      <div className="relative z-10 text-center px-6">
        
        {/* Spinning Badge (Akio style) */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="mb-12 inline-block"
        >
          <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-gray-500">
            Query • Flow
          </div>
        </motion.div>

        {/* Massive Akio-style Header */}
        <motion.h1 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-[12vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter uppercase italic text-white"
        >
          Institutional <br/>
          <span className="text-[#4182ff]">Intelligence</span>
        </motion.h1>

        {/* Minimalist Subtext */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-gray-400 text-lg md:text-xl font-medium tracking-wide max-w-xl mx-auto uppercase"
        >
          The automated standard for digital asset management and fiscal sharding.
        </motion.p>

        {/* Primary Action */}
        <motion.div 
          className="mt-16"
          whileHover={{ scale: 1.05 }}
        >
          <button className="px-16 py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-[#4182ff] hover:text-white transition-all duration-500">
            Initialize Access
          </button>
        </motion.div>
      </div>
    </section>
  );
}
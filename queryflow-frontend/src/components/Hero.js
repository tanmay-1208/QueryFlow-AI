import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Helper component for the decoding effect
const DecodingText = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$¥€£!@#";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3; // Controls the speed of "landing"
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#080808] overflow-hidden">
      
      {/* 1. THE "Xtract" Glow in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4182ff]/20 blur-[150px] rounded-full z-0" />

      {/* 2. MAIN AKIO CONTENT */}
      <div className="relative z-10 text-center px-6">
        
        {/* Animated Badge */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="mb-12 inline-block border border-white/10 rounded-full p-8"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">
            Query • Flow • System
          </div>
        </motion.div>

        {/* 3. THE "FALLING & LANDING" HEADER */}
        <h1 className="text-[12vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter uppercase italic text-white flex flex-col items-center">
          <span className="block">
            <DecodingText text="INSTITUTIONAL" />
          </span>
          <span className="text-[#4182ff] block">
            <DecodingText text="INTELLIGENCE" />
          </span>
        </h1>

        {/* Minimalist Subtext */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 text-gray-400 text-sm md:text-lg font-medium tracking-[0.3em] max-w-2xl mx-auto uppercase"
        >
          Automated standard for digital asset management.
        </motion.p>

        {/* Primary Action Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-16"
        >
          <button className="px-16 py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] hover:bg-[#4182ff] hover:text-white transition-all duration-500">
            Initialize Access
          </button>
        </motion.div>
      </div>
    </section>
  );
}
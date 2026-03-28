import React from "react";
import { motion } from "framer-motion";

// Individual Letter Component that "Falls"
const FallingLetter = ({ char, delay, index }) => {
  // If it's a space, just return an empty box so the words separate
  if (char === " ") return <span className="inline-block w-4 md:w-8"></span>;

  return (
    <motion.span
      initial={{ y: -1000, opacity: 0 }} // Start far above the screen
      animate={{ y: 0, opacity: 1 }}     // Fall to its natural position
      transition={{
        delay: delay,
        duration: 0.8,
        type: "spring",
        stiffness: 50,
        damping: 15
      }}
      className="inline-block"
    >
      {char}
    </motion.span>
  );
};

export default function Hero() {
  const line1 = "Intelligent Finance for".split("");
  const line2 = "Modern Entities.".split("");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#080808] overflow-hidden pt-20">
      
      {/* 1. XTRACT STYLE BACKGROUND GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4182ff]/10 blur-[150px] rounded-full z-0" />

      {/* 2. THE DROPPING TEXT CONTAINER */}
      <div className="relative z-10 text-center px-6 max-w-[90vw]">
        
        {/* TOP LINE: Intelligent Finance for */}
        <h1 className="text-[7vw] md:text-[6vw] font-black text-white tracking-tighter leading-none flex flex-wrap justify-center mb-4 uppercase">
          {line1.map((char, i) => (
            <FallingLetter key={i} char={char} delay={i * 0.05} />
          ))}
        </h1>

        {/* BOTTOM LINE: Modern Entities. (Blue & Italic) */}
        <h1 className="text-[10vw] md:text-[9vw] font-black text-[#4182ff] italic tracking-tighter leading-[0.8] flex flex-wrap justify-center uppercase">
          {line2.map((char, i) => (
            // Delay starts after the first line finishes falling
            <FallingLetter key={i} char={char} delay={1.2 + (i * 0.05)} />
          ))}
        </h1>

        {/* 3. SUBTEXT & BUTTONS (Reveal after text lands) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-12"
        >
          <p className="text-gray-500 text-sm md:text-lg font-medium tracking-[0.4em] uppercase mb-12">
            Automated standard for digital asset management.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button className="px-12 py-5 bg-[#4182ff] text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-lg">
              Get Started →
            </button>
            <button className="px-12 py-5 bg-transparent border border-white/10 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-lg hover:bg-white/5 transition-all">
              View Services
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Spinning Badge */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 right-10 opacity-20 hidden lg:block"
      >
        <div className="w-32 h-32 border border-white/20 rounded-full flex items-center justify-center text-[8px] font-black uppercase tracking-widest text-white text-center p-4">
          Query • Flow • Synthesis • Terminal
        </div>
      </motion.div>
    </section>
  );
}
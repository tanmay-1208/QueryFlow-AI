import React from "react";
import { motion } from "framer-motion";

const FallingLetter = ({ char }) => {
  if (char === " ") return <span className="inline-block w-4 md:w-8"></span>;

  // CHAOS MATH:
  const randomDelay = Math.random() * 2.5; // Wider window for more chaos
  const randomRotate = (Math.random() - 0.5) * 60; // Random tilt up to 30 degrees
  const randomX = (Math.random() - 0.5) * 100; // Drifts left or right while falling
  const randomDuration = 0.6 + Math.random() * 0.4; // Some fall faster than others

  return (
    <motion.span
      initial={{ 
        y: -1200, 
        x: randomX, 
        rotate: randomRotate, 
        opacity: 0 
      }}
      animate={{ 
        y: 0, 
        x: 0, 
        rotate: 0, 
        opacity: 1 
      }}
      transition={{
        delay: randomDelay,
        duration: randomDuration,
        type: "spring",
        stiffness: 80, 
        damping: 12, // Lower damping = more "bounce" and chaotic landing
        mass: 1
      }}
      className="inline-block origin-center"
    >
      {char}
    </motion.span>
  );
};

export default function Hero() {
  const line1 = "Intelligent Finance for".split("");
  const line2 = "Modern Entities.".split("");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#080808] overflow-hidden">
      
      {/* 1. THE FLOOR GRID (High contrast like your screenshot) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), 
                            linear-gradient(to bottom, #333 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* 2. CHAOTIC TEXT CONTAINER */}
      <div className="relative z-10 text-center px-4 w-full max-w-[95vw]">
        
        {/* LINE 1: The White "Brutalist" Header */}
        <h1 className="text-[8vw] md:text-[7vw] font-black text-white tracking-tighter leading-[0.85] flex flex-wrap justify-center mb-4 uppercase">
          {line1.map((char, i) => (
            <FallingLetter key={`l1-${i}`} char={char} />
          ))}
        </h1>

        {/* LINE 2: The Large "Impact" Blue Header */}
        <h1 className="text-[12vw] md:text-[11vw] font-black text-[#4182ff] italic tracking-tighter leading-[0.75] flex flex-wrap justify-center uppercase">
          {line2.map((char, i) => (
            <FallingLetter key={`l2-${i}`} char={char} />
          ))}
        </h1>

        {/* 3. REVEALED UI ELEMENTS (Post-Chaos) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2 }}
          className="mt-20 flex flex-col items-center"
        >
          <div className="mb-10 px-6 py-2 border border-white/10 rounded-full backdrop-blur-md">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.6em]">
              Institutional Standard • Terminal v4.0
            </p>
          </div>
          
          <button className="group relative px-20 py-8 bg-white overflow-hidden transition-all hover:bg-[#4182ff]">
            <span className="relative z-10 text-black font-black uppercase tracking-[0.5em] text-xs group-hover:text-white">
              Initialize Access
            </span>
          </button>
        </motion.div>
      </div>

      {/* Background radial glow to pop the text */}
      <div className="absolute w-[1000px] h-[1000px] bg-[#4182ff]/5 blur-[180px] rounded-full z-0" />
    </section>
  );
}
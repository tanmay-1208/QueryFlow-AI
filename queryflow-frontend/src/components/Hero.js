import React from "react";
import { motion } from "framer-motion";

const FallingLetter = ({ char, color = "text-white", fontSize = "text-[7vw]" }) => {
  if (char === " ") return <span className="inline-block w-4 md:w-8"></span>;

  // PHYSICS MATH
  const randomDelay = Math.random() * 2.5; 
  const initialRotate = (Math.random() - 0.5) * 720;
  const initialX = (Math.random() - 0.5) * 400;
  
  // LANDING - Tighter offsets to keep it readable but "messy"
  const landX = (Math.random() - 0.5) * 12; 
  const landY = (Math.random() - 0.5) * 15; 
  const landRotate = (Math.random() - 0.5) * 20; 

  return (
    <motion.span
      initial={{ y: -1200, x: initialX, rotate: initialRotate, opacity: 0 }}
      animate={{ y: landY, x: landX, rotate: landRotate, opacity: 1 }}
      transition={{
        delay: randomDelay,
        duration: 0.9,
        type: "spring",
        stiffness: 60, 
        damping: 12,
      }}
      className={`inline-block font-black uppercase tracking-[-0.08em] ${fontSize} ${color} leading-[0.8] drop-shadow-2xl`}
    >
      {char}
    </motion.span>
  );
};

export default function Hero() {
  const line1 = "Intelligent Finance for".split("");
  const line2 = "Modern Entities.".split("");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#080808] overflow-hidden pt-32 pb-20">
      
      {/* 1. ARCHITECTURAL GRID (Refined) */}
      <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), 
                            linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* 2. THE TERMINAL CONTAINER */}
      <div className="relative z-10 text-center w-full max-w-[1400px] flex flex-col items-center px-4">
        
        {/* Subtle Pre-header */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 px-4 py-1 border border-[#4182ff]/30 rounded-full bg-[#4182ff]/5"
        >
          <p className="text-[#4182ff] text-[9px] font-black uppercase tracking-[0.4em]">Node Connection: Stable</p>
        </motion.div>

        {/* LINE 1 - Sits slightly higher */}
        <div className="flex flex-wrap justify-center mb-0 perspective-[1000px]">
          {line1.map((char, i) => (
            <FallingLetter key={`l1-${i}`} char={char} color="text-white" fontSize="text-[7.5vw]" />
          ))}
        </div>

        {/* LINE 2 - Overlaps Line 1 slightly for that Akio depth */}
        <div className="flex flex-wrap justify-center -mt-6 md:-mt-10">
          {line2.map((char, i) => (
            <FallingLetter key={`l2-${i}`} char={char} color="text-[#4182ff]" fontSize="text-[11vw]" />
          ))}
        </div>

        {/* 3. REFINED CALL TO ACTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2 }}
          className="mt-16 relative flex flex-col items-center"
        >
          <div className="group relative">
             {/* Glowing background behind button */}
            <div className="absolute inset-0 bg-[#4182ff] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
            
            <button className="relative px-20 py-6 bg-white border border-white text-black font-black uppercase tracking-[0.6em] text-[11px] hover:bg-transparent hover:text-white transition-all duration-500 overflow-hidden">
              Initialize Access
            </button>
          </div>

          <p className="mt-12 text-gray-600 text-[10px] font-black uppercase tracking-[1em] opacity-50">
            QueryFlow Vault System v4.0
          </p>
        </motion.div>
      </div>

      {/* Visual Depth Glow */}
      <div className="absolute w-[800px] h-[800px] bg-[#4182ff]/5 blur-[200px] rounded-full z-0 pointer-events-none" />
    </section>
  );
}
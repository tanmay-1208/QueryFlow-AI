import React from "react";
import { motion } from "framer-motion";

const FallingLetter = ({ char, color = "white", fontSize = "text-[8vw]" }) => {
  if (char === " ") return <span className="inline-block w-4 md:w-8"></span>;

  // CHAOS MATH - Calculated once per letter
  const randomDelay = Math.random() * 3; // Long window for staggered rain
  const initialRotate = (Math.random() - 0.5) * 720; // Multiple spins while falling
  const initialX = (Math.random() - 0.5) * 500; // Come in from wide angles
  
  // LANDING OFFSETS - This is what makes the "End look" chaotic
  const landX = (Math.random() - 0.5) * 15; // Doesn't land perfectly centered
  const landY = (Math.random() - 0.5) * 25; // Doesn't land on a straight line
  const landRotate = (Math.random() - 0.5) * 30; // Stays tilted after landing

  return (
    <motion.span
      initial={{ 
        y: -1500, 
        x: initialX, 
        rotate: initialRotate, 
        opacity: 0 
      }}
      animate={{ 
        y: landY, 
        x: landX, 
        rotate: landRotate, 
        opacity: 1 
      }}
      transition={{
        delay: randomDelay,
        duration: 1,
        type: "spring",
        stiffness: 50, 
        damping: 10, // High bounce
      }}
      className={`inline-block font-black uppercase tracking-tighter ${fontSize} ${color} leading-none`}
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
      
      {/* 1. BACKGROUND GRID */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), 
                            linear-gradient(to bottom, #333 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* 2. CHAOTIC TEXT CONTAINER */}
      <div className="relative z-10 text-center w-full max-w-[98vw] flex flex-col items-center">
        
        {/* LINE 1 */}
        <div className="flex flex-wrap justify-center mb-0">
          {line1.map((char, i) => (
            <FallingLetter key={`l1-${i}`} char={char} color="text-white" fontSize="text-[9vw]" />
          ))}
        </div>

        {/* LINE 2 */}
        <div className="flex flex-wrap justify-center -mt-4 md:-mt-10">
          {line2.map((char, i) => (
            <FallingLetter key={`l2-${i}`} char={char} color="text-[#4182ff]" fontSize="text-[13vw]" />
          ))}
        </div>

        {/* 3. CTA BUTTON - Reveals after the storm */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.5 }}
          className="mt-24 relative"
        >
          <button className="px-16 py-6 bg-white text-black font-black uppercase tracking-[0.6em] text-[10px] hover:bg-[#4182ff] hover:text-white transition-all duration-300">
            Initialize Access
          </button>
          
          {/* Subtitle landing underneath */}
          <p className="mt-8 text-gray-600 text-[10px] font-black uppercase tracking-[1em]">
            Terminal v4.0.26
          </p>
        </motion.div>
      </div>

      {/* Blue "Digital Smoke" Glow */}
      <div className="absolute w-[1200px] h-[1200px] bg-[#4182ff]/5 blur-[200px] rounded-full z-0 pointer-events-none" />
    </section>
  );
}
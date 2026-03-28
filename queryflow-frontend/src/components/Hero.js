import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// This component handles the falling "Capsules" that are clickable
const NavCapsule = ({ text, path, color, delay }) => {
  const navigate = useNavigate();
  
  // Random physics for the drop
  const randomX = (Math.random() - 0.5) * 400;
  const randomRotate = (Math.random() - 0.5) * 45;

  return (
    <motion.div
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      initial={{ y: -1000, x: randomX, rotate: randomRotate, opacity: 0 }}
      animate={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
      transition={{ 
        delay: delay, 
        type: "spring", 
        stiffness: 40, 
        damping: 10,
        mass: 1 
      }}
      whileHover={{ scale: 1.1, cursor: "pointer" }}
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate(path)}
      className={`absolute px-8 py-3 rounded-full border border-white/20 bg-black/80 backdrop-blur-lg z-50 flex items-center gap-3 group shadow-2xl`}
      style={{ 
        top: `${20 + Math.random() * 40}%`, 
        left: `${15 + Math.random() * 70}%` 
      }}
    >
      <div className={`w-2 h-2 rounded-full ${color} group-hover:animate-ping`} />
      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
        {text}
      </span>
    </motion.div>
  );
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#080808] overflow-hidden pt-20">
      
      {/* 1. THE FALLING NAV ELEMENTS (Interactive & Clickable) */}
      <NavCapsule text="Features" path="/features" color="bg-[#4182ff]" delay={0.5} />
      <NavCapsule text="Security" path="/security" color="bg-[#66dd8b]" delay={0.8} />
      <NavCapsule text="Solutions" path="/solutions" color="bg-[#fbbc00]" delay={1.1} />
      <NavCapsule text="Pricing" path="/pricing" color="bg-purple-500" delay={1.4} />

      {/* 2. BACKGROUND GRID (Locked) */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), 
                            linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* 3. MAIN AKIO TYPOGRAPHY (Static & Massive) */}
      <div className="relative z-10 text-center w-full max-w-[95vw] pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[13vw] font-black leading-[0.75] tracking-tighter uppercase text-white"
        >
          Intelligent <br/>
          <span className="text-white/10 outline-text">Finance</span>
        </motion.h1>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[13vw] font-black leading-[0.75] tracking-tighter uppercase text-[#4182ff] italic -mt-4"
        >
          Entities.
        </motion.h1>
      </div>

      {/* 4. CTA BUTTON */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="mt-20 z-30"
      >
        <button className="px-20 py-7 bg-white text-black font-black uppercase tracking-[0.6em] text-[10px] hover:bg-[#4182ff] hover:text-white transition-all duration-500">
          Initialize Access
        </button>
      </motion.div>

      {/* Background Glow */}
      <div className="absolute w-[1000px] h-[1000px] bg-[#4182ff]/5 blur-[200px] rounded-full z-0 pointer-events-none" />
      
      <style jsx>{`
        .outline-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.2);
        }
      `}</style>
    </section>
  );
}
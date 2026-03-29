import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NavCapsule = ({ text, path, color, delay }) => {
  const navigate = useNavigate();
  const randomX = (Math.random() - 0.5) * 400;
  const randomRotate = (Math.random() - 0.5) * 45;

  return (
    <motion.div
      drag
      initial={{ y: -1000, x: randomX, rotate: randomRotate, opacity: 0 }}
      animate={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 40, damping: 10 }}
      whileHover={{ scale: 1.1, cursor: "pointer", zIndex: 60 }}
      onClick={() => navigate(path)}
      className="absolute px-8 py-3 rounded-full border border-white/20 bg-black/80 backdrop-blur-lg z-50 flex items-center gap-3 shadow-2xl"
      style={{ 
        top: `${25 + Math.random() * 40}%`, 
        left: `${15 + Math.random() * 70}%` 
      }}
    >
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">{text}</span>
    </motion.div>
  );
};

export default function Hero() {
  // Mouse Tracking for the Glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothing the glow movement
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  function handleMouseMove({ clientX, clientY, currentTarget }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center bg-[#080808] overflow-hidden pt-20 group"
    >
      {/* 1. INTERACTIVE NAVIGATION CAPSULES */}
      <NavCapsule text="Features" path="/features" color="bg-[#4182ff]" delay={0.5} />
      <NavCapsule text="Security" path="/security" color="bg-[#66dd8b]" delay={0.8} />
      <NavCapsule text="Solutions" path="/solutions" color="bg-[#fbbc00]" delay={1.1} />
      <NavCapsule text="Pricing" path="/pricing" color="bg-purple-500" delay={1.4} />

      {/* 2. DYNAMIC MOUSE GLOW (The Spotlight) */}
      <motion.div 
        className="absolute pointer-events-none z-10 w-[600px] h-[600px] bg-[#4182ff]/10 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          left: springX,
          top: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* 3. STATIC ARCHITECTURAL GRID */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), 
                            linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* 4. AKIO TYPOGRAPHY */}
      <div className="relative z-20 text-center w-full max-w-[95vw] pointer-events-none select-none">
        <motion.h1 
          className="text-[13vw] font-black leading-[0.75] tracking-tighter uppercase text-white"
        >
          Intelligent <br/>
          <span className="text-transparent outline-text opacity-40">Finance</span>
        </motion.h1>
        
        <motion.h1 
          className="text-[13vw] font-black leading-[0.75] tracking-tighter uppercase text-[#4182ff] italic -mt-4"
        >
          Entities.
        </motion.h1>
      </div>

      {/* 5. PRIMARY CALL TO ACTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="mt-20 z-30"
      >
        <button className="px-20 py-7 bg-white text-black font-black uppercase tracking-[0.6em] text-[10px] hover:bg-[#4182ff] hover:text-white transition-all duration-500 shadow-2xl">
          Initialize Access
        </button>
      </motion.div>

      {/* Fixed styling for the Akio Outline Effect */}
      <style dangerouslySetInnerHTML={{ __html: `
        .outline-text {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.6);
          text-shadow: 0 0 20px rgba(255,255,255,0.1);
        }
      `}} />
    </section>
  );
}
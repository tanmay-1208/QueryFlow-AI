const fs = require('fs');

const heroContent = `import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NavCapsule = ({ text, path, color, delay, isMobile }) => {
  const navigate = useNavigate();
  const randomX = isMobile ? 0 : (Math.random() - 0.5) * 400;
  const randomRotate = isMobile ? 0 : (Math.random() - 0.5) * 45;

  const desktopStyles = isMobile ? {} : { 
    top: \`\${25 + Math.random() * 40}%\`, 
    left: \`\${15 + Math.random() * 70}%\` 
  };

  return (
    <motion.div
      drag={!isMobile}
      dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
      initial={{ y: -100, x: randomX, rotate: randomRotate, opacity: 0 }}
      animate={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 40, damping: 10 }}
      whileHover={{ scale: 1.05, cursor: "pointer", zIndex: 60 }}
      onC      onC      onC      on}
      onC      onC      Mob      onC      onC      Mob      onC      onC      Mob      onC    r border-white/20 bg-black/80 backdrop-blur-lg z-50 flex items-center gap-3 shadow-2xl\`}
      style={desktopStyles}
    >
      <div c      <div c      <div c      <div c      <div c      <div c   as      <div c      <div c      <d f      <div c      <div c      <div c      <div c      <div cn>
    </motion.div>
  );
};

// Character animation variants
const cconst cconst cconst cconst cconst cconst blconst cconst cconst cconst cconst cconst cenconst cconst cconst cconst cconst cconst c },
};

const childVariants = {
  hidden: { opacity: 0, y: 80, rotateX: 90, scale: 0.8 },
  visible: { opacity: 1, y: 0, rotateX: 0,   visible: { opacity: 1, y: 0, rotateX: 0,   visible: { opacity: 1, y: 0};  visible: { opacity: 1, y: 0, rotateX: 0,   visible {  visible: { opacity: 1, y: 0, rotateX: 0,   visible: { opacity: 1, y: ntitiesVariants = {
  hidden: {},
  visible: { transition: { stagger  visible: { transition: { stagger  }  visible: { transition: { stagger  visible: { transition: { stagger  }  visible: { transition: { stagger  visible: { transition: { stagger  }  visible: { transition: { stagger  visich  visible: { transition: {dEventLi  visible: { transition: { stagger  visible: { transition: { stagger  }  visible: { transition: { stagger  visible: { transition: { stagger  }  visible: { transition: { stnVa  visible: { tranormalizedX = useMotionValue(0);
  const normalizedY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const springNormX = useSpring(normalizedX, { stiffn  const springNormX = useSpring(normalizedX, { stiffn  const springNormX = useSpring(normalizedX, { stiffn  const springNormX = useSpring(normalizedX, { stiffn  const springNormX = useSpring(normalizedX, { stiffn  const springNormX = useSpring(normalizedX, { sove({ clientX, clientY, currentTarget }) {
    if (isMobile) return;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    const centerX = left + width / 2;
    const centerY = top + height / 2;
    normalizedX.set((clientX - centerX) / (width / 2));
    normalizedY.set((clientY - centerY) / (height / 2));
  }

  function handleMouseLeave() {
    normalizedX.set(0);
    normalizedY.set(0);
  }

  return (
    <section 
                                             ouseLeave={handleMouseLeave}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center bg-[#080808] overflow-hidden pt-24 pb-12 group px-4"
      style={{ perspective: "2000px" }}
    >
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: \`linear-gradient(to right, #ffffff 1px, transparent 1px), 
                            linear-gradient(to bottom, #ffffff 1px, transparent 1px)\`,
          bac          bac          bac          bac          bac          bac          ba                  bac          bac sName="absolute pointer-events-none z-10 w-[600px] h-[600px] bg-[#4182ff]/1          bac          bac          0           bac          bac          bac          bac  0"          bac          bac          bac          bac   ateX: "-50%", translateY: "-50%" }}
        />
      )}

      <motion.div 
        className="relative        cl-center w-full max-w-[95vw] pointer-events-none select-none flex flex-col item        className="relative        cl-center w-full max-w-[95vw] pointer-events-none select-none flex flex-col item        className="
                                       t-[13vw] font-black leading-[0.9] md:leading-[0.75] tracking-tighter uppercase text-white drop-shadow-2xl"
          style={{ transform: "translateZ(30px)" }}
        >
          <motion.div 
            variants={containe            variants={containe            variants={containe            variants={conte=            variants={containe            variants={containe            variants={containe            variants={conte=            variants={containe            variants={containe            variants={containe            variants={conte=            variants={containe            variants={containe            variants={containe            variants={conte=            variants={contain           cl      e="t            var out            variants={containe            variants={containe            variants={containe            variants={conte=            variants={containe            variants={containe            variants={containe            variants={co((letter, index) => (
              <motion.span key={index} variants={childVariants} style={{ display: "inline-block" }}>
                {letter}
              </              </              </              </  an          </motion.h1>
        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            bs                                                                                                   o"             <NavCapsule text="Features" path="/features" color="bg-[#4182ff]" delay={2.8} isMobile={isMobile} />
        </div>
        <div className={isMobile ? "" : "pointer-events-auto"}>
          <NavCapsule text="Security" path="/security" color="bg-[#66dd8b]" delay={2.9} isMobile={isMobile} />
        </div>
        <div className={isMobile ? "" : "pointer-events-auto"}>
          <NavCapsule text="Solutions" path="/solutions" color="bg-[#fbbc00]" delay={3.0} isMobile={isMobile} />
        </div>
        <div className={isMobile ? "" : "pointer-events-auto"}>
          <NavCapsule text="Pricing" path="/pricing" color="bg-purple-500" delay={3.1} isMobile={isMobile} />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 3.5, type: "spring", stiffness: 200, damping: 15 }} className="mt-16 md:mt-20 z-30 relative">
        <button className="px-12 md:px-20 py-5 md:py-7 bg-white text-black font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-[9px] md:text-[10px] hover:bg-[#4182ff] hover:text-white transition-        <butt500 shadow-2xl active:scale-95">
          Initialize Access
        </button>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: \`
        .outline-text {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.6);
          text-shadow: 0 0 20px rgba(255,255,255,0.1);
        }
      \`}} />
    </section>
  );
}`
fs.writeFileSync('/Users/mac/Downloads/demo/queryflow-frontend/src/components/Hero.js', heroContent);

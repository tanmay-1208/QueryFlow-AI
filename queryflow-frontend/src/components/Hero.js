import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

// 1. UPDATED CAPSULE LOGIC
const NavCapsule = ({ text, path, color, delay, isMobile }) => {
  const navigate = useNavigate();
  // Only randomize positions if we are on a desktop screen
  const randomX = isMobile ? 0 : (Math.random() - 0.5) * 400;
  const randomRotate = isMobile ? 0 : (Math.random() - 0.5) * 45;

  // If mobile, remove the absolute random positioning so they stack nicely
  const desktopStyles = isMobile ? {} : { 
    top: `${25 + Math.random() * 40}%`, 
    left: `${15 + Math.random() * 70}%` 
  };

  return (
    <motion.div
      drag={!isMobile} // Disable dragging on mobile to prevent layout breaking
      dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
      initial={{ y: -100, x: randomX, rotate: randomRotate, opacity: 0 }}
      animate={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 40, damping: 10 }}
      whileHover={{ scale: 1.05, cursor: "pointer", zIndex: 60 }}
      onClick={() => navigate(path)}
      className={`${isMobile ? 'relative' : 'absolute'} px-6 md:px-8 py-3 rounded-full border border-white/20 bg-black/80 backdrop-blur-lg z-50 flex items-center gap-3 shadow-2xl`}
      style={desktopStyles}
    >
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white">{text}</span>
    </motion.div>
  );
};

// Word animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2, // wait a bit before starting
    },
  },
};

const childVariants = {
  hidden: { 
    opacity: 0, 
    y: 100, 
    rotateX: 90, 
    scale: 0.5 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 12 
    } 
  }
};

const financeVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 1.0 }
  }
};

const entitiesVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 1.6 }
  }
};

export default function Hero() {
  // Mobile Detection State
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse Tracking for the Glow & 3D Tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const normalizedX = useMotionValue(0);
  const normalizedY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const springNormX = useSpring(normalizedX, { stiffness: 150, damping: 20 });
  const springNormY = useSpring(normalizedY, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(springNormY, [-1, 1], [15, -15]);
  const rotateY = useTransform(springNormX, [-1, 1], [-15, 15]);

  function handleMouseMove({ clientX, clientY, currentTarget }) {
    if (isMobile) return; // Disable spotlight calculation on mobile to save battery/performance
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center bg-[#080808] overflow-hidden pt-24 pb-12 group px-4"
      style={{ perspective: "2000px" }}
    >
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), 
                            linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* DYNAMIC MOUSE GLOW */}
      {!isMobile && (
        <motion.div 
          className="absolute pointer-events-none z-10 w-[600px] h-[600px] bg-[#4182ff]/10 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ left: springX, top: springY, translateX: "-50%", translateY: "-50%" }}
        />
      )}

      {/* AKIO TYPOGRAPHY - Added responsive sizing here & 3D tilt tracking */}
      <motion.div 
        className="relative z-20 text-center w-full max-w-[95vw] pointer-events-none select-none flex flex-col items-center justify-center mt-10 md:mt-0"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <motion.h1 
          className="text-[16vw] md:text-[13vw] font-black leading-[0.9] md:leading-[0.75] tracking-tighter uppercase text-white drop-shadow-2xl"
          style={{ transform: "translateZ(30px)" }}
        >
          <motion.span 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center" }}
          >
            {"Intelligent".split("").map((letter, index) => (
              <motion.span key={index} variants={childVariants} style={{ display: "inline-block" }}>
                {letter}
              </motion.span>
            ))}
          </motion.span>
          <br/>
          <motion.span 
            className="text-transparent outline-text opacity-40 text-[14vw] md:text-[13vw] inline-flex flex-wrap justify-center"
            variants={financeVariants}
            initial="hidden"
            animate="visible"
          >
            {"Finance".split("").map((letter, index) => (
              <motion.span key={index} variants={childVariants} style={{ display: "inline-block" }}>
                {letter}
              </motion.span>
            ))}
          </motion.span>
        </motion.h1>
        
        <motion.h1 
          className="text-[16vw] md:text-[13vw] font-black leading-[0.9] md:leading-[0.75] tracking-tighter uppercase text-[#4182ff] italic -mt-2 md:-mt-4 drop-shadow-[0_15px_30px_rgba(65,130,255,0.3)] inline-flex flex-wrap justify-center"
          style={{ transform: "translateZ(80px)" }}
          variants={entitiesVariants}
          initial="hidden"
          animate="visible"
        >
          {"Entities.".split("").map((letter, index) => (
            <motion.span key={index} variants={childVariants} style={{ display: "inline-block" }}>
              {letter}
            </motion.span>
          ))}
        </motion.h1>
      </motion.div>

      {/* RESPONSIVE CAPSULE CONTAINER */}
      <div className={`z-40 mt-12 w-full flex ${isMobile ? 'flex-row flex-wrap justify-center gap-3 relative' : 'absolute inset-0 pointer-events-none'}`}>
        <div className={isMobile ? "" : "pointer-events-auto"}>
          <NavCapsule text="Features" path="/features" color="bg-[#4182ff]" delay={2.5} isMobile={isMobile} />
        </div>
        <div className={isMobile ? "" : "pointer-events-auto"}>
          <NavCapsule text="Security" path="/security" color="bg-[#66dd8b]" delay={2.6} isMobile={isMobile} />
        </div>
        <div className={isMobile ? "" : "pointer-events-auto"}>
          <NavCapsule text="Solutions" path="/solutions" color="bg-[#fbbc00]" delay={2.7} isMobile={isMobile} />
        </div>
        <div className={isMobile ? "" : "pointer-events-auto"}>
          <NavCapsule text="Pricing" path="/pricing" color="bg-purple-500" delay={2.8} isMobile={isMobile} />
        </div>
      </div>

      {/* BUTTON */}
      <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 3.2, type: "spring", stiffness: 200, damping: 15 }} className="mt-16 md:mt-20 z-30 relative">
        <button className="px-12 md:px-20 py-5 md:py-7 bg-white text-black font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-[9px] md:text-[10px] hover:bg-[#4182ff] hover:text-white transition-all duration-500 shadow-2xl active:scale-95">
          Initialize Access
        </button>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .outline-text {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.6);
          text-shadow: 0 0 20px rgba(255,255,255,0.1);
        }
      `}} />
    </section>
  );
}
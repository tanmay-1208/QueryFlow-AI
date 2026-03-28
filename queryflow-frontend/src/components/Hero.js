import React from "react";
import { motion } from "framer-motion";

const FallingLetter = ({ char }) => {
  if (char === " ") return <span className="inline-block w-4 md:w-6"></span>;

  // Generate a random delay between 0 and 2 seconds
  const randomDelay = Math.random() * 2;
  // Generate a random horizontal offset so they don't fall in a perfectly straight line
  const randomX = (Math.random() - 0.5) * 20;

  return (
    <motion.span
      initial={{ y: -1000, x: randomX, opacity: 0, rotate: -20 }}
      animate={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
      transition={{
        delay: randomDelay,
        duration: 0.8,
        type: "spring",
        stiffness: 60,
        damping: 15
      }}
      // This adds a subtle glow/flicker when the letter "hits" the floor
      whileInView={{ 
        textShadow: ["0 0 0px #4182ff", "0 0 15px #4182ff", "0 0 0px #4182ff"],
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
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#080808] overflow-hidden">
      
      {/* STATIC GRID ANCHOR (Stops the "Slideshow" feel) */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), 
                            linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* BACKGROUND NEBULA */}
      <div className="absolute w-[800px] h-[800px] bg-[#4182ff]/5 blur-[150px] rounded-full z-0" />

      <div className="relative z-10 text-center px-6">
        {/* LINE 1 */}
        <h1 className="text-[6vw] font-black text-white tracking-tighter uppercase flex flex-wrap justify-center mb-2">
          {line1.map((char, i) => (
            <FallingLetter key={`l1-${i}`} char={char} />
          ))}
        </h1>

        {/* LINE 2 */}
        <h1 className="text-[10vw] font-black text-[#4182ff] italic tracking-tighter uppercase leading-[0.8] flex flex-wrap justify-center">
          {line2.map((char, i) => (
            <FallingLetter key={`l2-${i}`} char={char} />
          ))}
        </h1>

        {/* SUBTEXT (Wait for the rain to finish) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-16 flex flex-col items-center"
        >
          <p className="text-gray-500 text-xs tracking-[0.5em] uppercase mb-10">
            Institutional Standard • Synthesis Terminal
          </p>
          <button className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] hover:invert transition-all">
            Initialize Access
          </button>
        </motion.div>
      </div>
    </section>
  );
}
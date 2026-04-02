import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SecurityPage = () => {
  const { scrollY } = useScroll();
  // Parallax: header moves up slower than scroll
  const yHeader = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <div className="bg-[#0e0e0e] min-h-screen text-white pt-32 md:pt-40 relative overflow-hidden">
      <Navbar />

      {/* Scanning Reveal Line */}
      <motion.div
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[1px] bg-[#4182ff]/20 z-0 pointer-events-none"
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-40 relative z-10">
        <motion.h1
          style={{ y: yHeader }}
          className="text-[13vw] md:text-[9vw] leading-[0.85] md:leading-[0.8] font-black tracking-tighter mb-16 md:mb-20 italic w-full break-words"
        >
          FORTRESS<br/>
          <span className="text-[#00ff88]">ENCRYPTION</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {[1, 2].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: item === 1 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="p-10 md:p-16 bg-[#131313]/50 border border-white/5 backdrop-blur-xl rounded-[2.5rem] md:rounded-[4rem]"
            >
              <div className="w-12 h-12 rounded-full bg-[#4182ff]/10 flex items-center justify-center mb-8">
                <div className="w-3 h-3 rounded-full bg-[#4182ff] animate-ping" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 uppercase tracking-tighter">End-to-End Sharding</h3>
              <p className="text-gray-400 text-sm md:text-lg">Your data is fractured across 128 decentralized nodes. Inaccessible to external probes.</p>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SecurityPage;
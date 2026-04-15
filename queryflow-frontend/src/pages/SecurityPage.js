import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SecurityPage = () => {
  const { scrollY } = useScroll();
  // Parallax: header moves up slower than scroll
  const yHeader = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <div className="bg-[#080A0F] min-h-screen text-white pt-32 md:pt-40 relative overflow-hidden">
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
          <span className="text-[#2ECC8A]">ENCRYPTION</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-6 md:p-10 mb-24">
          {[
            { title: "End-to-End Sharding", desc: "Your data is fractured across 128 decentralized nodes. Inaccessible to external probes. Zero-knowledge architecture guarantees we cannot see your raw data.", color: "#4182ff" },
            { title: "FIPS 140-2 Level 3", desc: "Hardware isolation and redundant HSMs ensure compliance with the strictest international financial security regulations required by central banking institutions.", color: "#00ff88" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="p-6 md:p-10 md:p-8 md:p-16 bg-[#0D1117]/50 border border-white/5 backdrop-blur-xl rounded-[2.5rem] md:rounded-[4rem] group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-8`} style={{backgroundColor: `${item.color}20`}}>
                <div className={`w-3 h-3 rounded-full animate-ping`} style={{backgroundColor: item.color}} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 uppercase tracking-tighter" style={{color: item.color}}>{item.title}</h3>
              <p className="text-gray-400 text-sm md:text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-y border-white/10 py-16 md:py-24 mb-20 bg-white/[0.02] rounded-[3rem]"
        >
          <div className="text-center mb-10">
            <h3 className="text-xl font-black uppercase tracking-[0.3em] text-gray-500">Global Compliance Standards</h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 md:p-10 md:gap-8 md:p-20 opacity-50">
             {["SOC 2 TYPE II", "ISO 27001", "GDPR", "CCPA", "PCI DSS"].map((cert, idx) => (
                <div key={idx} className="text-xl md:text-3xl font-black tracking-tighter cursor-default hover:text-white transition-colors">{cert}</div>
             ))}
          </div>
        </motion.div>

        {/* Bug Bounty Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass p-6 md:p-10 md:p-8 md:p-16 text-center hover-glow rounded-[3rem]"
        >
           <h2 className="text-3xl md:text-4xl md:text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-6 text-white">Security <span className="text-[#C9A84C]">Bounty Program</span></h2>
           <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
             We work with top-tier security researchers worldwide. If you identify a vulnerability in QueryFlow&apos;s infrastructure, we reward responsible disclosure with bounties up to $150,000.
           </p>
           <button className="px-10 py-4 rounded-full bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all font-black uppercase tracking-widest text-sm text-white">
             View Program Details
           </button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default SecurityPage;



//Commit
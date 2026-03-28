import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

const LandingPage = () => {
  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="bg-[#0e0e0e] text-white font-['Inter'] selection:bg-[#4182ff] selection:text-white">
      <Navbar />
      
      {/* 1. HERO SECTION (Assumed inside Hero component) */}
      <Hero />

      {/* 2. MISSION CONTROL SECTION */}
      <section className="max-w-[1400px] mx-auto px-10 py-32 border-t border-white/5">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-5xl lg:text-7xl font-black font-['Manrope'] tracking-tighter mb-8 italic leading-none">
              Beyond the <br/><span className="text-[#adc7ff]">Static Ledger</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
              Traditional accounting is reactive—you find out what happened last month, next month. QueryFlow Vault is <strong className="text-white">proactive</strong>. We sync with your entity nodes to provide a live "Snapshot of Truth."
            </p>
            <div className="space-y-8">
              <div className="flex gap-6 group">
                <span className="text-[#66dd8b] font-black text-xl">01</span>
                <div>
                  <h4 className="text-white font-bold mb-1 uppercase tracking-wider">Unified Visibility</h4>
                  <p className="text-sm text-gray-500">Connect multiple bank terminals and digital vaults into one interface.</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <span className="text-[#66dd8b] font-black text-xl">02</span>
                <div>
                  <h4 className="text-white font-bold mb-1 uppercase tracking-wider">Algorithmic Foresight</h4>
                  <p className="text-sm text-gray-500">Predict tax liabilities and capital gains before the quarter ends.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "backOut" }}
            viewport={{ once: true }}
            className="relative bg-[#131313] p-16 rounded-[4rem] border border-white/5 aspect-square flex items-center justify-center overflow-hidden"
          >
            {/* Background Glow Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#4182ff]/10 blur-[100px] rounded-full"></div>
            
            <div className="text-center relative z-10">
              <motion.div 
                initial={{ y: 20 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl font-black text-[#4182ff] mb-4 tracking-tighter"
              >
                94%
              </motion.div>
              <p className="text-[12px] uppercase font-black tracking-[0.3em] text-gray-500">Reduction in Manual Audit Time</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. FEATURES GRID (New addition for better flow) */}
      <section className="bg-white/5 py-32">
        <div className="max-w-[1400px] mx-auto px-10">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h3 className="text-4xl font-black uppercase tracking-widest">Protocol Features</h3>
            <div className="w-20 h-1 bg-[#4182ff] mx-auto mt-4"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Vault Security", desc: "Military-grade encryption for your asset data." },
              { title: "AI Auditor", desc: "Real-time Profit & Loss calculation on every trade." },
              { title: "Tax Oracle", desc: "Automated GST and Capital Gains tracking." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="p-10 bg-[#0e0e0e] border border-white/10 hover:border-[#4182ff]/50 transition-colors"
              >
                <h4 className="text-xl font-bold mb-4 text-[#adc7ff] uppercase">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="py-32 text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-10"
        >
          <h2 className="text-5xl font-black mb-10 tracking-tighter uppercase italic">Ready to secure your <span className="text-[#4182ff]">Financial Node</span>?</h2>
          <Link to="/login">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-[#4182ff] text-white font-black uppercase tracking-[0.2em] text-sm border border-[#4182ff] transition-all"
            >
              Initialize Access
            </motion.button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
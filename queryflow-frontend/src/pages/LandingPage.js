import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

const LandingPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <div className="bg-[#080808] text-white font-['Inter'] overflow-x-hidden">
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. THE BENTO GRID (Services/Features) */}
      <section className="max-w-[1400px] mx-auto px-6 py-32">
        <motion.div {...fadeInUp} className="mb-20">
          <span className="text-[#4182ff] uppercase tracking-[0.3em] text-[10px] font-bold border border-[#4182ff]/30 px-3 py-1 rounded-full">
            Core Infrastructure
          </span>
          <h2 className="text-5xl md:text-7xl font-black mt-6 tracking-tighter italic">
            AUTOMATE YOUR <br/><span className="text-gray-500">FISCAL FLOW</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-6">
          {/* Big Bento Box */}
          <motion.div 
            {...fadeInUp}
            className="md:col-span-8 bg-[#111111] border border-white/5 rounded-[2.5rem] p-12 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4 uppercase">Predictive Audit</h3>
              <p className="text-gray-500 max-w-sm mb-8">Our AI nodes scan 10,000+ data points to predict tax liabilities before they hit your ledger.</p>
              <div className="flex gap-2">
                <span className="h-2 w-2 rounded-full bg-[#66dd8b] animate-pulse" />
                <span className="text-[10px] uppercase font-bold text-gray-400">System Active</span>
              </div>
            </div>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4182ff]/10 blur-[80px] rounded-full group-hover:bg-[#4182ff]/20 transition-all" />
          </motion.div>

          {/* Small Bento Box */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 bg-[#4182ff] rounded-[2.5rem] p-12 text-black flex flex-col justify-between"
          >
            <span className="material-symbols-outlined text-5xl">bolt</span>
            <div>
              <h3 className="text-2xl font-black uppercase leading-tight">Sub-4ms <br/>Latency</h3>
              <p className="text-black/60 text-sm mt-2">Institutional speed for asset indexing.</p>
            </div>
          </motion.div>

          {/* Bottom Row Bento */}
          <motion.div 
            {...fadeInUp}
            className="md:col-span-4 bg-[#111111] border border-white/5 rounded-[2.5rem] p-10"
          >
            <h4 className="font-bold text-[#4182ff] mb-2 uppercase text-xs">Security</h4>
            <p className="text-sm text-gray-500 font-medium">AES-256 Sharded Storage</p>
          </motion.div>

          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="md:col-span-8 bg-[#111111] border border-white/5 rounded-[2.5rem] p-10 flex items-center justify-between"
          >
            <p className="text-lg font-bold italic">Ready to integrate your nodes?</p>
            <Link to="/login" className="bg-white text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">Connect</Link>
          </motion.div>
        </div>
      </section>

      {/* 3. THE "PROCESS" SECTION (Xtract Style 1-2-3) */}
      <section className="bg-[#0c0c0c] py-32 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { step: "01", title: "Ingestion", desc: "Connect your bank APIs and digital wallets to the QueryFlow Terminal." },
              { step: "02", title: "Synthesis", desc: "Our AI model categorizes transactions and calculates real-time P&L." },
              { step: "03", title: "Optimization", desc: "Receive automated tax provisions and capital growth suggestions." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className="text-[80px] font-black text-white/5 absolute -top-10 -left-4">{item.step}</div>
                <h4 className="text-xl font-bold mb-4 relative z-10 text-[#adc7ff] uppercase italic">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FINAL CALL TO ACTION */}
      <section className="py-40 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[#4182ff]/5 blur-[120px] rounded-full translate-y-1/2" />
        <motion.div {...fadeInUp} className="relative z-10">
          <h2 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter italic">JOIN THE <br/>REVOLUTION.</h2>
          <Link to="/login">
            <button className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#4182ff] hover:text-white transition-all duration-500">
              Initialize System Access
            </button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
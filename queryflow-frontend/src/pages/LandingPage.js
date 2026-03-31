import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

const LandingPage = () => {
  // Global animation preset for "Institutional" entrance
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <div className="bg-[#080808] text-white font-['Inter'] selection:bg-[#4182ff] selection:text-white overflow-x-hidden">
      <Navbar />
      
      {/* 1. HERO SECTION (Akio Physics-based Text) */}
      <Hero />

      {/* 2. THE BENTO GRID (Institutional Services) */}
      <section className="max-w-[1400px] mx-auto px-6 py-40">
        <motion.div {...fadeInUp} className="mb-24 flex flex-col items-center text-center">
          <span className="text-[#4182ff] uppercase tracking-[0.6em] text-[9px] font-black border border-[#4182ff]/30 px-6 py-2 rounded-full backdrop-blur-sm">
            Core Infrastructure // v4.0.26
          </span>
          <h2 className="text-6xl md:text-[8vw] font-black mt-10 tracking-tighter italic leading-[0.85] uppercase">
            AUTOMATE YOUR <br/>
            <span className="text-transparent outline-text opacity-30">FISCAL FLOW</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-6 perspective-[2000px]">
          {/* Predictive Audit Box */}
          <motion.div 
            {...fadeInUp}
            className="md:col-span-8 bg-[#111111] border border-white/5 rounded-[3rem] p-12 relative overflow-hidden group hover:border-[#4182ff]/30 transition-colors duration-500"
          >
            <div className="relative z-10 h-full flex flex-col justify-between min-h-[300px]">
              <div>
                <h3 className="text-4xl font-black mb-6 uppercase italic tracking-tighter">Predictive Audit</h3>
                <p className="text-gray-500 max-w-md text-sm leading-relaxed font-medium">
                  Our AI nodes scan 10,000+ data points to predict tax liabilities and fiscal leakages before they hit your secondary ledger.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#66dd8b] animate-pulse shadow-[0_0_10px_#66dd8b]" />
                <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">Node Sync: Stable</span>
              </div>
            </div>
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#4182ff]/5 blur-[100px] rounded-full group-hover:bg-[#4182ff]/15 transition-all duration-700" />
          </motion.div>

          {/* Speed Indicator Box */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 bg-[#4182ff] rounded-[3rem] p-12 text-black flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-500 cursor-default"
          >
            <div className="text-6xl font-black italic tracking-tighter uppercase leading-none">
              4ms
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase leading-tight tracking-tighter italic">Institutional <br/>Latency</h3>
              <p className="text-black/60 text-[11px] font-black uppercase tracking-widest mt-4">Real-time Indexing</p>
            </div>
          </motion.div>

          {/* Security Spec Box */}
          <motion.div 
            {...fadeInUp}
            className="md:col-span-4 bg-[#111111] border border-white/5 rounded-[3rem] p-12 flex flex-col justify-center"
          >
            <h4 className="font-black text-[#4182ff] mb-4 uppercase text-[10px] tracking-[0.4em]">Protocol</h4>
            <p className="text-2xl font-black italic uppercase tracking-tighter">AES-256 <br/>Sharded Vault</p>
          </motion.div>

          {/* Connectivity Box */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="md:col-span-8 bg-[#111111] border border-white/5 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8 group"
          >
            <div>
              <p className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-[#4182ff] transition-colors">Initialize Node Integration?</p>
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-2">External API bridge v2.0</p>
            </div>
            <Link to="/login" className="w-full md:w-auto text-center bg-white text-black px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#4182ff] hover:text-white transition-all duration-500 shadow-xl active:scale-95">
              Connect
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 3. THE "PROCESS" SECTION (Xtract Terminal Steps) */}
      <section className="bg-[#0c0c0c] py-48 border-y border-white/5 relative overflow-hidden">
        {/* Decorative Grid Line */}
        <div className="absolute top-0 left-1/2 w-px h-full bg-white/5 -translate-x-1/2" />
        
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-24">
            {[
              { step: "01", title: "Ingestion", desc: "Connect your bank APIs and digital wallets to the QueryFlow Terminal for unified data aggregation." },
              { step: "02", title: "Synthesis", desc: "Our proprietary AI model categorizes transactions and calculates real-time P&L with 99.8% precision." },
              { step: "03", title: "Optimization", desc: "Receive automated tax provisions and institutional-grade capital growth suggestions via the vault." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className="text-[120px] font-black text-white/[0.03] absolute -top-20 -left-10 select-none">{item.step}</div>
                <h4 className="text-2xl font-black mb-6 relative z-10 text-white uppercase italic tracking-tighter">
                   <span className="text-[#4182ff] mr-4">//</span> {item.title}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FINAL CALL TO ACTION (Akio Massive Style) */}
      <section className="py-60 text-center relative overflow-hidden">
        {/* Intense background glow */}
        <div className="absolute inset-0 bg-[#4182ff]/5 blur-[150px] rounded-full translate-y-1/2 pointer-events-none" />
        
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="relative z-10 px-6"
        >
          <h2 className="text-7xl md:text-[10vw] font-black mb-16 tracking-tighter italic leading-[0.75] uppercase">
            JOIN THE <br/>
            <span className="text-[#4182ff]">REVOLUTION.</span>
          </h2>
          <Link to="/login">
            <button className="px-16 py-8 bg-white text-black font-black uppercase tracking-[0.5em] text-[11px] hover:bg-[#4182ff] hover:text-white transition-all duration-700 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              Initialize System Access
            </button>
          </Link>
          <p className="mt-12 text-gray-700 text-[10px] font-black uppercase tracking-[1.2em] opacity-50">
            Node: Bharthia_Primary // Global Deployment
          </p>
        </motion.div>
      </section>

      {/* 5. FOOTER (System Log Integration) */}
      <Footer />

      {/* Global CSS for the Akio Outline Effect */}
      <style dangerouslySetInnerHTML={{ __html: `
        .outline-text {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.5);
          text-shadow: 0 0 30px rgba(255,255,255,0.05);
        }
        body::-webkit-scrollbar {
          width: 5px;
        }
        body::-webkit-scrollbar-track {
          background: #080808;
        }
        body::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 10px;
        }
        body::-webkit-scrollbar-thumb:hover {
          background: #4182ff;
        }
      `}} />
    </div>
  );
};

export default LandingPage;


//commit4
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function FeaturesPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <div className="bg-[#050505] min-h-screen text-white font-['Inter'] relative" style={{ perspective: "1200px" }} ref={containerRef}>
      <Navbar />
      <motion.div 
        className="w-full relative origin-top z-10"
        style={{ rotateX, scale }}
      >
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#4182ff]/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-40 pb-20">
        
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-10 italic"
        >
          PRECISION<br/>
          <span className="text-gradient">ARCHITECTURE</span>
        </motion.h1>
        <p className="text-gray-400 max-w-2xl text-lg mb-20">
          QueryFlow integrates 50+ AI models designed exclusively for financial infrastructure. 
          Track, automate, and optimize your institutional-grade assets with real-time sub-5ms indexing and robust tax provisioning.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {[
            { icon: "⚡", title: "SKU Indexing", desc: "Instantly catalog structured and unstructured financial sets dynamically. Unify diverse global accounts into a single synchronized ledger.", color: "#4182ff" },
            { icon: "🧠", title: "CFO AI Advisor", desc: "Predictive cashflow models, runway estimations, and margin improvements. Ask questions in natural language and get board-ready insights.", color: "#66dd8b" },
            { icon: "🏦", title: "Tax Provisioning", desc: "Automate global tax liability with real-time audit-ready ledgers. Continuously calculates offsets and prevents reporting penalties.", color: "#fbbc00" },
            { icon: "🔗", title: "API Ecosystem", desc: "Integrate with Plaid, Stripe, and 500+ global financial institutions. Bi-directional sync guarantees zero manual entry.", color: "#8b5cf6" },
            { icon: "🛡", title: "Quantum Secure", desc: "Encrypted memory enclaves, AES-256, and zero-knowledge storage. Distributed sharding ensures zero single point of failure.", color: "#22d3ee" },
            { icon: "📊", title: "Dynamic Reporting", desc: "Custom dashboards bridging compliance and strategic growth. Export directly to SEC-compliant formats or dynamic PDF presentations.", color: "#f472b6" }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 hover-glow group cursor-default relative overflow-hidden"
            >
               <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 transition-opacity group-hover:opacity-50" style={{background: f.color}}></div>
               <div className="text-4xl mb-6 float-element">{f.icon}</div>
               <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4" style={{color: f.color}}>{f.title}</h3>
               <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Deep Dive Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass p-10 md:p-16 relative overflow-hidden mb-20"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-6">
                Deep <span className="text-[#8b5cf6]">Synthesis</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Our synthesis engine doesn&apos;t just read data; it understands context. When a transaction occurs, QueryFlow crosses it against localized tax laws, vendor history, and your specific budgetary constraints within 4 milliseconds.
              </p>
              <ul className="space-y-4">
                {["Vendor-Assigned Categorization", "Predictive Churn Alerts", "Multi-Entity Consolidation", "Smart Fraud Detection"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="glass p-6 md:p-8 bg-black/50 border-white/5">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <span className="text-xs font-mono text-gray-500 uppercase">Live Stream</span>
                <span className="flex items-center gap-2 text-xs font-mono text-[#66dd8b] uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#66dd8b] animate-pulse"></span> Synced
                </span>
              </div>
              <div className="space-y-3 font-mono text-xs text-gray-400">
                <div className="flex justify-between"><span>&gt; INGEST TXN_8921</span> <span className="text-[#4182ff]">1.2ms</span></div>
                <div className="flex justify-between"><span>&gt; CLASSIFY VENDOR_AWS</span> <span className="text-[#4182ff]">0.8ms</span></div>
                <div className="flex justify-between"><span>&gt; CHECK BUDGET_Q3</span> <span className="text-[#4182ff]">0.5ms</span></div>
                <div className="flex justify-between"><span>&gt; ALLOCATE TAX_PROV</span> <span className="text-[#4182ff]">1.4ms</span></div>
                <div className="flex justify-between font-bold text-white border-t border-white/10 pt-3"><span>&gt; CYCLE COMPLETE</span> <span className="text-[#66dd8b]">3.9ms</span></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      </motion.div>
      <div className="relative z-20 bg-[#050505]">
        <Footer />
      </div>
    </div>
  );
}

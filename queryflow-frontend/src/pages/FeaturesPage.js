import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function FeaturesPage() {
  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden font-['Inter']">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-40 pb-40">
        
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: "⚡", title: "SKU Indexing", desc: "Instantly catalog structured and unstructured financial sets dynamically.", color: "#4182ff" },
            { icon: "🧠", title: "CFO AI Advisor", desc: "Predictive cashflow models, runway estimations, and margin improvements.", color: "#66dd8b" },
            { icon: "🏦", title: "Tax Provisioning", desc: "Automate global tax liability with real-time audit-ready ledgers.", color: "#fbbc00" },
            { icon: "🔗", title: "API Ecosystem", desc: "Integrate with Plaid, Stripe, and 500+ global financial institutions.", color: "#8b5cf6" },
            { icon: "🛡", title: "Quantum Secure", desc: "Encrypted memory enclaves, AES-256, and zero-knowledge storage.", color: "#22d3ee" },
            { icon: "📊", title: "Dynamic Reporting", desc: "Custom dashboards bridging compliance and strategic growth.", color: "#f472b6" }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 hover-glow group cursor-default"
            >
               <div className="text-4xl mb-6 float-element">{f.icon}</div>
               <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4" style={{color: f.color}}>{f.title}</h3>
               <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

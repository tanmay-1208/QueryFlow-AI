import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SecurityPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen text-white pt-40 overflow-hidden relative">
    <Navbar />
    
    {/* Scanning Line Animation */}
    <motion.div 
      animate={{ top: ["0%", "100%", "0%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      className="absolute left-0 right-0 h-[1px] bg-[#4182ff]/20 z-0 pointer-events-none"
    />

    <div className="max-w-[1400px] mx-auto px-10 pb-40 relative z-10">
      <motion.h1 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-8xl font-black tracking-tighter mb-10 italic leading-none"
      >
        FORTRESS<br/><span className="text-[#66dd8b]">ENCRYPTION</span>
      </motion.h1>
      
      <div className="grid lg:grid-cols-2 gap-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="p-10 bg-white/5 border-l-4 border-[#66dd8b] backdrop-blur-sm"
        >
          <h4 className="font-black text-[#66dd8b] mb-4 uppercase tracking-widest text-sm">Active Status: Secure</h4>
          <p className="text-gray-400 leading-relaxed italic">"Your data is sharded across multiple decentralized nodes. Even if one node is compromised, the primary vault remains invisible to external probes."</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-10 bg-white/5 border-l-4 border-[#4182ff] backdrop-blur-sm"
        >
          <h4 className="font-black text-[#4182ff] mb-4 uppercase tracking-widest text-sm">Biometric Sync</h4>
          <p className="text-gray-400 leading-relaxed">Multi-factor authentication via hardware keys and behavioral biometrics ensures only the designated Operator can access the terminal.</p>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default SecurityPage;
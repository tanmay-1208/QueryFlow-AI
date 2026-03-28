import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SecurityPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen text-white pt-40 overflow-hidden">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-10 pb-40">
      <div className="relative">
        {/* Animated Scanning Line */}
        <motion.div 
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-[#4182ff]/30 z-0"
        />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10"
        >
          <h1 className="text-8xl font-black tracking-tighter mb-10 italic">FORTRESS<br/><span className="text-[#66dd8b]">ENCRYPTION</span></h1>
          
          <div className="grid lg:grid-cols-2 gap-20">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-10 bg-white/5 border-l-4 border-[#66dd8b]"
            >
              <h4 className="font-black text-[#66dd8b] mb-4 uppercase tracking-widest">Active Status: Secure</h4>
              <p className="text-gray-400">Your data is sharded across multiple decentralized nodes. Even if one node is compromised, your vault remains invisible.</p>
            </motion.div>

            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="p-10 bg-white/5 border-l-4 border-[#4182ff]"
            >
              <h4 className="font-black text-[#4182ff] mb-4 uppercase tracking-widest">Biometric Sync</h4>
              <p className="text-gray-400">Multi-factor authentication via hardware keys and behavioral biometrics ensures only the Operator can access the terminal.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default SecurityPage;
import React from "react";
import { motion } from "framer-motion"; // CRITICAL: This was missing
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FeaturesPage = () => {
  // Animation settings for the cards
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1, 
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" }
    })
  };

  return (
    <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white overflow-x-hidden">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-10 pb-40">
        
        {/* Animated Header */}
        <motion.h1 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-[100px] font-black font-['Manrope'] tracking-tighter mb-20"
        >
          Precision<br/>
          <span className="text-[#adc7ff]">Architecture</span>
        </motion.h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div 
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="bg-[#1c1b1b] p-12 rounded-[3rem] border border-white/5 hover:border-[#4182ff]/30 transition-colors group"
          >
            <span className="material-symbols-outlined text-[#4182ff] mb-6 text-4xl group-hover:scale-110 transition-transform">analytics</span>
            <h3 className="text-2xl font-black mb-4 uppercase">Real-time SKU Indexing</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Our proprietary engine calculates asset depreciation and market fluctuations with 4ms latency. Your balance sheet is never more than a second out of sync.</p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="bg-[#1c1b1b] p-12 rounded-[3rem] border border-white/5 hover:border-[#66dd8b]/30 transition-colors group"
          >
            <span className="material-symbols-outlined text-[#66dd8b] mb-6 text-4xl group-hover:scale-110 transition-transform">psychology</span>
            <h3 className="text-2xl font-black mb-4 uppercase">CFO AI Advisor</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Integrated natural language processing allows you to query your fiscal data. Ask "What is my net profit?" and get instant answers.</p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="bg-[#1c1b1b] p-12 rounded-[3rem] border border-white/5 hover:border-[#fbbc00]/30 transition-colors group"
          >
            <span className="material-symbols-outlined text-[#fbbc00] mb-6 text-4xl group-hover:scale-110 transition-transform">account_balance_wallet</span>
            <h3 className="text-2xl font-black mb-4 uppercase">Automated Tax Provisioning</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Automatically set aside reserves for GST/VAT and capital gains taxes based on regional jurisdiction. No more surprises during year-end.</p>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FeaturesPage;
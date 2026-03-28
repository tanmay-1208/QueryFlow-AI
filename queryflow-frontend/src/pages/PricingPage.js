import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PricingPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen text-white pt-40">
    <Navbar />
    <div className="max-w-[1200px] mx-auto px-10 pb-40 text-center">
      <motion.h1 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-6xl font-black mb-20 tracking-tighter"
      >
        SELECT YOUR <span className="text-[#4182ff]">TIER</span>
      </motion.h1>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: "Starter", price: "0" },
          { name: "Pro", price: "49", featured: true },
          { name: "Enterprise", price: "Custom" }
        ].map((plan, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ y: -10 }}
            className={`p-10 rounded-3xl border ${plan.featured ? 'border-[#4182ff] bg-[#131313]' : 'border-white/5 bg-[#0e0e0e]'}`}
          >
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">{plan.name}</h3>
            <div className="text-4xl font-black mb-6">${plan.price}<span className="text-sm text-gray-500">/mo</span></div>
            <button className={`w-full py-3 rounded-full font-bold uppercase text-xs tracking-widest transition-all ${plan.featured ? 'bg-[#4182ff] text-white' : 'bg-white text-black'}`}>
              Deploy Node
            </button>
          </motion.div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

export default PricingPage;
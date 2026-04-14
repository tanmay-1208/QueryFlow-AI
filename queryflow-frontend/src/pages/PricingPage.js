import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PricingPage = () => {
  return (
    <div className="bg-[#0e0e0e] min-h-screen text-white pt-32 md:pt-40 overflow-x-hidden">
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pb-40 text-center">
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-[13vw] md:text-[8vw] font-black leading-[0.9] md:leading-[0.8] mb-16 md:mb-20 tracking-tighter uppercase w-full break-words"
        >
          SELECT YOUR <br className="block md:hidden" /><span className="text-[#4182ff]">TIER</span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { name: "Starter", price: "0" },
            { name: "Pro", price: "49", featured: true },
            { name: "Enterprise", price: "Custom" }
          ].map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className={`p-8 md:p-6 md:p-10 rounded-[2.5rem] border transition-all ${plan.featured ? 'border-[#4182ff] bg-[#131313] shadow-[0_0_30px_rgba(65,130,255,0.1)]' : 'border-white/5 bg-[#0e0e0e]'}`}
            >
              <h3 className="text-lg md:text-xl font-bold mb-4 uppercase tracking-widest">{plan.name}</h3>
              <div className="text-3xl md:text-5xl font-black mb-6 italic">
                {plan.price !== "Custom" ? `₹${plan.price}` : plan.price}
                {plan.price !== "Custom" && <span className="text-sm text-gray-500 not-italic">/mo</span>}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-4 rounded-xl font-black uppercase text-[14px] md:text-[10px] md:text-xs tracking-[0.2em] transition-all ${plan.featured ? 'bg-[#4182ff] text-white' : 'bg-white text-black hover:bg-gray-200'}`}
              >
                Deploy Node
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;


//commit"default"
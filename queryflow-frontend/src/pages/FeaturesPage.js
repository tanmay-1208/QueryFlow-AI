import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FeaturesPage = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateY: 10 },
    visible: (i) => ({
      opacity: 1, 
      y: 0, 
      rotateY: 0,
      transition: { delay: i * 0.1, duration: 0.8, ease: "easeOut" }
    })
  };

  // make changes n2

  return (
    <div className="bg-[#0e0e0e] min-h-screen text-white pt-40 overflow-x-hidden">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-10 pb-40">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-7xl md:text-[100px] font-black tracking-tighter mb-20 italic"
        >
          PRECISION<br/><span className="text-[#4182ff]">ARCHITECTURE</span>
        </motion.h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            { icon: "analytics", title: "SKU Indexing", color: "#4182ff" },
            { icon: "psychology", title: "CFO AI Advisor", color: "#66dd8b" },
            { icon: "security", title: "Tax Provisioning", color: "#fbbc00" }
          ].map((f, i) => (
            <motion.div 
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05, 
                rotateX: -5, 
                rotateY: 5,
                boxShadow: `0px 20px 50px rgba(0,0,0,0.5), 0px 0px 20px ${f.color}33` 
              }}
              className="bg-[#131313] p-12 rounded-[3rem] border border-white/5 cursor-pointer relative group"
            >
              <span className="material-symbols-outlined mb-6 text-5xl" style={{color: f.color}}>{f.icon}</span>
              <h3 className="text-2xl font-black mb-4 uppercase">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">High-velocity data processing with sub-4ms latency for real-time asset tracking.</p>
              
              {/* Micro-interaction: revealing line on hover */}
              <motion.div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-current w-0 group-hover:w-1/2 transition-all duration-500"
                style={{color: f.color}}
              />
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FeaturesPage;